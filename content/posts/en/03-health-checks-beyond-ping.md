---
title: "Health Checks: Why a /ping That Returns pong Tells You Very Little"
seoTitle: "Health Checks Done Right: More Than /ping"
slug: health-checks-more-than-ping
description: "A /ping endpoint only tells you the process is running. This post covers what a real health check does, how liveness differs from readiness, and how to build one with NestJS Terminus."
keywords: "health check, liveness probe, readiness probe, NestJS Terminus, Spring Boot Actuator, ASP.NET Core health checks, Kubernetes probes, backend monitoring"
tags: "Backend, NestJS, Kubernetes, Monitoring"
date: 2026-11-13
---

# Health Checks: Why a /ping That Returns pong Tells You Very Little

Almost every backend project has an endpoint like this:

```ts
@Get('ping')
ping() {
  return 'pong'
}
```

You call it, see `pong`, and relax. The monitoring dashboard is green. Then one evening Redis hangs, users get an error every time they place an order, and the dashboard is still green. Nobody is paged until customers start messaging support.

The `/ping` endpoint is not wrong. It answers one narrow question, and people tend to read it as the answer to a broader one.

## What /ping actually measures

It tells you exactly one thing: the process is alive and still accepts HTTP requests.

Whether the app can talk to the database, whether Redis responds, whether the queue is connected, whether the image bucket accepts writes: `/ping` asks about none of that. An app that has lost all of those connections still returns `pong` quickly, because returning a fixed string needs nothing.

A real health check asks each thing the app depends on, combines the results, and answers with an HTTP status a machine can read: 200 if things are fine, 503 if not.

## Every major framework has one

You don't have to write this from scratch. The names differ but the idea is the same: one path, with a list of checks behind it.

- **Spring Boot** has Actuator. Add the library and you get `/actuator/health`. The database, Redis and disk space are checked automatically when the app uses them. Kafka is not in the [built-in list](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html), so you write your own `HealthIndicator`. One `DOWN` component makes the whole endpoint return 503.
- **ASP.NET Core** ships the middleware: call `AddHealthChecks()` and then `MapHealthChecks("/healthz")`. By default it checks no components; you register each one. Database checks need an extra package.
- **NestJS** has `@nestjs/terminus`, which is what I use and what the examples below are written in.

## Building one with NestJS Terminus

Install the package:

```bash
npm install @nestjs/terminus
```

Terminus comes with several indicators: TypeORM, Prisma, Mongoose, Sequelize and MikroORM for databases, HTTP for calling another service, plus memory and disk. A basic controller looks like this:

```ts
import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus'
import { RedisHealthIndicator } from './redis.health'

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.isHealthy('redis'),
    ])
  }
}
```

When everything is fine the endpoint returns 200 with `"status": "ok"`. When a component fails it returns 503, `status` becomes `"error"`, and the failed component appears under `error` in the JSON.

There is no built-in Redis indicator, so you write one. According to the [Terminus docs](https://docs.nestjs.com/recipes/terminus), the current way is to use `HealthIndicatorService`:

```ts
import { Inject, Injectable } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'
import type Redis from 'ioredis'

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key)
    try {
      await withTimeout(this.redis.ping(), 1000)
      return indicator.up()
    } catch (error) {
      return indicator.down({ message: (error as Error).message })
    }
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)),
  ])
}
```

`withTimeout` is not there for decoration. A hung Redis usually does not refuse the connection. It just goes quiet. `ping()` then waits forever, the health endpoint waits with it, and your monitoring records a timed-out request instead of a clear answer. Every check needs its own time limit, shorter than the caller's.

## Liveness and readiness are two different questions

This is where many people stop: one `/health` endpoint that checks everything, handed to Kubernetes for every probe. It is an easy way to cause your own outage.

Kubernetes asks two questions and reacts to each very differently:

- **Liveness:** is the app stuck? If this probe fails more times than allowed, Kubernetes restarts the container.
- **Readiness:** is the app ready to take requests? If it fails, the pod is removed from the list that receives traffic. The container is not restarted.

Now think it through: if liveness also checks Redis, then when Redis goes down every one of your pods gets restarted, over and over. Restarting the app does not fix Redis. You now have a second incident on top of the first.

The Spring Boot docs say outright that the liveness probe should not depend on health checks for external systems. The [Kubernetes docs](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) also warn that a badly implemented liveness probe can lead to cascading failures, and that it should only fail for unrecoverable problems such as a deadlock.

So I split it into two paths:

```ts
@Get('live')
@HealthCheck()
live() {
  // The process answering is enough. Ask nothing outside it.
  return this.health.check([])
}

@Get('ready')
@HealthCheck()
ready() {
  return this.health.check([
    () => this.db.pingCheck('database'),
    () => this.redis.isHealthy('redis'),
  ])
}
```

With the matching Kubernetes configuration:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
```

The funny part is that `/health/live` is nearly the original `/ping`. So `/ping` does have a use, as long as it is asked the right question.

## Not everything belongs in readiness

Readiness needs selecting too. The question to ask about each dependency is: without it, can the app still do anything useful?

The main database almost certainly belongs there, because without it every request fails. But if the image bucket only serves the change-avatar feature and you pull the whole pod out of traffic when the bucket misbehaves, users lose the features that were working fine as well.

There is one more case: a dependency shared by every pod. When it fails, all pods report not ready at once and no pod is left to take requests. Users see a blank gateway error instead of a proper error message from the app. For dependencies like that, letting the app return a meaningful error is often the better choice.

Non-critical dependencies are still worth watching, but on a separate endpoint for monitoring and alerting, not wired to a probe.

## Things that get missed

- **Don't expose the details publicly.** The health JSON names each infrastructure component and its error message, which is useful to anyone probing your system. Spring Boot hides details by default. With NestJS it is on you: expose the endpoint only on the internal network, or block it at the gateway.
- **Health checks cost resources too.** A probe runs every few seconds on every pod. A check should be one cheap command such as `SELECT 1` or `PING`, not a real query.
- **Being connected is not the same as working.** A successful `PING` does not mean the account still has write permission. If permissions are what tends to break in your system, check that exact operation.
- **Shut down gracefully.** Terminus has a `gracefulShutdownTimeoutMs` option that lets the app report not ready for a moment before it stops, so the load balancer can stop sending requests. Enable shutdown hooks, or it never receives the signal.

## In one sentence

`/ping` answers "is the process alive", and that is the right question for liveness. "Can the app serve users" is a different question: ask each critical dependency, with a time limit, and answer on a separate path for readiness.

I wrote more about time limits and handling slow external dependencies in the post on [timeouts, retries and fallbacks](/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency). It is about LLMs, but the principles apply to any external service. And if you want to know which backend projects I have worked on, see the [experience section on my homepage](/#experience).
