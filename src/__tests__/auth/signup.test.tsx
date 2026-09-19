import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SignUpForm from "@/app/auth/signup/components/signup-form";
// Mock the next/navigation hooks
const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

// Mock the supabase client factory
const mockSupabase = {
  auth: {
    signUp: jest.fn(),
  },
};

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

const supabase = mockSupabase;

describe("SignUp Form", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();
  });

  test("renders sign up form with all fields", () => {
    render(<SignUpForm />);

    // Check form elements exist
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create account/i })
    ).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    render(<SignUpForm />);

    const user = userEvent.setup();

    // Submit without filling form
    await user.click(screen.getByRole("button", { name: /Create account/i }));

    // Check error messages
    await waitFor(() => {
      expect(
        screen.getAllByText(/name must be at least 2 characters/i)
      ).toHaveLength(2);
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });
  test("submits the form with valid data", async () => {
    // Mock the successful sign up response
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      error: null,
      data: {
        user: {
          id: "user-1",
          email: "john.doe@example.com",
          email_confirmed_at: "2024-01-01T00:00:00.000Z",
        },
      },
    });

    render(<SignUpForm />);

    const user = userEvent.setup();

    // Fill the form with valid data
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
    await user.type(screen.getByLabelText(/^Password/i), "Password123");
    await user.type(screen.getByLabelText(/Confirm Password/i), "Password123");
    await user.click(screen.getByRole("checkbox"));

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Create account/i }));

    // Verify supabase.auth.signUp was called with the right data
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "john.doe@example.com",
        password: "Password123",
        options: {
          data: {
            first_name: "John",
            last_name: "Doe",
            role: "user",
          },
        },
      });
    }); // Verify we're redirected to dashboard (not verification)
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
  test("displays an error message when signup fails", async () => {
    // Mock a failed sign up response
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      error: { message: "This email is already registered" },
    });

    render(<SignUpForm />);

    const user = userEvent.setup();

    // Fill the form with valid data
    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Email/i), "john.doe@example.com");
    await user.type(screen.getByLabelText(/^Password/i), "Password123");
    await user.type(screen.getByLabelText(/Confirm Password/i), "Password123");
    await user.click(screen.getByRole("checkbox"));

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Create account/i }));

    // Check if error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("This email is already registered")
      ).toBeInTheDocument();
    });
  });
});
