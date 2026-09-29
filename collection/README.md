# MoSA collection

The public collection is part of the website build. Every tracked record is
publishable.

## Structure

- `objects/`: one JSON file per collection object.
- `sources/`: one JSON file per source, including its claims and image records.
- `editorials/`: optional Markdown articles with YAML front matter.
- `images/`: local collection images tracked with Git LFS.
- `schema/`: JSON Schemas for object and source files.

The filename must match the record `id`. Use lower-case letters, numerals and
hyphens for new identifiers. Existing UUID object identifiers remain valid so
published URLs do not change.

Editorial files use this front matter followed by ordinary Markdown:

```markdown
---
id: example-editorial
objectId: example-object
title: Example title
author: Example author
language: en-GB
---

Editorial text.
```

Editorial prose does not create structured claims. Put foregroundable statements
in a source JSON file.

Run `just collection-check` before committing collection changes.
