---
title: "Writing Your Own Claude Code Skill: Start With a Blog Review Workflow"
seoTitle: "How to Create a Custom Claude Code Skill (SKILL.md)"
slug: writing-your-own-claude-code-skill
description: "Build an internal Claude Code skill for reviewing blog posts: define the scope, write SKILL.md, require evidence in the output and test it before sharing."
keywords: "create Claude skill, SKILL.md, custom Claude Code skills, blog review, agent skills"
tags: "AI, Claude Code, Skills, Workflow"
date: 2026-10-31
---

# Writing Your Own Claude Code Skill: Start With a Blog Review Workflow

If every time you write a post you ask Claude to check the slug, internal links, sample code and claims without sources, that's a workflow you can package. A repo-specific need doesn't require a big skill pack.

This post builds a **blog review** template whose output is feedback — it doesn't edit or publish on its own. The template lives in the article text; it doesn't create a working skill in the repo you're reading this from.

## Pick a task with a clear end point

"Help with content" is too broad. "Review one Vietnamese Markdown post before publishing" is easier to bound: there's an input file, criteria to check and an output report.

I'd define the scope like this: read the selected post and its relevant sources; check metadata, consistency and links; separate confirmed issues from things that lack evidence. It shouldn't change the writing voice, install dependencies or run code with side effects just to check an example.

## Create the minimal structure

As covered in [choosing skills for Claude Code](/ai-for-devs/chon-skill-cho-claude-code), project skills can live under `.claude/skills/` with a `SKILL.md` file. For example:

```text
.claude/
  skills/
    review-blog-vi/
      SKILL.md
      references/
        editorial-checklist.md
```

Start with one main file. Only add a long checklist when it genuinely helps reuse; there's no need to create empty folders to make the template look complete.

## Write a specific description and output

The sample `SKILL.md` below is what this post proposes:

```markdown
---
name: review-blog-vi
description: Review a Vietnamese Markdown blog post before publishing, checking metadata, links and technical evidence.
disable-model-invocation: true
---

Review the file given in $ARGUMENTS.

1. Read the file and confirm it is a blog post, not a README.
2. Compare the metadata with the project's actual blog loader.
3. Check that the slug is unique and internal links exist in the repo.
4. Review sample code, stating dependencies and which parts are illustrative only.
5. For claims about APIs or installation, check the official source.
6. Report findings by impact, with location and how to verify.

Do not edit files or publish during this review workflow.
If a source can't be accessed, mark it as unverified.
Do not claim to have run code if you only read or parsed it.
```

`disable-model-invocation: true` keeps this workflow as something the user invokes deliberately; `$ARGUMENTS` receives the arguments passed when it's called. That's a choice for this template, not a requirement for every skill. The review instructions in the file don't replace the tool's permission mechanism either.

Once it's created and Claude Code picks up the skill, you can call it like this:

```text
/review-blog-vi content/blog/post-to-review.md
```

## Don't stuff every document into the main file

A secondary checklist can hold examples of slug mistakes, how to tell primary sources from roundup articles, and criteria for classifying sample code. The main file should say when to read the checklist, rather than copying the same content into several places.

The repo's general rules still belong in [CLAUDE.md/rules](/ai-for-devs/claude-md-va-rules-cho-du-an). This skill holds only the review workflow. When a requirement changes, you don't have to edit three nearly identical copies and hope you didn't miss one.

## Test with good posts and deliberately broken ones

Create test drafts with a wrong internal link, a duplicate slug, code missing an import or an outdated install command. See whether the skill points to the right location and reason. Also try a correct post to check whether it invents problems just to produce a report.

Don't judge it by output length. A useful report might contain only two confirmed issues and one question that needs a source. When an API couldn't be checked, "unverified" is better than suggesting a plausible-sounding function name.

## Maintain it as part of the project

Review changes to the skill like code: has the scope grown, does it run new commands or access new services, is the output still appropriate? Keep the failure cases you've seen so you can rerun them when you adjust the instructions.

Once the review workflow is solid, you can create a separate editing workflow with a clear scope. Separating evaluation from changes tells you whether Claude is reporting problems or directly altering content that needs checking.

This is part of the AI for Devs series by [Nguyen Huynh](/) — read more about [my experience](/#experience) if you want to know where these workflows come from.
