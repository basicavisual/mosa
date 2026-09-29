# Supabase collection migration

This report records the conversion from the final Supabase export taken on
2026-09-29. The private SQL export, Auth records, uploaded source documents and
original bundle proposals remain under the ignored `research-local/` directory.

## Result

- 17 canonical objects became object JSON files.
- 3 unaccepted drafts became separate object JSON files for later review. The
  Hoa Haka Nana Ia draft remains separate from the existing Hoa Hakananaiʻa
  object; the migration does not assert that they are the same record.
- 33 active claims about canonical objects became source claims.
- 7 external identifiers became `catalogue_number` claims.
- 3 draft name proposals became source claims.
- 12 entity-name claims provide readable values for agents and places rather
  than becoming independent collection claims.
- 19 structural `refers_to` claims are represented by claims and images carrying
  an `objectId` rather than copied as public claims.
- No active canonical claim was omitted for lacking evidence.
- The database contained no foregrounding selections, provenance events or
  restitution records, so the migration did not invent any.
- The source archive contained 3 PDFs and 3 HTML captures. These remain private
  evidence and are not presented as object images.
- Two supplied Spanish editorials were added for Mamari and Hoa Hakananaiʻa.
  Their authors were not recorded in the supplied files and remain `null`.

## Object reconciliation

| Object | Previous state | Git record |
| --- | --- | --- |
| Hoa Hakananaiʻa | Visible legacy publication | `077f88f1-278a-4d76-90e3-a9276953b387` |
| Aroukou Kurenga | Visible reviewed dossier | `9060635b-5c72-4030-a6a8-1e1740a57fde` |
| Rei miro de concha | Visible reviewed dossier | `f2532418-8f48-4e66-a087-d7b345b0f72d` |
| Rei miro con caras humanas y figura incise al centro | Visible reviewed dossier | `bc103cff-9ee0-4233-bb5d-984dcb109637` |
| Tahonga simple con incrustaciones | Visible reviewed dossier | `f69dc677-465b-41d3-9abe-62aefb1900e2` |
| Figura humana con boca circular | Visible reviewed dossier | `2c84d7bd-edcd-4035-b3e8-db968f343414` |
| Kava kava de doble cabeza | Visible reviewed dossier | `03e36844-7240-4318-abcb-2419eed4e3a5` |
| Rei miro de gallo | Visible reviewed dossier | `a3fd565a-c691-413d-9944-7f78fbe58ae2` |
| Piedra almohada con petroglifos (ngaru’a) | Visible reviewed dossier | `d020b17d-3aa1-4df5-aeda-b61d220e3f88` |
| Tangata Manu con signos rongo rongo | Visible reviewed dossier | `cdf42f48-1371-4e4b-88b3-fd33158e3cf9` |
| Ao pintado | Visible reviewed dossier | `3cad86a5-9e69-435f-a5d5-a8ff1b736674` |
| Moai de piedra con sombrero | Visible reviewed dossier | `0ad35cd6-b197-4f6b-bfe7-7a7c38ec9029` |
| figure ('moai kavakava') | Accepted draft without a visible publication | `0ee63e63-d7b8-4287-b373-54ca77d0bd15` |
| Mamari | Canonical bootstrap object without a visible publication | `588adff0-0fe0-4ed5-9fbf-1f95c3211c7a` |
| moai kavakava | Canonical bootstrap object without a visible publication | `a1a3b544-a63a-4346-9e6c-f97dd31a70d8` |
| МАЭ № 736-205 | Canonical bootstrap object without a visible publication | `e81ffe0f-d12c-458b-a334-18c57a48c438` |
| Plaque depicting an Oba with mudfish legs and two leopards | Canonical bootstrap object without a visible publication | `ef2fd3c5-7715-48f5-9e52-bfc0e4505ddb` |
| Ao (Dance paddle) | Unaccepted draft | `6c2c0808-a209-4767-b463-270db9f8d285` |
| Ua (staff or club) | Unaccepted draft | `f3914957-34ed-41e9-8ee2-57f4d0dddd64` |
| Hoa Haka Nana Ia | Draft under review | `41a6aec8-37e1-4853-aae9-cb2b8bafdfaf` |

## Deliberately retained outside the collection

The `arte-escultura-ten-objects` bundle proposed 50 claims. Review accepted 10
of those claims into canonical records. The other 40 remain in the private
bundle and were not silently promoted during migration.

Evidence relationships, locators and excerpts remain in the private export.
The reduced public model preserves the source, predicate and value but does not
claim that a source author personally made every quoted or reported assertion.
