---
title: 'How a release reaches you'
description: 'Two registries, build provenance without a stored token, release notes that are published rather than only tagged, and documentation that ships on its own clock.'
pubDate: 2026-08-19T14:00:00Z
subject: organization
---

Green Tea 26.8.0-beta.1 went out on 19 August 2026. It is the first release to travel the whole
path described below, which is a better moment to write the path down than any other.

None of this is interesting on its own. It matters because every step of it is something a person
evaluating a framework would otherwise have to take on trust.

## Two registries, in a deliberate order

The package is published to npm and to [JSR](https://jsr.io/@green-tea/core). npm receives the
compiled dual ESM and CommonJS build; JSR receives the TypeScript source, with the same four entry
points, so an example that imports `@green-tea/core/bun` works whichever registry the reader
installed from.

JSR is published second, and the order is not incidental. npm allows a version to be unpublished
within seventy-two hours. **JSR versions are immutable — they can never be replaced or removed.**
Putting the reversible registry first means a failure costs a re-run; the same failure after the
irreversible one would cost a version number permanently. Both registries are also gated before
either ships, because JSR checks things npm never looks at, and learning about them after npm has
the package leaves a release half-delivered.

## Provenance, without a token to steal

Nothing publishes with a stored credential. The release workflow exchanges a short-lived identity
token from the CI run for a publish token that lives for minutes, using npm's Trusted Publishing.
There is no long-lived npm token in a secret store to leak, rotate, or forget.

The side effect is the part worth having: npm attaches
[build provenance](https://registry.npmjs.org/-/npm/v1/attestations/@green-tea%2fcore@26.8.0-beta.1)
to each publish — a signed statement, verifiable against a public transparency log, that this exact
tarball was built by that exact workflow from that exact commit. The published package records the
commit it came from, so the code on the registry can be checked against the code in the repository
by anyone who cares to.

## Release notes are published, not just tagged

A tag is a pointer. It tells a reader nothing about what changed.

Every version tag now produces a GitHub release whose notes are the changelog section for that
version — written for people, while the work was fresh, rather than generated from merge subjects
after the fact. A prerelease is marked as one, so a beta never takes the *Latest* badge from a
stable release.

The section is closed the step before the tag, never earlier. A version heading with a date is a
claim that the release exists, and until the registries have it, that claim is false.

## The documentation ships on its own clock

The documentation used to live inside the framework repository, where a typo fix waited on a
framework release and a stale page could break the build. It is now a separate repository with its
own version and its own release.

Independent does not mean unaccountable. A documentation release states which version of the
framework it describes, and a check refuses to build unless the tag, the package version, and the
version printed on every page of the site all say the same thing. Three places that a hurried
release is exactly the moment to let drift apart.

## What the version number means

Green Tea versions by calendar: `YY.M.PATCH`. The number says when a release shipped, not how many
breaking changes came before it. There is no 1.0 on the way to wait for.

The channel is what marks the line. Betas carry a `-beta.N` suffix, the API can still change
between them, and every change that breaks is named in the changelog. While there is no stable
release, a bare `npm install` and `@beta` resolve to the same version, because there is nothing
else to install. Asking for `@beta` explicitly is how a reader stays on the channel they meant on
the day that stops being true.

What ends the beta is an API freeze and a first stable release — not a number.

## Where this applies

All of the above describes Green Tea, which is where the new work is.
[Expressive Tea](/blog/expressive-tea-enters-maintenance/) is in maintenance: its 2.0.x line
receives security patches and the dependency updates that keep it installable, and nothing else.

Security reports for either framework go to **security@expressive-tea.io** rather than to a public
issue tracker.
