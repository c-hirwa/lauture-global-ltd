import { describe, expect, it } from "vitest";
import { normalizeCalLink } from "./CalBooking";

describe("normalizeCalLink", () => {
  it("converts a full Cal.com URL into the slug form expected by the embed", () => {
    expect(normalizeCalLink("https://cal.com/lauture-global/basic-guidance-consultation")).toBe(
      "lauture-global/basic-guidance-consultation",
    );
  });

  it("strips cal.com host prefixes from slug-like links", () => {
    expect(normalizeCalLink("cal.com/lauture-global/discovery-call")).toBe(
      "lauture-global/discovery-call",
    );
  });
});
