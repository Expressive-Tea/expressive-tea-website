---
title: 'A rebrand that did not redraw the logo'
description: 'Expressive Tea Software had been sharing its name with one of its own frameworks — the one that stopped taking features. Fixing that took a hierarchy, not a new cup.'
pubDate: 2026-08-19T09:00:00Z
subject: organization
---

For years this organization was called the same thing as one of its frameworks. "Expressive
Tea" meant both the people doing the work and a specific decorator-driven framework built on
Express — and when that framework entered maintenance, the organization's public identity was
still being carried by the product it had stopped developing.

That is not a logo problem. No amount of redrawing fixes a name that points at two things.

## What actually changed

A hierarchy, stated once and applied everywhere:

**Expressive Tea Software** is the organization. **Green Tea** and **Expressive Tea** are
frameworks it publishes. Neither is an alternate name for it, and neither speaks for it.

Everything downstream follows from that sentence. Green Tea is the framework where the work
happens; Expressive Tea is the original, now in maintenance. `Expressive-Tea` stays as the
GitHub namespace, because a namespace is an address and breaking addresses to tidy up a
naming decision costs other people more than it costs us.

The permanent descriptor is **Open source, built in Mexico**.

## The cup was not touched

The mark is the same one it has always been, and that is deliberate rather than lazy. It is
not redrawn, recoloured, stretched, or combined with Green Tea's leaf; nothing is added
inside it. The three source files are pinned by SHA-256 in the brand guide, and one of them —
`et-avatar-transparent.png` — is the single composition source. The portable SVG deliverables
embed exactly those bytes rather than a re-export, so there is no lineage of slightly
different cups to argue about later.

A rebrand is usually an excuse to redraw. This one had a naming problem to solve, and the
mark was not the part that was broken.

## The palette came out of the cup

The accents were not chosen; they were **sampled** from the mark's own pixels, at recorded
coordinates, with the exact commands written down so anyone can reproduce them:

- green `#00d084`
- teal `#00a1ba`
- blue `#0066ff`

Supporting colours are graphite `#0d1117`, white `#f8fafc`, and two greys for secondary text.
Matcha and purple are **not** in the organization's palette — those stay exclusive to Green
Tea, so a Green Tea page and an organization page never look like the same voice.

Typography is Inter — 700 for the name, 600 for descriptors and metadata, 400 for auxiliary
text — with Zen Maru Gothic 700 for "SOFTWARE". Both are OFL 1.1, the licences ship with the
assets, and the deliverables embed the WOFF2 files while keeping the text editable, so a
render is identical whether or not the machine has the fonts installed.

## What you can see from here

This site. `expressive-tea.io` is now the organization's front page rather than a
documentation site that happened to sit on the apex — the Expressive Tea documentation moved
back to [docs.expressive-tea.io](https://docs.expressive-tea.io), where it belongs, and the
old links still work.

The brand system also covers the editorial and video side: fixed canvases, a technical grid,
project badges with their own colour pairs, and one rule that turns out to matter more than
any of them — **one image carries one language**. Spanish and English get separate files with
`-es` and `-en` suffixes rather than a bilingual compromise that reads badly in both.

None of that is visible in a logo. It is the part that makes the next thing we publish look
like it came from the same place as the last one.
