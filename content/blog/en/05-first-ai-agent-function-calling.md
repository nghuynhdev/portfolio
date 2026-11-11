---
title: "Building Your First AI Agent: Understanding Function/Tool Calling Properly"
seoTitle: "AI Agents and Function Calling: Build Your First Agent"
slug: first-ai-agent-function-calling
description: "How tool calling turns an LLM into an agent that acts: the agent loop, tool schemas and the safety boundaries you must have."
keywords: "AI agent, tool calling, function calling, LLM agent, AI SDK tools, AI for developers"
tags: "AI, Agent, Tool Calling, Developer"
date: 2024-12-03
updated: 2026-11-11
---

# Building Your First AI Agent: Understanding Function/Tool Calling Properly

Marketing has made "AI agent" sound far more mysterious than it is. Strip it down and an agent is just an LLM given some **tools** it can call, plus a **loop** that lets it call a tool, read the result and decide the next step. That's all. No consciousness, no scheming — just token prediction plus the ability to say "I want to run this function with these arguments".

This post goes from the mechanics of tool calling to building a small working agent, and more importantly: what you must block so it doesn't do damage.

## What tool calling really is

An LLM on its own can't run code, can't call APIs and doesn't know the current time. Tool calling fills that gap. You describe a list of functions to the model — name, purpose, parameters (as a schema). When a question needs one of them, the model **doesn't make up the result**; it returns a request: "call `getWeather` with `{ city: 'Da Nang' }`". Your code runs the real function, gets the result and passes it back to the model. The model uses that result to write the answer.

The key point to remember: **the model only proposes the call; your code is what executes it.** That means every safety boundary is in your hands.

## The agent loop

```
User asks
   -> send the question + the list of tools to the model
   -> model: "call tool X with arguments Y"
   -> code runs tool X and gets the result
   -> send the result back to the model
   -> model calls another tool OR gives the final answer
   (repeat until there is an answer, or a step limit is hit)
```

That "repeat until" is the soul of an agent: it can chain several tools (look up data, then calculate, then send an email) to finish a multi-step task.

## Define tools with schemas and run the loop

With the AI SDK, you declare tools with a parameter schema; the SDK also runs the loop that calls the model again after each tool.

```ts
import { generateText, tool, isStepCount } from 'ai';
import { z } from 'zod';

const getWeather = tool({
  description: 'Get the current weather for a city',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => {
    const data = await fetchWeatherApi(city); // your real API
    return { tempC: data.temp, condition: data.condition };
  },
});

const { text } = await generateText({
  model: 'anthropic/claude-haiku-5-5',
  tools: { getWeather },
  stopWhen: isStepCount(5), // prevent infinite loops
  prompt: "What's the weather in Da Nang right now — should I bring a raincoat?",
});
```

The `description` and schema matter a lot: the model relies on them to decide when to call a tool and what to pass. A vague description means wrong calls or no calls. Treat it like writing a docstring for a colleague — one who reads only the exact description you wrote.

## Boundaries you must have

This is the part many people skip and then pay for. Because the model *proposes* and your code *executes*, you have to build the fences yourself:

- **Limit the number of steps.** Always set `stopWhen`. Otherwise a broken loop can call tools forever, burning money and time.
- **Classify tools by risk.** Read-only tools (lookups, calculations) can run freely. Tools with side effects (sending email, deleting data, payments) **need human approval** before execution, or strict limits. How to let an agent re-run without sending the same email twice is covered in [LLM reliability](/ai-for-devs/do-tin-cay-llm-timeout-retry-idempotency).
- **Validate arguments with the schema on the execution side.** Don't blindly trust what the model passes. `city` could be a strange string; a "run SQL" tool that trusts model input directly is an invitation to disaster.
- **Don't let a tool do more than it needs to.** A "read file" tool should be limited to one directory, not the whole machine. The principle of least privilege, just like designing an API.
- **Log every tool call.** When an agent goes wrong, the tool-call log is the only thing that tells you what it "thought" and what it ran.

## Don't rush into "multi-agent"

A common trend is to build a whole cast of agents calling each other to look impressive. In practice, most problems are solved neatly by *one* agent with a few well-defined tools. More agents mean more places to break, harder debugging and multiplied cost. Start with one agent, a few tools and a clear step limit; split only when you really need to.

When the number of tools grows and they need to be shared across apps, look at [MCP](/ai-for-devs/mcp-model-context-protocol-la-gi). And since tools are the doorway attackers exploit, also read the post on [prompt injection](/ai-for-devs/bao-mat-ai-prompt-injection).

Once you've got the loop — "model proposes, code executes, result goes back" — building an agent is no different from writing an orchestrator that calls APIs, except the one deciding which API to call is the model. And because models make mistakes, your engineering job is to build enough fences that those mistakes don't become incidents.

I write this series from the perspective of [a full-stack developer](/) — the person who has to answer for it when an agent goes wrong in production, not just in a demo.
