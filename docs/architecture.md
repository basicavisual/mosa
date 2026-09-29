# Architecture

## System

MoSA has one deployed application and one versioned public collection.

```text
source JSON ──► attributed claims ──► object page
      │                                  ▲
      └──► image metadata ─► LFS image ──┤
object JSON ─► name + foreground choices ┤
editorial Markdown ──────────────────────┘
```

The Astro website validates and loads `collection/` during its build. Docker
packages the generated server and processed images. The running container needs
no database credentials and makes no request to a collection service.

[ADR 020](adrs/020-use-a-git-backed-public-collection.md) supersedes the former
PostgreSQL, explorer, dossier-import and live-feed architecture.

## Reduced collection model

An **object** has a stable ID, a concise canonical navigation name and a list of
claim IDs selected for foregrounding. Its ID remains the public URL identity.

A **source** records who authored or asserted it when known, its exact reference,
its language, and the claims and image records derived from it. Sources and
objects have different identities. A shared URL does not prove that two objects
are the same.

A **claim** has an ID, an object ID, a controlled predicate and a textual value.
Claims stay inside sources so attribution is structural rather than an optional
afterthought. Conflicting names and classifications can coexist.

An **image record** also stays inside a source. It links an object to a local,
publishable image and records alt text, credit, rights, caption and original URL
where available. The binary image lives in Git LFS.

An **editorial** is authored Markdown linked to an object. It is a publication
layer with its own author and language. Editorial prose does not become an
unattributed claim.

## Politics of presentation

The model does not pretend that a collection interface can be neutral.
Foregrounding a Rapa Nui claim is an explicit editorial act by MoSA. The source
and wording remain visible so prominence does not become an invisible claim of
universal truth.

The canonical object name is necessary for navigation and URLs, but it is
deliberately thin. Source-attributed names and classifications remain available
on the page. Rich MoSA interpretation has named authorship in editorials rather
than being smuggled into supposedly objective database fields.

This preserves a practical form of plurality while accepting the limits of the
reduced phase. It does not yet model full provenance events, custody histories,
restitution cases, cultural authority, access protocols or competing event
chronologies. The retained [competency cases](test-cases/) document those needs
without making the current publishing job depend on implementing all of them.

## Publication boundary

Git review is the publication workflow. Everything committed under
`collection/` is eligible for the public build. This makes publication simple
and auditable, but it also means private notes, unlicensed media and uncertain
drafts must stay outside that directory until the team chooses to publish them.

The initial migration intentionally includes 17 canonical records and three
previously unaccepted drafts at the owner's direction. The
[migration report](../collection/migration-report.md) identifies those records
for later review.
