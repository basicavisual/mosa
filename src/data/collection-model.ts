export const predicates = [
  "has_name",
  "classified_as",
  "described_as",
  "made_of",
  "made_at",
  "made_during",
  "found_at",
  "held_by",
  "located_at",
  "catalogue_number",
] as const;

export type Predicate = (typeof predicates)[number];

export interface CollectionObject {
  id: string;
  name: string;
  foregroundedClaims: string[];
}

export interface Claim {
  id: string;
  objectId: string;
  predicate: Predicate;
  value: string;
}

export interface CollectionImage {
  id: string;
  objectId: string;
  file: string;
  alt: string;
  originalUrl?: string;
  caption?: string;
  credit?: string;
  rights?: string;
}

export interface Source {
  id: string;
  author: string | null;
  reference: string;
  language: string;
  claims: Claim[];
  images: CollectionImage[];
}

export interface EditorialMetadata {
  id: string;
  objectId: string;
  title: string;
  author: string | null;
  language: string;
}

export interface CollectionData {
  objects: CollectionObject[];
  sources: Source[];
}

const identifier =
  /^(?:[a-z0-9][a-z0-9-]*|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
const language = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
const imagePath = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$)).+\.(?:avif|jpe?g|png|webp)$/i;
const objectKeys = ["foregroundedClaims", "id", "name"];
const sourceKeys = ["author", "claims", "id", "images", "language", "reference"];
const claimKeys = ["id", "objectId", "predicate", "value"];
const imageKeys = ["alt", "caption", "credit", "file", "id", "objectId", "originalUrl", "rights"];

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const sameKeys = (value: Record<string, unknown>, allowed: string[]) =>
  Object.keys(value).every((key) => allowed.includes(key));
const text = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const id = (value: unknown) => typeof value === "string" && identifier.test(value);
const add = (errors: string[], condition: boolean, message: string) => {
  if (!condition) errors.push(message);
};

export function parseObject(value: unknown, file: string): CollectionObject {
  const errors: string[] = [];
  add(errors, isObject(value), `${file}: expected an object`);
  if (!isObject(value)) throw Error(errors.join("\n"));
  add(errors, sameKeys(value, objectKeys), `${file}: contains an unsupported field`);
  add(errors, id(value.id), `${file}: id is invalid`);
  add(errors, text(value.name), `${file}: name is required`);
  add(
    errors,
    Array.isArray(value.foregroundedClaims),
    `${file}: foregroundedClaims must be an array`,
  );
  if (Array.isArray(value.foregroundedClaims)) {
    add(
      errors,
      value.foregroundedClaims.every(id),
      `${file}: foregroundedClaims contains an invalid id`,
    );
    add(
      errors,
      new Set(value.foregroundedClaims).size === value.foregroundedClaims.length,
      `${file}: foregroundedClaims contains duplicates`,
    );
  }
  if (errors.length) throw Error(errors.join("\n"));
  return value as unknown as CollectionObject;
}

export function parseSource(value: unknown, file: string): Source {
  const errors: string[] = [];
  add(errors, isObject(value), `${file}: expected an object`);
  if (!isObject(value)) throw Error(errors.join("\n"));
  add(errors, sameKeys(value, sourceKeys), `${file}: contains an unsupported field`);
  add(errors, id(value.id), `${file}: id is invalid`);
  add(errors, value.author === null || text(value.author), `${file}: author must be text or null`);
  add(errors, text(value.reference), `${file}: reference is required`);
  add(
    errors,
    typeof value.language === "string" && language.test(value.language),
    `${file}: language is invalid`,
  );
  add(errors, Array.isArray(value.claims), `${file}: claims must be an array`);
  add(errors, Array.isArray(value.images), `${file}: images must be an array`);
  if (Array.isArray(value.claims))
    value.claims.forEach((claim, index) => {
      const at = `${file}: claims[${index}]`;
      add(errors, isObject(claim), `${at} must be an object`);
      if (!isObject(claim)) return;
      add(errors, sameKeys(claim, claimKeys), `${at} contains an unsupported field`);
      add(errors, id(claim.id), `${at}.id is invalid`);
      add(errors, id(claim.objectId), `${at}.objectId is invalid`);
      add(
        errors,
        predicates.includes(claim.predicate as Predicate),
        `${at}.predicate is unsupported`,
      );
      add(errors, text(claim.value), `${at}.value is required`);
    });
  if (Array.isArray(value.images))
    value.images.forEach((entry, index) => {
      const at = `${file}: images[${index}]`;
      add(errors, isObject(entry), `${at} must be an object`);
      if (!isObject(entry)) return;
      add(errors, sameKeys(entry, imageKeys), `${at} contains an unsupported field`);
      add(errors, id(entry.id), `${at}.id is invalid`);
      add(errors, id(entry.objectId), `${at}.objectId is invalid`);
      add(
        errors,
        typeof entry.file === "string" && imagePath.test(entry.file),
        `${at}.file must be a safe collection image path`,
      );
      add(errors, typeof entry.alt === "string", `${at}.alt is required`);
      for (const field of ["caption", "credit", "rights"])
        if (field in entry) add(errors, text(entry[field]), `${at}.${field} cannot be empty`);
      if ("originalUrl" in entry) {
        try {
          const url = new URL(String(entry.originalUrl));
          add(
            errors,
            ["http:", "https:"].includes(url.protocol),
            `${at}.originalUrl must use http(s)`,
          );
        } catch {
          errors.push(`${at}.originalUrl is invalid`);
        }
      }
    });
  if (errors.length) throw Error(errors.join("\n"));
  return value as unknown as Source;
}

export function validateCollection(
  data: CollectionData,
  options: {
    objectFiles?: Map<string, string>;
    sourceFiles?: Map<string, string>;
    imageFiles?: Set<string>;
  } = {},
) {
  const errors: string[] = [];
  const objects = new Map<string, CollectionObject>();
  const claims = new Map<string, Claim>();
  const images = new Set<string>();
  const sources = new Set<string>();
  for (const object of data.objects) {
    if (objects.has(object.id)) errors.push(`duplicate object id: ${object.id}`);
    objects.set(object.id, object);
    const filename = options.objectFiles?.get(object.id);
    if (filename && filename !== `${object.id}.json`)
      errors.push(`${filename}: filename must match object id ${object.id}`);
  }
  for (const source of data.sources) {
    if (sources.has(source.id)) errors.push(`duplicate source id: ${source.id}`);
    sources.add(source.id);
    const filename = options.sourceFiles?.get(source.id);
    if (filename && filename !== `${source.id}.json`)
      errors.push(`${filename}: filename must match source id ${source.id}`);
    for (const claim of source.claims) {
      if (claims.has(claim.id)) errors.push(`duplicate claim id: ${claim.id}`);
      claims.set(claim.id, claim);
      if (!objects.has(claim.objectId))
        errors.push(`claim ${claim.id} refers to missing object ${claim.objectId}`);
    }
    for (const image of source.images) {
      if (images.has(image.id)) errors.push(`duplicate image id: ${image.id}`);
      images.add(image.id);
      if (!objects.has(image.objectId))
        errors.push(`image ${image.id} refers to missing object ${image.objectId}`);
      if (options.imageFiles && !options.imageFiles.has(image.file))
        errors.push(`image ${image.id} refers to missing file ${image.file}`);
    }
  }
  for (const object of data.objects)
    for (const claimId of object.foregroundedClaims) {
      const claim = claims.get(claimId);
      if (!claim) errors.push(`object ${object.id} foregrounds missing claim ${claimId}`);
      else if (claim.objectId !== object.id)
        errors.push(`object ${object.id} foregrounds claim ${claimId} about ${claim.objectId}`);
    }
  if (errors.length) throw Error(errors.join("\n"));
  return {
    objects: [...objects.values()].sort((a, b) => a.id.localeCompare(b.id)),
    sources: [...data.sources].sort((a, b) => a.id.localeCompare(b.id)),
    claims,
  };
}

export function parseEditorialFrontmatter(value: string, file: string): EditorialMetadata {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(value);
  if (!match) throw Error(`${file}: editorial requires YAML front matter`);
  const fields = new Map<string, string | null>();
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const field = /^([A-Za-z][A-Za-z0-9]*):(?:\s+(.*))?$/.exec(line);
    if (!field) throw Error(`${file}: editorial front matter accepts scalar fields only`);
    const raw = field[2]?.trim() ?? "";
    fields.set(
      field[1],
      raw === "null" || raw === "~" || raw === ""
        ? null
        : raw.replace(/^(?:"(.*)"|'(.*)')$/, "$1$2"),
    );
  }
  const allowed = new Set(["id", "objectId", "title", "author", "language"]);
  if ([...fields.keys()].some((key) => !allowed.has(key)))
    throw Error(`${file}: editorial contains an unsupported field`);
  const metadata = Object.fromEntries(fields) as unknown as EditorialMetadata;
  if (
    !id(metadata.id) ||
    !id(metadata.objectId) ||
    !text(metadata.title) ||
    !(metadata.author === null || text(metadata.author)) ||
    !language.test(metadata.language)
  )
    throw Error(`${file}: editorial front matter is incomplete or invalid`);
  return metadata;
}
