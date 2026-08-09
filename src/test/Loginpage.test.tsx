import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../Pages/Loginpage';
import { renderWithProviders } from '../Utils/test-utils';
import Swal from 'sweetalert2';

// Mock SweetAlert2 since it handles UI independently
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  }
}));

describe('LoginPage Integration Tests', () => {
  it('shows validation errors for invalid input', async () => {
    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    // Find submit button and click it without filling the form
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitBtn);

    // Should display validation errors (from zod schema)
    await waitFor(() => {
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Either email or mobile number must be provided/i)).toBeInTheDocument();
    });
  });

  it('successfully logs in, updates auth state, and shows success message', async () => {
    const { store } = renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    // Fill with correct credentials corresponding to the MSW mock
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Submit
    await user.click(submitBtn);

    // Wait for the mutation to resolve and SweetAlert to be called
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Welcome back!'
        })
      );
    });

    // Check if the store was updated correctly
    const state = store.getState().auth;
    expect(state.token).toBe('fake-jwt-token');
    expect(state.user?.email).toBe('test@example.com');
  });

  it('handles login failure', async () => {
    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    // Fill with incorrect credentials
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    
    // Submit
    await user.click(submitBtn);

    // Wait for the mutation to fail and SweetAlert error to be shown
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Login Failed'
        })
      );
    });
  });

  it('shows validation errors for invalid formats (email or mobile)', async () => {
    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/Email/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    // Try submitting with an invalid email
    await user.type(emailInput, 'not-an-email');
    await user.click(submitBtn);

    await waitFor(() => {
      // The schema returns "Invalid email" if it's not a valid email, OR the refine kicks in if both are empty.
      // Since it's not empty, it should say "Invalid email"
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });
  });
});
