import { describe, expect, test } from "vitest";
import {
  parseEditorialFrontmatter,
  parseObject,
  parseSource,
  validateCollection,
} from "./collection-model";

const object = parseObject(
  { id: "object-one", name: "Object one", foregroundedClaims: ["claim-one"] },
  "object-one.json",
);
const source = parseSource(
  {
    id: "source-one",
    author: null,
    reference: "Example catalogue",
    language: "en-GB",
    claims: [
      { id: "claim-one", objectId: "object-one", predicate: "has_name", value: "Object one" },
    ],
    images: [
      { id: "image-one", objectId: "object-one", file: "object-one/front.jpg", alt: "Front view" },
    ],
  },
  "source-one.json",
);

describe("collection model", () => {
  test("validates linked records and images", () => {
    const data = validateCollection(
      { objects: [object], sources: [source] },
      { imageFiles: new Set(["object-one/front.jpg"]) },
    );
    expect(data.claims.get("claim-one")?.value).toBe("Object one");
  });

  test("rejects foregrounding a missing claim", () => {
    expect(() => validateCollection({ objects: [object], sources: [] })).toThrow(
      "foregrounds missing claim",
    );
  });

  test("rejects unsafe image paths", () => {
    expect(() =>
      parseSource(
        { ...source, images: [{ ...source.images[0], file: "../front.jpg" }] },
        "source-one.json",
      ),
    ).toThrow("safe collection image path");
  });

  test("parses prose-only editorial metadata", () => {
    expect(
      parseEditorialFrontmatter(
        "---\nid: essay-one\nobjectId: object-one\ntitle: A title\nauthor: null\nlanguage: rap\n---\n\nText.",
        "essay-one.md",
      ),
    ).toEqual({
      id: "essay-one",
      objectId: "object-one",
      title: "A title",
      author: null,
      language: "rap",
    });
  });
});
