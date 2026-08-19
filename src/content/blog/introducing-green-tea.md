---
title: 'Green Tea: declare intent, derive execution'
description: 'The framework Expressive Tea Software is building now. Your API is a graph of steps that declare what they need and what they produce — the order is computed, not maintained by hand.'
pubDate: 2026-08-19T10:00:00Z
subject: green-tea
---

Expressive Tea Software publishes two frameworks. **Green Tea** is the one being built.

It is not a successor to Expressive Tea, and it is not a rewrite of it. It is a different
answer to a problem that the decorator-and-middleware approach never solved.

## The problem

```js
const user = req.user;
```

It compiles. TypeScript is satisfied. And it is a prayer.

`req.user` exists only if some middleware ran before this handler — which depends on where
the router got mounted, which line `app.use()` sits on, and whether a package installed last
sprint quietly inserted itself into the middle of the chain. So the whole request has to stay
in someone's head: what ran, what is on `req` by now, what order things fire in, which plugin
replaced the body parser.

That bookkeeping is where the bugs live, and neither the tests nor the types catch them,
because nothing is *wrong*. Every line is correct and the application is still broken.

## The idea

Green Tea puts the request on the page instead. Each step declares what it **needs** and what
it **produces**; the framework derives the order from those declarations, type-checks the
wiring before it serves traffic, and runs only the slice a given route actually depends on.

- Order is **derived** from dependencies, never maintained by hand.
- Boot **fails loudly** when nothing provides a key, so a handler never receives `undefined`.
- A route runs **only** the steps its handler depends on.
- `app.explain('/users/:id')` prints the whole chain. Onboarding becomes reading rather than
  archaeology.

A handler that reads `ctx.user` does not compile if no step produces `user`. "It was undefined
in production" stops being a category of incident.

## Where it runs

Node, Deno, Bun and Cloudflare Workers, over web-standard `Request` and `Response`. Every CI
run exercises all four — the Deno, Bun and workerd suites are not an afterthought that gets
skipped when they are inconvenient.

## Where it stands

Green Tea is in **beta**, and the honest version of that is worth stating rather than
softening.

Releases carry a `-beta.N` suffix on a calendar version; `26.8.0-beta.1` went out on
19 August 2026, to npm and to [JSR](https://jsr.io/@green-tea/core). The API can still change
between betas, and when it does the change is named in the changelog rather than discovered on
upgrade. Install with the explicit tag:

```bash
npm install @green-tea/core@beta
```

`latest` resolves to the same version today, because there is nothing else to install. The
day a stable release ships, `latest` moves and an implicit install silently changes channel —
asking for `@beta` now means you stay on the channel you meant.

Only the newest beta receives security fixes; there is no backport channel yet. Anything
exploitable goes to **security@expressive-tea.io**, not to a public issue.

What ends the beta is an API freeze and a first stable release — not a version number. Green
Tea versions by calendar, so there is no 1.0 milestone on the way to wait for.

## What is next

The API freeze and the first stable release. Beyond them: the mesh sub-specifications
(discovery, load-balancing, failover), official plugins, and a radix-tree matcher for very
large route tables.

Expressive Tea is not being retired in Green Tea's favour. It stays in maintenance with its
security patches, and a framework in maintenance is a reasonable thing to keep in production.

Green Tea is simply where the new work is.

[Site](https://green-tea.expressive-tea.io) ·
[Docs](https://green-tea.expressive-tea.io/docs) ·
[GitHub](https://github.com/Expressive-Tea/green-tea)

*The most recent release is covered in* [*Green Tea 26.8.0-beta.1*](/blog/green-tea-26-8-0-beta-1/)*.
The engineering story — first person, from the person who wrote it — is on the*
[*Green Tea blog*](https://green-tea.expressive-tea.io/blog/)*.*
