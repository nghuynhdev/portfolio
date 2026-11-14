---
title: "What a Forward Deployed Engineer Actually Does, and the Trap Nobody Mentions"
seoTitle: "Forward Deployed Engineer (FDE) Explained"
slug: forward-deployed-engineer-explained
description: "A Forward Deployed Engineer writes code inside the customer's systems. How FDEs differ from software engineers and consultants, the skills, and when to pass."
keywords: "forward deployed engineer, what is an FDE, forward deployed software engineer, Palantir Delta, OpenAI FDE, Anthropic FDE, AI engineering careers, deployment engineer"
tags: "Career, Software Engineering, AI, Full Stack"
date: 2026-11-14
---

# What a Forward Deployed Engineer Actually Does, and the Trap Nobody Mentions

Browse the careers pages at OpenAI or Anthropic right now and you'll run into a title no computer science course mentions: Forward Deployed Engineer, or FDE. The pay is high, the bar is several years of experience, and the description reads half like a developer and half like someone who spends a lot of time in client meetings.

An FDE is a software engineer who works **inside** the customer's organization and is responsible for getting their own company's product running for real in that customer's systems. They don't sell, and they don't write advisory reports. They write code, deploy it, and fix production bugs. The production just happens to live in someone else's house.

## The title comes from Palantir

Palantir ran this model early and named it explicitly. Their post [Dev versus Delta](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (2019) lays out the company's two largest engineering roles: Software Engineers, called "Devs" internally, and Forward Deployed Software Engineers, called "Deltas". The name Delta is a leftover from when business development teams were named after letters of the NATO alphabet.

Devs build the platforms (Foundry, Gotham) that many customers use. Deltas sit in Business Development, each attached to one customer, and they're measured by impact on that customer's goal. Palantir sums it up as a neat pair: a Dev's focus is "one capability, many customers", a Delta's is "one customer, many capabilities".

In the last few years the title has spread across AI companies. a16z published [Trading Margin for Moat](https://a16z.com/services-led-growth/) (June 2025), calling it the hottest job in startups. Their reasoning is practical: an enterprise buying an AI product needs it wired into internal databases, APIs and workflows before it's useful, and that wiring doesn't happen through a "Sign up" button.

## What an FDE does day to day

Job postings are the most reliable description of the work, because the company has to write down what it actually needs.

In [OpenAI's FDE posting for London](https://openai.com/careers/forward-deployed-engineer-london-london-uk/), the FDE owns the whole loop: discovery, technical scoping, system design, build, and production rollout alongside the customer's engineers. Success is measured by production adoption and measurable impact on workflows. The posting asks for 5+ years of engineering or deployment experience that includes customer-facing work, production code across frontend and backend, and up to 50% travel.

[Anthropic's FDE posting for London](https://job-boards.greenhouse.io/anthropic/jobs/5423029008) is more specific about deliverables: production applications built with Claude inside customer systems, plus artifacts like MCP servers, sub-agents and agent skills. Travel is 25 to 50%.

If MCP servers are new to you, the post on [what MCP is](/ai-for-devs/mcp-model-context-protocol-la-gi) covers it. That's exactly the kind of work an FDE at an AI company does regularly: the layer between the model and the customer's internal systems.

Put together, an FDE's week mixes a few modes. Some days you sit with the customer's end users and watch how they actually work. Some days you write code, review PRs, and debug a failure that only happens on the customer's infrastructure. And some meetings are with your own product team, telling them feature X is missing.

## How it differs from software engineer, consultant, and solutions engineer

These three roles often get lumped in with FDE.

| | Software Engineer | FDE | Consultant | Solutions Engineer |
|---|---|---|---|---|
| Works for | The product, many customers | One specific customer | One specific customer | The sales team |
| Main output | Code in the core product | A system running in the customer's production | Analysis, recommendations | Demos, PoCs, technical answers |
| When | Continuously | After the deal, ongoing | Per project | Before the deal |
| Measured by | Quality, shipping speed | Real usage, business outcomes | Accepted report | Signed contracts |

Palantir's own Deltas spell out the difference from consulting: consultants usually produce a one-time analysis or solution, while an FDE deploys existing software and leaves behind something the customer keeps using. In practice that means far more code.

With solutions engineers the difference is timing. A solutions engineer helps win the contract. An FDE makes sure it isn't cancelled a year later.

The lines between companies are blurry. Some call solutions engineers FDEs because it's easier to hire for, others call FDEs "implementation engineers". Read the job description, not the title.

## The skills

The technical side isn't mysterious, just wide. You need to read an unfamiliar codebase quickly, connect to someone else's APIs and databases, and deploy onto infrastructure you didn't choose. OpenAI's posting asks for production-grade code across frontend and backend in Python, JavaScript or similar, plus experience building LLM-powered systems.

For a full stack developer working with React, Next.js, Node.js and NestJS, most of that toolkit is already there: spinning up an internal UI fast, writing services that call third-party APIs, handling auth and permissions. What's often missing is judging the quality of model output (the post on [LLM evals](/ai-for-devs/evals-do-chat-luong-llm) covers that) and keeping a system standing when the customer's API is slow or failing.

Harder is what Palantir calls "technical decomp": taking a vague business problem like "reduce defective products coming off the line" and breaking it down to the lines of code you need. You have to ask the right questions and tell real requirements apart from the way users describe their symptoms.

Last, you have to be fine without structure. No PM hands you a written ticket. You set the order and you own the result.

## The trap: every customer becomes a fork

Career intros rarely mention this, yet it's the easiest mistake to make on the job.

FDEs are measured on the customer getting value. The fastest path there is editing the code directly: add an `if (customer === 'acme')`, copy a module and tweak it. Ten customers later the company has ten versions of the product and nobody dares upgrade any of them.

Palantir names this exact choice in their post: FDEs often have to decide whether to invest in building a feature into the core platform, or build something custom that ships faster. Both are right sometimes. What's wrong is making the call implicitly and never writing it down.

The way to keep customer-specific code from leaking into the core is a boundary drawn with an interface. The core knows one contract, each customer gets an adapter:

```ts
// core/ticket-source.ts: the core only knows this interface
export interface Ticket {
  id: string
  subject: string
  body: string
  createdAt: Date
}

export interface TicketSource {
  fetchSince(since: Date): Promise<Ticket[]>
}

// customers/acme/ticket-source.ts: one customer's specifics
type AcmeRow = { ticket_no: number; title: string; content: string; created: string }
type Query = (sql: string, params: unknown[]) => Promise<AcmeRow[]>

export class AcmeTicketSource implements TicketSource {
  constructor(private readonly query: Query) {}

  async fetchSince(since: Date): Promise<Ticket[]> {
    const rows = await this.query(
      'SELECT ticket_no, title, content, created FROM support_tickets WHERE created > $1',
      [since.toISOString()],
    )
    return rows.map((r) => ({
      id: String(r.ticket_no),
      subject: r.title,
      body: r.content,
      // The customer's system stores local time like "2026-11-14T09:30:00" with no offset.
      // State the assumption in the adapter instead of making the core guess.
      createdAt: new Date(`${r.created}+07:00`),
    }))
  }
}
```

The rest of the system, say an LLM pipeline that classifies tickets, only ever receives a `TicketSource`. When the second customer uses Zendesk instead of their own database, you write a `ZendeskTicketSource` and the core doesn't change by a line.

One rule goes with it: anything you write a second time for a second customer moves into the core, and the product team hears about it. Both OpenAI and Anthropic put this in the job description: turn repeatable deployment patterns into shared tooling and feed field insights back to product. A good FDE leaves less custom code behind after each customer, not more.

## When this job isn't a fit

The 25 to 50% travel is the number in the posting, not the worst case. If you need a predictable schedule, that's the first filter.

You'll rarely get to build one thing deeply and beautifully. Most FDE code is glue, data migration scripts, and handling the odd formats of legacy systems. If you enjoy spending a week tuning one algorithm, you'll be frustrated.

The pressure comes from both sides. The customer wants it now, your product team wants you to keep the core clean. You stand in between and have to say "no" to each of them at different times.

On the other hand, if you're tired of picking up tickets with no idea who uses the code afterwards, FDE gives you exactly that: you watch people work with what you just deployed. Palantir also notes plenty of people move back and forth between Dev and Delta, so it isn't a dead end.

## Where to start if you want to try it

You don't need to switch jobs to find out whether it suits you. A few things you can do in your current role:

1. Ask to join an onboarding or rollout for a customer, even an internal one. Note how much of the time is code and how much is asking questions.
2. Next time you get an integration request, write the adapter separately from the core like the example above, then see whether the second integration can reuse it.
3. Build something small that connects an LLM to real data, for example an MCP server that reads an internal database. Almost every FDE posting at AI companies asks for this.
4. Read postings from two or three companies carefully and mark every line you can't yet show evidence for. That list is your study plan.

Put the "full stack" column from those postings next to the [skills list on this site's home page](/#skills) and you'll see a lot of overlap.
