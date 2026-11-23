---
title: 'Green Tea 26.11.0-rc.2: nine security fixes, and the API is frozen'
description: 'The first release candidate froze the API on 17 November. The second, six days later, fixes nine security problems an audit found in it. Upgrade if you run any 26.x release.'
pubDate: 2026-11-23T19:00:00Z
subject: green-tea
---

Green Tea **26.11.0-rc.2** went out to npm and JSR on 23 November 2026. It fixes nine security
problems, one rated high, and every 26.x release before it has them.

## The API froze at RC.1

**26.11.0-rc.1** shipped on 17 November and froze Green Tea's public API. From here to the first
stable release, nothing public is added, removed or renamed. Releases are fixes only. RC.1 also made
Node 22 the minimum. Node 18 and 20 are end-of-life.

After stable, breaking changes ship only in the first release of a year. The
[support policy](https://github.com/Expressive-Tea/green-tea/blob/main/SECURITY.md#supported-versions)
says which releases get fixes, and for how long.

## RC.2 is the audit

A freeze is the moment to try to break what was frozen, so we audited RC.1 before calling anything
stable. The audit found nine problems, and RC.2 fixes all of them. The most serious one: WebSocket
upgrades never checked `Origin`, so a page on another site could open a socket with a signed-in
user's cookies and read what the handler sent.

Five of the fixes change behaviour you might notice:

- A WebSocket upgrade from another site gets `403`.
- With `trustProxy`, `ctx.ip` is the right-most `X-Forwarded-For` entry, the one your proxy wrote.
- `cors: { origins: '*', credentials: true }` fails `createApp` instead of letting every site make
  credentialed reads.
- A stream that fails ends with `Internal Server Error` unless the error is an `HttpError`.
- `static` no longer serves dotfiles such as `/.env`.

The [security advisories](https://github.com/Expressive-Tea/green-tea/security/advisories) describe
each problem, and the [what's new](https://green-tea.expressive-tea.io/docs/whats-new/) page says
who each change affects and what to do about it. The official plugins moved with core:
`@green-tea/jwt`, `metrics` and `rate-limit` are 26.11.0-rc.2 on JSR.

## Upgrading

```bash
npm i @green-tea/core@rc
```

On Deno, use `jsr:@green-tea/core@26.11.0-rc.2`. No patched beta exists, so a beta user also takes
on RC.1's breaking changes, which the [changelog](https://github.com/Expressive-Tea/green-tea/blob/main/CHANGELOG.md)
lists.
