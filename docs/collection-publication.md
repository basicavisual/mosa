# Collection authoring and publication

Every tracked record in `collection/` is public material. Git history supplies
review, authorship and rollback. There is no separate database publishing step.

## Add or edit an object

Create `collection/objects/<id>.json`:

```json
{
  "id": "example-object",
  "name": "Concise navigation name",
  "foregroundedClaims": ["example-claim"]
}
```

The filename must match `id`. Preserve existing UUIDs because they are public
URLs. The `name` is an editorial navigation label; put names asserted by
sources in `has_name` claims.

## Add a source, claims and images

Create `collection/sources/<id>.json`:

```json
{
  "id": "example-source",
  "author": "Named person or institution",
  "reference": "https://example.org/catalogue/123",
  "language": "en-GB",
  "claims": [
    {
      "id": "example-claim",
      "objectId": "example-object",
      "predicate": "classified_as",
      "value": "Moai / Living Ancestor"
    }
  ],
  "images": [
    {
      "id": "example-image",
      "objectId": "example-object",
      "file": "example-object/front.jpg",
      "alt": "Front view of the object",
      "credit": "Institution or photographer",
      "rights": "Rights statement",
      "originalUrl": "https://example.org/catalogue/123"
    }
  ]
}
```

Use `null` for an unknown author rather than inventing one. Use a BCP 47
language tag such as `es-CL`, `en-GB`, `rap` or `und`.

Download only images MoSA is authorised to publish. Put each binary at
`collection/images/<file>`; the repository's Git LFS rules track supported
image formats. A normal checkout restores the image before Astro and Docker
optimise it. Do not use remote museum image URLs as the only production asset:
they can change, block hotlinking or disappear. Keep the original URL in the
image record for provenance.

## Add an editorial

Create `collection/editorials/<id>.md`:

```markdown
---
id: example-editorial
objectId: example-object
title: Editorial title
author: Named author
language: es-CL
---

Editorial text in Markdown.
```

Use `author: null` only while authorship is genuinely unresolved. An editorial
can be in one language; the page marks its language rather than pretending it is
translated. Claims made in the prose do not automatically become structured
claims.

## Foreground a perspective

Add the chosen claim ID to the object's `foregroundedClaims` array. The claim
must refer to that object. Keep the source visible and choose foregrounding
through editorial discussion: it is MoSA taking a position, not a technical
calculation.

## Validate and review

Run:

```sh
just collection-check
just website-build
```

Review the affected object page in both routes. Check attribution, source
language, image rights and alt text, foregrounding, and whether the canonical
navigation name obscures a source account.

## Deploy and withdraw

Merging collection changes does not deploy automatically. The manually
dispatched Website workflow builds the repository with Git LFS, deploys through
Coolify and verifies the exact commit and both language collection pages.

To withdraw material, delete its editorial, image reference, claim, source or
object as appropriate, review links, and deploy the new commit. Preserve the Git
history. For an urgent rollback, revert the responsible commit and deploy that
revert.
