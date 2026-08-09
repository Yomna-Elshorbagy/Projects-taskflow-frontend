import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ProfilePage from '../Pages/ProfilePage';
import { renderWithProviders } from '../Utils/test-utils';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  }
}));

describe('ProfilePage Integration Tests', () => {
  it('populates form with profile data and handles invalid updates', async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        auth: {
          token: 'fake-jwt-token',
          user: null,
        }
      }
    });

    const user = userEvent.setup();

    // Wait for the data to load and form to be populated
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('01000000000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cairo, Egypt')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });

    // Invalid update: name too short
    await user.clear(nameInput);
    await user.type(nameInput, 'ab');

    // Invalid update: invalid mobile format
    await user.clear(mobileInput);
    await user.type(mobileInput, '12345');

    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText(/Username must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Must be a valid Egyptian mobile number/i)).toBeInTheDocument();
    });
  });

  it('successfully updates profile', async () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        auth: {
          token: 'fake-jwt-token',
          user: null,
        }
      }
    });

    const user = userEvent.setup();

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Full Name/i);
    const saveBtn = screen.getByRole('button', { name: /save changes/i });

    // Valid update
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated User');

    // The save button should be enabled since we have dirty fields
    expect(saveBtn).not.toBeDisabled();

    await user.click(saveBtn);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Success',
        })
      );
    });
  });
});
