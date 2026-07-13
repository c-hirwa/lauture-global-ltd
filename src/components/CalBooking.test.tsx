import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CalBooking from "./CalBooking";

vi.mock("@calcom/embed-react", () => ({
  __esModule: true,
  default: ({ calLink }: { calLink: string }) => <div data-testid="cal-widget">{calLink}</div>,
  getCalApi: vi.fn(),
}));

describe("CalBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a fallback iframe when the Cal SDK cannot initialize", async () => {
    const getCalApi = vi.fn().mockRejectedValue(new Error("blocked"));
    vi.mocked(require("@calcom/embed-react").getCalApi).mockImplementation(getCalApi);

    render(<CalBooking calLink="lauture-global/discovery-call" />);

    const iframe = await screen.findByTitle(/book a consultation/i);
    expect(iframe).toHaveAttribute("src", expect.stringContaining("lauture-global/discovery-call"));
    expect(iframe).toHaveAttribute("src", expect.stringContaining("embed=1"));
  });
});
