---
title: "What Is MCP (Model Context Protocol) and Why Developers Should Care"
seoTitle: "What Is MCP (Model Context Protocol)? A Developer Guide"
slug: what-is-mcp-model-context-protocol
description: "What is MCP (Model Context Protocol)? How it turns N×M AI tool integrations into N+M, plus a minimal MCP server in TypeScript."
keywords: "MCP, Model Context Protocol, AI tool integration, MCP server, AI agent, AI for developers"
tags: "AI, MCP, Agent, Developer"
date: 2026-03-18
cover: /images/blog/10-mcp-model-context-protocol-v2.webp
---

# What Is MCP (Model Context Protocol) and Why Developers Should Care

**MCP ([Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)) is an open protocol, started by Anthropic, that standardizes how AI applications connect to external tools and data sources.** Write one MCP server for your tool, and every MCP-capable client, such as Claude, Cursor or VS Code, can use it.

In [the post on tool calling](/ai-for-devs/ai-agent-dau-tien-function-calling), we saw an agent become more capable once it's given tools: looking up data, calling APIs, reading files. But after doing this a few times you hit a very engineering kind of pain: every AI application has to rewrite how it connects to each tool. App A wants to read GitHub, so it builds a GitHub integration; app B also wants to read GitHub, so it... builds one from scratch. Multiply by dozens of tools and dozens of apps and you get the classic **N×M** integration problem.

**MCP — the Model Context Protocol** — exists to turn N×M into **N+M**. That's why it's worth a developer's attention, even if you don't work on AI yet.

## The core idea: one shared protocol

MCP is an open protocol that standardizes how an AI application (the *host/client*) talks to an external source of tools and data (the *server*). Instead of every app inventing its own connection, they all speak the same "language".

The usual analogy: MCP is a **USB-C port for AI**. Before USB, every device had its own plug. With a shared standard, any device works in any port. With MCP: write *one* server for your tool (say, "query the internal CRM") and *every* MCP-capable client can use it — no rewriting it for each app.

## An MCP server exposes three things

- **Tools** — actions the model can call (query a database, create an issue, send a message). Like tool calling from the previous post, but standardized.
- **[Resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources)** — data the model can read (files, records, documents).
- **Prompts** — ready-made prompt templates for common tasks.

A client (an IDE with AI, a chat app, an agent) connects to the server, asks "what do you have?", and lets the model use those tools and resources through a single protocol.

## A minimal MCP server in TypeScript

To show there's nothing scary about it, here's a server exposing one tool:

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'crm', version: '1.0.0' });

server.tool(
  'get_customer',
  'Get customer details by id',
  { id: z.string() },
  async ({ id }) => {
    const customer = await db.customers.find(id); // your real data
    return { content: [{ type: 'text', text: JSON.stringify(customer) }] };
  },
);

await server.connect(new StdioServerTransport());
```

Once it's written, any MCP client (for example an IDE with an AI assistant) can plug in and use the `get_customer` tool, without you knowing the internals of each client.

## Why this matters to you

- **No more rewriting integrations.** One server serves many AI applications — today the assistant in your IDE, tomorrow an internal chatbot, same server.
- **A ready-made ecosystem.** There are already many MCP servers for GitHub, databases, file systems and lots of SaaS products. Often you just plug one in instead of building it.
- **Clear boundaries.** The server is where you control what the model can touch — one central place to enforce permissions and limits, instead of scattering them across every app.

## Don't forget the security lesson

MCP gives the model a doorway into real tools and data, so everything in [the security post](/ai-for-devs/bao-mat-ai-prompt-injection) applies in full, if not more strictly. An MCP server connected to internal systems is an attack surface: apply least privilege to each tool, require approval for actions with side effects, and treat every request from the client or model as untrusted until checked. The convenience of a shared standard doesn't excuse you from control.

At heart, MCP isn't some advanced AI technology — it's an integration standard, exactly the kind of problem developers solve all the time: reduce duplication and separate the connection layer from the application. If you were glad when REST or GraphQL became shared standards, MCP is the same spirit, this time for connecting AI to the outside world. It's worth following and worth building a small server to try.

More about me and what I'm working on: [Nguyen Huynh's homepage](/).
