---
title: 'Green Tea 26.9.0-beta.1: three crashes closed, and a registry that now works'
description: 'A CORS predicate, a custom error handler and a connection cap could each take a process down. All three are fixed, the JSR package resolves for the first time, and boot no longer waits on providers that do not depend on each other.'
pubDate: 2026-09-04T14:00:00Z
subject: green-tea
---

Green Tea **26.9.0-beta.1** was published on 4 September 2026, to npm and JSR.

The previous release gave the framework a way to report what it was doing. This one is largely the
result of reading that report: three ways an application's own code could end its process, a second
registry that had been announced but never worked, and two performance changes that only appear once
an application grows.

## Three failures that ended the process

Each is the same shape — the framework called code the application supplied, and did not account for
it throwing.

A `cors.origins` predicate runs on every request. An exception from it escaped into the request
pipeline and took the process with it. A custom `onError` had the same flaw with worse timing: the
handler written to stop a bad request becoming an outage was itself the outage. It now falls back to
the built-in renderer and reports the failure rather than losing the response.

The third was quieter. Reaching Node's `maxConnections` destroyed the socket with no HTTP response
and logged nothing, which from the client's side is indistinguishable from a network fault. It now
logs a warning naming the dropped peer, rate-limited to one a minute.

Anyone running `26.8.0-beta.1` with a CORS predicate or a custom error handler should treat this as
the reason to upgrade.

## The JSR package works

`26.8.0-beta.1` announced publication to JSR. It installed and then failed on first import: JSR
serves `src/` rather than the bundled build, and the ESM build's extensionless relative imports are
not something Deno resolves. The npm package was unaffected throughout, which is why it went
unnoticed — every test and every runtime suite ran against the built artifact.

The import paths are fixed. More usefully, the release workflow now runs `deno publish --dry-run`
before the npm publish, so JSR's own checks — slow types, module analysis, things npm never
inspects — fail while there is still something to be done about them. npm allows 72 hours to
unpublish; a JSR version can never be replaced.

## Boot takes the longest chain, not the sum

Providers that do not depend on each other now boot concurrently. Three independent providers doing
200 ms of work each took 616 ms and now take 210 ms. The saving is proportional to how wide the
dependency graph is: a small application will see little, an application with a dozen independent
providers will see most of its startup disappear.

Route ranking is settled when the route table is built rather than recomputed per request, and
security and CORS headers are computed once per request instead of twice. Neither is visible on a
small route table — on two hundred routes the matcher change measures between 12 and 15 per cent.

The benchmark that can see it shipped in this release too. Earlier matcher work had measured as
noise against a six-route table, which was a limit of the instrument rather than of the change.

## A request budget

`createApp({ limits: { maxConcurrentRequests } })` bounds how many handlers execute at once, per
server and per Fetch adapter instance. Beyond the budget a request receives `503` with
`Retry-After: 1` rather than queueing behind the work already running.

It counts executing handlers rather than open connections, so a long-lived SSE stream or a WebSocket
upgrade does not hold a slot for its lifetime, and on Node a client disconnect releases one early.

## Smaller additions

`createApp({ handleSignals: true })` registers `SIGINT` and `SIGTERM` to close and exit; it is off
by default, because a library that installs process-wide handlers unasked is a library that fights
the process manager. `@Sse` can emit an `id:`, giving an `EventSource` reconnect a `Last-Event-ID`
to resume from. The extension-point types — `TransformerFn`, `PluginApi`, `ScopeApi`, `ScopeNode`,
`Hooks` and `TeardownFn` — are exported, so a custom transformer or plugin no longer redeclares them
inline. Every `request:end` is now preceded by a `request:start` carrying the same request id, which
is what makes the event stream something to build a collector on.

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

## One person contributed code

[@hgshreyas](https://github.com/hgshreyas) contributed the request budget, across two issues and two
pull requests, having also contributed the connection cap in the previous release. It is the second
consecutive release to carry work from outside the organization, on a project that offers a
contributor no visibility in return.

## The complete notes

Every change, with the reasoning, is on the
[26.9.0-beta.1 release](https://github.com/Expressive-Tea/green-tea/releases/tag/v26.9.0-beta.1).
The [what's new page](https://green-tea.expressive-tea.io/docs/whats-new/) covers the same ground
for readers already running the previous version.

The engineering story behind this release — first person, from the person who wrote it — is on the
[Green Tea blog](https://green-tea.expressive-tea.io/blog/green-tea-26-9-0-beta-1/).
