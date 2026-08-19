---
title: 'Green Tea 26.8.0-beta.1: an observability contract, and a second registry'
description: 'A correlated event stream and an injectable logger, shutdown you can hook into, a routing change to read before upgrading, and the first publish to JSR alongside npm.'
pubDate: 2026-08-19T15:00:00Z
subject: green-tea
---

Green Tea **26.8.0-beta.1** was published on 19 August 2026, to npm and — for the first time —
to JSR.

The previous release made the router stop guessing. This one closes the gap that every serious
evaluation reaches in its first week: until now an application could run on this framework and
give no account of what it was doing.

## An observability contract, not an integration

Core now emits a correlated lifecycle event stream. Every request is given an id — an incoming
`x-request-id` is adopted rather than replaced — and every event of that request carries it,
alongside the matched route *pattern* rather than the concrete URL. That distinction is the
difference between a metrics backend with one label per route and one with a label per distinct
path. Each step reports its own duration.

The logger is injectable: `createApp({ logger })` accepts anything with `debug`, `info`, `warn`
and `error`. Given none, the default writes JSON, or a readable line on a TTY. Nothing in core
writes to `console`, and that is enforced by a lint rule over the whole source tree rather than
by intention — so every diagnostic the framework produces is one an application can redirect.

What is deliberately absent: a metrics registry and an OpenTelemetry exporter. Core keeps one
runtime dependency, and an exporter is a package rather than a framework feature. A `traceparent`
header is carried through untouched for one to read.

## Shutdown became an extension point

Closing what an application opened no longer means writing a `SIGTERM` handler by hand. A
provider closes its pool in `dispose()`, a plugin registers `onShutdown`, an application passes
`createApp({ hooks })` — three doors into one registry. All three are awaited, and they run in
reverse boot order, so a cache that depends on a database closes before the database does. A
failing teardown is logged and the rest still run.

The edge is the exception, and it is stated rather than papered over: workerd has no shutdown to
intercept, so anything that must be released belongs in the request that acquired it.

## One behaviour change to read before upgrading

**`.` and `..` in a request path now resolve instead of returning 404**, and `%2e` counts as a
dot. `GET /public/../admin` reaches a route declared as `/admin`.

This affects Node only, and it exists to end a divergence rather than to be lenient: Deno, Bun and
Workers resolve dot segments inside the `Request` constructor before the framework sees anything,
so identical bytes on the wire were already reaching different routes depending on where an
application was deployed. If a proxy or WAF in front of the application matches on the literal
path, it now sees something different from what the application routes.

## Mesh was audited, and stays alpha

Mesh — resolving a dependency that physically lives on another node — is the part of Green Tea
that nothing else offers, and the part nobody has run in anger. This release went looking, and
found eight defects in roughly six hundred lines. None had been reported.

A dropped link never reconnected at all. A request lost its identity at the process boundary, in
the one place a distributed trace is the entire point. And exporting a value with methods — a
connection pool, a client — answered `200` with `{}`, because the wire is JSON and JSON keeps
neither methods nor private state; the failure then surfaced as `db.query is not a function`
somewhere unrelated. All three are fixed, and the last one made explicit a rule the documentation
had never stated: **a mesh export carries data, never behaviour.**

Mesh stays behind `experimental: true`. The label is not a verdict on the code — the protocol is
versioned, the secret is compared in constant time, ambiguous routes fail the boot. It is a
statement about how much is known, and everything above was found by looking rather than reported
by a user.

## Where to get it

```bash
npm install @green-tea/core@beta reflect-metadata
```

The package is published to npm with build provenance, and to
[JSR](https://jsr.io/@green-tea/core), which serves the TypeScript source directly. While there is
no stable release, `latest` and `beta` resolve to the same version — asking for `@beta` explicitly
means staying on the intended channel the day that stops being true.

Only the newest beta receives security fixes. Anything exploitable goes to
**security@expressive-tea.io**, not to a public issue.

## Two people contributed code

[@YxnnXriel](https://github.com/YxnnXriel) contributed the timeout on `app.close()`, which every
shutdown deadline in this release is built on. [@hgshreyas](https://github.com/hgshreyas)
contributed the cap on concurrent connections, which Node had been running without.

Both did so while the project had no stars and no visibility, which buys a contributor nothing but
the work itself.

## The complete notes

Every change, with the reasoning, is on the
[26.8.0-beta.1 release](https://github.com/Expressive-Tea/green-tea/releases/tag/v26.8.0-beta.1).
The [observability guide](https://green-tea.expressive-tea.io/docs/guides/observability/) documents
the new surface in full.

The engineering story behind this release — first person, from the person who wrote it — is on the
[Green Tea blog](https://green-tea.expressive-tea.io/blog/the-trust-release/).
