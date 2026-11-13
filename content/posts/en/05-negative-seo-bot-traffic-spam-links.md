---
title: "Negative SEO: Spotting and Handling Bot Traffic and Spam Backlink Attacks"
seoTitle: "Negative SEO: Bot Traffic and Spam Backlinks"
slug: negative-seo-bot-traffic-spam-backlinks
description: "Fake traffic and spam backlinks are meant to push a site down in Google. How to spot them, check Manual Actions, block bots, and when to disavow."
keywords: "negative SEO, spam backlinks, bot traffic attack, Manual Actions, disavow links, Bot Fight Mode, Cloudflare block bots, site dropped in Google"
tags: "SEO, Security, Cloudflare, Web"
date: 2026-11-13
cover: /images/blog/posts/05-web-bi-ban-traffic-ban-backlink-v2.webp
---

# Negative SEO: Spotting and Handling Bot Traffic and Spam Backlink Attacks

Negative SEO is the general name for tactics that push a website down in Google from the outside, without touching the site itself. The two most common ones are fake traffic and spam backlinks.

The people it happens to are usually shop owners or small businesses who run their own site, with nobody technical to ask. The biggest damage often comes from the reaction: paying for an "express penalty removal" service when there is no penalty, or disavowing links in bulk and pushing the site down further.

The sensible order is to confirm an attack is really happening first, and only then deal with each kind.

## Two dirty tricks

**A traffic attack** sends a swarm of bots at your site. The immediate goal is to overload the server so the site slows down or falls over. Customers can't get in, and Googlebot hits errors when it comes to crawl.

**A backlink attack** creates hundreds or thousands of links to your site from junk pages, often with gambling or adult keywords. Whoever does it hopes Google will conclude that you bought those links and penalize you.

The two work differently, so they are handled differently. Lumping them together and treating both the same way is how mistakes happen.

## First: are you sure it is an attack?

Rankings drop for many reasons, and most of them are not sabotage. Google updates its algorithms, a competitor publishes better content, a redesign breaks your title tags, or the server has been flaky for days.

So look at the evidence before you conclude anything. There are two places to check.

**In Google Analytics:** visits spike abnormally, come from a few countries or unfamiliar sources, and nearly everyone leaves immediately. Real people don't behave that uniformly.

**In Search Console, under Links:** the list of linking sites fills with unfamiliar domains that have nothing to do with your industry, growing fast over a short period.

One of these signs is reason to be suspicious. If both look normal, go back and look for the cause on your own site.

## Spam backlinks: usually nothing to do

Google states in its [Disavow tool documentation](https://support.google.com/webmasters/answer/2648487) that in most cases it can assess which links to trust without additional guidance, and that most sites will not need the tool.

It makes sense when you think about it. If junk links alone could get a site penalized, anyone could take out a competitor for the price of a cheap link package. Google had to deal with that long ago, and its approach is to ignore junk links instead of punishing the site they point to.

### Check whether you were actually penalized

In Search Console, open **Manual Actions**.

A manual action is issued when a human reviewer at Google determines that a site violates the spam policies. If there is one, it is listed here with the reason. If there is none, you see a green check mark and a message saying no issues were detected.

The green check means you have **not been manually penalized**. Anyone calling to promise "penalty removal in 48 hours" at that point is selling something you don't need.

### When Disavow is warranted

Disavow tells Google "don't count these links for my site". It sounds like something to use just in case, but Google's conditions are narrow. Use it only when both are true:

1. You have a considerable number of spammy, artificial or low-quality links pointing to your site, and
2. Those links have caused a manual action, or are likely to.

Google also warns that this is an advanced feature, and that used incorrectly it can harm your own performance in search results. The reason is simple: it is easy for a non-expert to disavow the good links that are helping the site rank.

If Manual Actions really does report "Unnatural links to your site", the process Google describes is:

1. Download your links from Search Console.
2. Pick out the violating ones, starting with the top linking sites and the newest links.
3. Contact those site owners and ask for removal. Junk sites rarely answer, but record that you tried.
4. Put what you could not get removed into a disavow file.
5. Select Request Review and describe what you did.

The disavow file is a `.txt` file with one domain or URL per line:

```text
# Spam links that appeared from Nov 10
domain:example-junk-site.xyz
domain:another-junk-site.top
https://example.com/spam-post.html
```

After the upload, Google needs a few weeks to apply it. Reviews also take days to weeks. There is no "express" route.

## Fake traffic: stop it at the door

First, the real damage. Many people worry that bots arriving and leaving raise the bounce rate, and that Google sees this and drops the ranking. People at Google have said repeatedly that they do not use Google Analytics data for ranking.

The real damage is elsewhere.

The worst of it is an overloaded server. The site slows down or returns errors, real customers leave, and if Googlebot keeps hitting errors when it crawls, rankings do suffer.

Then there are polluted numbers: real visits are mixed in with fake ones, so you can no longer tell which campaign is working. Last is money. You pay for the bandwidth and server resources the bots consume, and for ad spend too if they click your ads.

### Turn on Bot Fight Mode in Cloudflare

If your site already runs through Cloudflare, the Free plan includes a bot-blocking layer. According to [Cloudflare's documentation](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/), you enable it like this:

1. Go to **Security**, then **Settings**.
2. Filter by **Bot traffic**.
3. Find **Bot fight mode** and turn it on.

It identifies requests that match known bot patterns and makes them solve a CPU-heavy challenge. Real users hardly notice, while each request becomes far more expensive for whoever runs the bots.

### Test right after turning it on

Skipping this step can cost more than the attack.

Bot Fight Mode on the Free plan covers the whole domain and **cannot have exceptions**. The docs are explicit: Skip and Allow rules have no effect on it. It may also challenge API and mobile app traffic.

That means the automated traffic your site needs can be blocked too: the payment gateway calling back to say an order was paid, the mobile app calling your API, an uptime monitor. The site still opens fine in a browser, but orders never switch to paid.

So right after you enable it, go through these yourself:

- Sign in and sign up.
- Place an order and pay all the way through, then check that the order was updated.
- Open the mobile app, if there is one.
- Check that third-party integrations still work.

If something breaks, turn it off and use the approach below, or consider a paid plan with Super Bot Fight Mode, which does allow exceptions.

### Target the source with a custom rule

When you know where the fake traffic comes from, blocking that source is better than tightening everything. The Free plan allows 5 custom rules.

In Cloudflare's security rules, create a new custom rule and choose the **Managed Challenge** action. It sends visitors through a verification step: real people pass, simple bots don't. Write the condition based on the source you see in your numbers, for example by country:

```text
(ip.src.country eq "XX")
```

or by network, if the bots come from the same hosting provider:

```text
(ip.src.asnum eq 12345)
```

Don't use Block on a whole country if you have real customers there. Managed Challenge is safer because real people can still get in.

All of this only works when traffic actually passes through Cloudflare. If the site runs on another platform, use that platform's firewall. The principle is the same: identify the source, challenge instead of blocking outright, then test the flows that matter.

## What not to do

Don't pay for penalty removal before you have opened Manual Actions. No penalty notice means there is nothing to remove.

Don't disavow in bulk for peace of mind, because you may throw away links that are helping you. Don't block whole IP ranges or countries before looking at the data either, or you block your own customers.

And don't attack the competitor back. Ethics aside, the links you buy to hurt someone will most likely be ignored by Google. You spend money and get nothing.

## The order of operations

1. Open Analytics and the Links report in Search Console, and check whether anything is actually abnormal.
2. Open Manual Actions. A green check means no penalty, so do nothing more about links.
3. If there is a link penalty: sort the links, request removals, disavow the rest, request a review.
4. If it is bots: turn on Bot Fight Mode or add a custom rule for the source, then test sign-in and checkout again.
5. Watch for a few weeks. Rankings don't recover overnight.

Once this is behind you, go over the site's technical SEO, because rankings drop from a site's own mistakes far more often than from an attack. The post on [auditing a website with Claude SEO](/ai-for-devs/claude-seo-audit-website) shows how. If you have questions, [get in touch](/#contact).
