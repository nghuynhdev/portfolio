# Blog image prompts

Generated using the built-in `image_gen` tool. Final covers are WebP, 1600 × 900, saved directly in `public/images/blog/` using the matching article basename. The blog discovers these files automatically; no frontmatter override is needed.

## Shared style

Visual-first technical illustrations for both English and Vietnamese readers. Dark navy, cyan pathways, amber selection highlights, translucent panels, generous negative space. Each image illustrates the mechanism of its own article. Only a few short English technical labels; no heading, paragraphs, long captions or code blocks. Examples are schematic illustrations, not measurements or screenshots of the live site.

The exact generation prompt and source for every final cover are recorded in [PROMPTS.json](./PROMPTS.json).

## 01 — LLM

Token chips enter a visibly layered transformer model; output probability bars select one amber next token; feedback arrow appends token to input sequence.

Labels: Tokens, LLM, Next token.

## 02 — Prompt engineering

Separate structured instruction cards and one data card feed a model, a clean structured JSON object emerges through a schema check.

Labels: Prompt, Data, JSON.

## 03 — Streaming

Browser and server joined by two directional paths: request out, individual token chips flowing back into a gradually assembled chat response; key icon stays inside server.

Labels: Client, Server, Stream.

## 04 — RAG

Documents cut into chunks enter vector database; query retrieves just three amber source chunks into LLM, answer visibly linked to sources.

Labels: Index, Retrieve, Generate.

## 05 — Tool calling

Model proposes tool call, separate application validates then executes a database tool, returns result in visible loop; final response exits loop.

Labels: Model, App, Tool.

## 06 — Cost latency

Request forks cache shortcut directly to response or small/large models via router, compact token stacks illustrate usage reduction.

Labels: Cache, Route, Model.

## 07 — Evals

Same small dataset feeds model A and B; answers pass shared checklist; a few failed test cards highlighted amber for comparison.

Labels: Dataset, A / B, Eval.

## 08 — Ollama

Cutaway laptop contains app, local endpoint, model weights and RAM/GPU; document paths remain entirely inside device. Cloud is separate alternative with no connection from local weights.

Labels: App, Ollama, Local.

## 09 — Prompt injection

External document has amber injected instruction entering model; malicious proposed tool path stopped at independent permission gate, authorized data path passes.

Labels: Data, Model, Permissions.

## 10 — MCP

Two AI apps connect through identical protocol connectors to distinct database/file/CRM MCP servers; standardized reusable connections visually central.

Labels: Apps, MCP, Tools.

## 11 — RAG production

PDF structured chunks flow into versioned index; question branches keyword and vector retrieval, merges and reranks selected chunks.

Labels: Keyword, Vector, Rerank.

## 12 — Context

Finite context container filled with distinctly colored instruction, task state, recent chat and evidence blocks, reserved output space; history compressed outside container and relevant memory selected.

Labels: Context, Memory, Output.

## 13 — Reliability

Top short request timeline bounded deadline with spaced retries. Bottom durable action outbox and repeated same key converge through email API to exactly one envelope, uncertainty routes to inspection.

Labels: Retry, Key, Outbox.

## 14 — Tracing rollout

Upper compact trace waterfall aligned with prompt/model/index version bundle. Lower rollout route staged eval to shadow to small canary cohort to release with rollback arrow.

Labels: Trace, Canary, Rollback.

## 15 — Multimodal PDF

Scanned form field with one blurred character, enlarged source crop linked to extracted structured field; unclear field amber and routed to human review while validated fields pass.

Labels: Source, Extract, Verify.

## 16 — Fine tuning

Frozen base model weight block with small trainable adapter attached, separated train/test cards and balanced baseline comparison. Subtle separate source retrieval alternative.

Labels: Base, LoRA, Eval.

## 17 — AI coding

Small order endpoint diff bracketed by acceptance spec and observed tests: owner allowed, other user denied, anonymous denied, final reviewer magnifier.

Labels: Spec, Diff, Test.

## 18 — Choose skills

Task cards UI, SEO, performance, browser tests matched to distinct workflow file modules; side visual differentiates instruction file, plugin package, external tool connector.

Labels: Task, Skill, Tool.

## 19 — UI skills

Three stages: reusable palette typography spacing tokens, purposeful desktop/mobile blog UI using same tokens, accessibility keyboard-focus review magnifier; no scores or certification.

Labels: Tokens, Build, Review.

## 20 — SEO

Blog page HTML inspected for canonical and structured article metadata, a specific issue links to small code diff then rechecked rendered page; no rankings graphs.

Labels: Audit, Fix, Verify.

## 21 — React performance

Compact before/after waterfall showing two independent fetches sequential versus parallel, component tree mostly server with tiny client leaf, chart loaded only on click.

Labels: Parallel, Server, Client.

## 22 — Playwright

Browser journey page1 to page2 to article then back, test cursor and assertion checkmarks, tiny separate redirect and 404 artifacts; no code block.

Labels: Browser, Assert, Evidence.

## 23 — Debugging

Two search request timelines: earlier react request finishes after later rag and overwrites UI; corrected side uses stale response guard, latest rag remains highlighted.

Labels: Reproduce, Trace, Verify.

## 24 — Project rules

Repo tree root instruction file and scoped rules routed only to relevant blog source files; skill workflow separate; independent permission gate before tool execution.

Labels: CLAUDE.md, Rules, Scope.

## 25 — Custom skill

Small SKILL.md folder with reference checklist, selected Markdown article passes metadata/link/source checks to concise review report; test fixtures good/broken alongside, no publishing arrow.

Labels: SKILL.md, Check, Report.

## 26 — Jailbreak boundaries

Instruction file feeds model context but cannot unlock independent runtime permission gate; untrusted document isolated as data, separate sandbox boundary around tools, model output and tool execution clearly distinct.

Labels: Instructions, Model, Sandbox.
