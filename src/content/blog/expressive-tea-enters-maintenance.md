---
title: 'Expressive Tea 2.0.1, and what maintenance means from here'
description: 'The 2.0 line is where Expressive Tea stops adding and starts holding. What still gets patched, what never will, and which version you should not be running.'
pubDate: 2026-08-19
subject: expressive-tea
---

Expressive Tea shipped **2.0.1** on 25 February 2026. It is a stability release: boot stages
now resolve sequentially rather than racing each other during startup, the test suite moved
from Jest to Vitest, and shutdown, port isolation and engine lifecycle got the coverage they
had been missing. It closes [#247](https://github.com/Expressive-Tea/expresive-tea/issues/247).

It is also, deliberately, close to the last thing that will land.

## What "maintenance" means here

Expressive Tea is finished, and saying so is more useful than leaving it ambiguous. A
framework that quietly stops moving is worse for the people using it than one that says
where it stands, because the silence still looks like a project you could file a feature
request against.

Concretely, the 2.0.x line receives:

- security patches, and
- dependency updates that keep it installable.

It does not receive new features, and it does not receive fixes for things that are merely
inconvenient. If a bug is not a security problem and not an install-blocker, the honest
answer is that it will not be fixed.

## Versions you should not be running

Two of them, for different reasons.

**1.3.x Beta must not be used at all.** It contains critical flaws in the encryption used by
the Teapot and Teacup gateway, which is why 1.3 was never promoted to a release and never
will be. Anyone still on a 1.3 beta with the gateway enabled should move to 2.0 and re-encrypt
whatever passed through it. This is documented in full in
[SECURITY.md](https://github.com/Expressive-Tea/expresive-tea/blob/develop/SECURITY.md).

**1.2.x is deprecated** as of 27 January 2026. It has no cryptography issues — that is worth
stating plainly, because 1.3's problems are easy to read as everything before 2.0 being
unsafe. It is deprecated for a duller reason: it depends on InversifyJS 6.x, which is itself
unmaintained, and it cannot receive further security patches without breaking changes. The
[2.0.0 release notes](https://github.com/Expressive-Tea/expresive-tea/releases/tag/v2.0.0)
list every breaking change and what to do about each one.

Everything at 1.1 and below is unsupported.

One thing to know when moving: 2.0.0 renamed the package. `@zerooneit/expressive-tea` is now
`@expressive-tea/core`.

## Reporting something exploitable

Mail **security@expressive-tea.io**. Please do not open an issue — an issue is world-readable
from the moment you press the button, and a security report is the one thing that cannot be.

This channel stays open for as long as anyone is running 2.0.x. Maintenance means the feature
work stopped, not that the reports go unread.

## Where the work went

It went to [Green Tea](https://green-tea.expressive-tea.io), a different framework rather
than a successor — an application is a graph of steps that declare what they need and what
they provide, not a chain of middleware in an order you have to remember. It is in beta, it
versions by calendar, and it publishes under npm's `beta` dist-tag.

Expressive Tea is not being deprecated in its favour. A framework in maintenance that still
gets its security patches is a reasonable thing to have in production. It is just no longer
where anything new is being built.
