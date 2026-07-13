import { describe, expect, it } from "vitest";
import { normalizeCalLink } from "./CalBooking";

describe("normalizeCalLink", () => {
  it("converts a full Cal.com URL into the slug form expected by the embed", () => {
    expect(normalizeCalLink("https://cal.com/lauture-global/basic-guidance-consultation")).toBe(
      "lauture-global/basic-guidance-consultation",
    );
  });

  it("keeps a slug-like cal link unchanged", () => {
    expect(normalizeCalLink("lauture-global/discovery-call")).toBe("lauture-global/discovery-call");
  });
});
