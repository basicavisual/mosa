# 017: Prepare research locally and import private bundles

## Status

Superseded by [ADR 020](020-use-a-git-backed-public-collection.md). Retained as
the record of the former private-bundle workflow.

## Context

The first discovery implementation put capture, model preparation and lead search
behind a hosted runner, then Supabase queue/Cron delivery. The project subsequently
chose ordinary local human/agent research sessions and bundle upload to reduce
hosted execution and credential requirements while retaining preserved evidence
and explicit review.

## Decision

- Discover and prepare locally. Preserve original PDF/HTML/JSON bytes and retrieval
  metadata in a bounded bundle with proposals and unresolved lead outcomes.
- Import the bundle into owner-private sources and drafts. Require the same
  identity confirmation and human acceptance as manual preparation.
- Reuse the shared dossier validator/importer for canonical acceptance. A bundle
  import itself creates neither accepted claims nor publication decisions.
- Keep invited Auth, private Storage and the separate publication boundary.
- Retire hosted job delivery while retaining historical source, job and draft data.

## Alternatives and consequences

A hosted worker and managed queue can support persistent campaigns, but add
service credentials, scheduling and recovery operations. They are unnecessary for bounded local contributions.

Local preparation needs no app model/search API keys, but a local agent's services
still have account, network and data-processing requirements. It is not necessarily
offline inference. Source instructions remain untrusted; permission to preserve,
process externally, accept and publish remains distinct.

Retries of the same bundle are idempotent and preserve edits. Changed content needs
a new bundle identity. Preparer metadata is a supplied assertion, separate from
signed-in ownership/review. HTML/JSON quotations are checked against saved bytes;
PDF evidence still requires visual review. Cross-bundle object identity remains a
human decision.

## Historical implementation

The migrations and bundle importer were removed when the database and explorer
were retired. Their implementation remains available in Git history.
