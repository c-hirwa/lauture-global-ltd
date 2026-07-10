import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import PackageModal, { type PackageData } from "@/components/PackageModal";

const insertMock = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("PackageModal intake flow", () => {
  beforeEach(() => {
    insertMock.mockReset();
    insertMock.mockResolvedValue({ error: null });
    window.open = vi.fn() as unknown as typeof window.open;
  });

  it("submits the intake form to Supabase and opens checkout", async () => {
    const pkg: PackageData = {
      id: "basic",
      title: "Basic Guidance",
      subtitle: "Test package",
      price: 500,
      objective: "Test objective",
      whatYouGet: [],
      forWho: [],
      outcome: [],
      ctaLabel: "Start",
    };

    render(<PackageModal pkg={pkg} open={true} onOpenChange={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+250780000000" } });
    fireEvent.change(screen.getByLabelText(/country you are relocating from/i), { target: { value: "Kenya" } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    fireEvent.click(screen.getByRole("radio", { name: /solo/i }));
    fireEvent.click(screen.getByRole("radio", { name: /relocation/i }));
    fireEvent.click(screen.getByRole("radio", { name: /urban city life/i }));
    fireEvent.click(screen.getByRole("radio", { name: /within 3 months/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    fireEvent.click(screen.getByRole("button", { name: /proceed to payment/i }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));

    expect(insertMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          full_name: "Ada Lovelace",
          email: "ada@example.com",
          phone: "+250780000000",
          country: "Kenya",
          travelers: "Solo",
          purpose: "Relocation",
          lifestyle: "Urban city life",
          timeline: "Within 3 months",
          package_title: "Basic Guidance",
          package_price: 500,
        }),
      ]),
    );
    expect(window.open).toHaveBeenCalled();
  });

  it("falls back to a simpler payload when the table is missing columns", async () => {
    insertMock
      .mockResolvedValueOnce({ error: { message: "Could not find the 'package_price' column" } })
      .mockResolvedValueOnce({ error: null });

    const pkg: PackageData = {
      id: "basic",
      title: "Basic Guidance",
      subtitle: "Test package",
      price: 500,
      objective: "Test objective",
      whatYouGet: [],
      forWho: [],
      outcome: [],
      ctaLabel: "Start",
    };

    render(<PackageModal pkg={pkg} open={true} onOpenChange={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+250780000000" } });
    fireEvent.change(screen.getByLabelText(/country you are relocating from/i), { target: { value: "Kenya" } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.click(screen.getByRole("radio", { name: /solo/i }));
    fireEvent.click(screen.getByRole("radio", { name: /relocation/i }));
    fireEvent.click(screen.getByRole("radio", { name: /urban city life/i }));
    fireEvent.click(screen.getByRole("radio", { name: /within 3 months/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    fireEvent.click(screen.getByRole("button", { name: /proceed to payment/i }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(2));
    expect(window.open).toHaveBeenCalled();
  });
});
