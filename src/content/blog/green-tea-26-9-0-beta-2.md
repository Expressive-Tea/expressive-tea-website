---
title: 'Green Tea 26.9.0-beta.2: the runtime entry points boot before they bind'
description: 'Two breaking changes, one keyword each. serveDeno and serveBun now start the application before opening a port, so a provider that cannot start fails the deploy instead of answering 500s from a process that looks healthy. Plugins become named objects.'
pubDate: 2026-09-23T14:00:00Z
subject: green-tea
---

Green Tea **26.9.0-beta.2** went out to npm and JSR on 22 September 2026.

There are two breaking changes and each one is a keyword to fix. They are also the same mistake
twice: both are places where Green Tea asked you to do something in the right order, which is the
one thing the framework is supposed to work out for you.

## A port that opened before the app had started

`serveDeno` and `serveBun` used to open their port without booting the app. The providers ran on
the first request instead, and whatever happened then was remembered, including a failure.

So forgetting the documented workaround did not give you a failed start. The port opened. Any
health check that asks "is something listening" passed. Then every request came back `500` — from
the runtime, not from Green Tea, so it never reached your `onError` and never showed up in your
logs. A missing signing key got you a process that looked fine and served nothing.

Both functions are async now and boot before they bind:

```diff
- const server = serveDeno(app, { port });
+ const server = await serveDeno(app, { port });
```

They still resolve to the same value, and both runtimes have top-level `await`, so a module that
serves when it is imported needs nothing else. A provider that cannot start now breaks the deploy,
where you can see it.

`edgeHandler` stays as it was. Cloudflare Workers gives you no startup outside a request, so there
is no earlier moment to fail in.

## Plugins are named objects

A plugin used to be a function, and `plugin:mounted` took its name from the function's `name`
property. That is empty for an arrow function returned by a factory, which is how most plugins are
written. The event whose job is to say which plugins mounted named none of them.

A plugin is `{ name, mount(api) }` now. You say what it is called instead of hoping the runtime
guesses. A failed mount reports `plugin "<name>" failed to mount: …` and keeps the original error
as its `cause`, and two plugins with the same name fail `createApp` rather than quietly shadowing
each other.

This is the small half of a bigger change. There is a plugin marketplace on the way, and what an
ecosystem needs from a plugin contract before strangers start publishing into it gets its own post.

## Also in this release

`app.boot()` is public, for apps that drive `app.fetch` from their own server. Framework errors are
now recognised by a symbol brand rather than `instanceof`, so an `Unauthorized` thrown by a package
carrying its own copy of Green Tea renders with its real status instead of turning into a `500`.
Mesh is still alpha, and it no longer lets you export a provider: a provider's value is an object,
and an object is not what a JSON connection carries.

The [changelog](https://github.com/Expressive-Tea/green-tea/blob/main/CHANGELOG.md) lists
everything, and the [documentation](https://green-tea.expressive-tea.io/docs/whats-new/) covers
this release.

## Upgrading

```bash
npm i @green-tea/core@beta
```

If you run on Node, neither breaking change touches you: `app.listen()` has always booted before
accepting connections. On Deno or Bun you need the `await`. If you write plugins you need the
object form, and if you use one you need whichever version of it adopts the object form.

Green Tea is still beta and versions by calendar. The API can change between betas, and anything
that breaks is named in the changelog.
