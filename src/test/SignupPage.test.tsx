import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SignupPage from '../Pages/SignupPage';
import { renderWithProviders } from '../Utils/test-utils';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  }
}));

describe('SignupPage Integration Tests', () => {
  it('shows validation errors for empty submission', async () => {
    renderWithProviders(<SignupPage />);
    const user = userEvent.setup();

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Username must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid password pattern/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid Egyptian mobile number/i)).toBeInTheDocument();
    });
  });

  it('shows password mismatch error', async () => {
    renderWithProviders(<SignupPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Full name/i), 'New User');
    await user.type(screen.getByLabelText(/Work email/i), 'new@example.com');
    await user.selectOptions(screen.getByLabelText(/Gender/i), 'male');
    await user.type(screen.getByLabelText(/Mobile Number/i), '01012345678');
    await user.type(screen.getByLabelText(/Password/i, { selector: 'input[id="password"]' }), 'Test1234');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'Test5678');
    
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Password and Confirm Password do not match/i)).toBeInTheDocument();
    });
  });

  it('successfully creates an account and redirects', async () => {
    const { store } = renderWithProviders(<SignupPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Full name/i), 'New User');
    await user.type(screen.getByLabelText(/Work email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/Password/i, { selector: 'input[id="password"]' }), 'Password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'Password123');
    await user.selectOptions(screen.getByLabelText(/Gender/i), 'male');
    await user.type(screen.getByLabelText(/Mobile Number/i), '01012345678');
    
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Account Created!'
        })
      );
    });

    const state = store.getState().auth;
    expect(state.token).toBe('fake-jwt-token');
    expect(state.user?.email).toBe('new@example.com');
  });

  it('handles API signup conflict (e.g. email exists)', async () => {
    renderWithProviders(<SignupPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Full name/i), 'Existing User');
    await user.type(screen.getByLabelText(/Work email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/Password/i, { selector: 'input[id="password"]' }), 'Password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'Password123');
    await user.selectOptions(screen.getByLabelText(/Gender/i), 'male');
    await user.type(screen.getByLabelText(/Mobile Number/i), '01012345678');
    
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Signup Failed',
          text: 'Email already exists.'
        })
      );
    });
  });
});
