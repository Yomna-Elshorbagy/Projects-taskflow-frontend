import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Sidebar from '../Components/Sidebar';
import { renderWithProviders } from '../Utils/test-utils';

describe('Sidebar Integration Tests', () => {
  it('clears user data on logout', async () => {
    // Initial state with a logged in user
    const { store } = renderWithProviders(<Sidebar />, {
      preloadedState: {
        auth: {
          token: 'valid-token',
          user: {
            _id: '1',
            userName: 'TestUser',
            email: 'test@test.com',
            role: 'member',
            gender: 'male',
            mobileNumber: '01000000000',
            status: 'verified',
            isVerified: true
          },
        },
      },
    });

    // Ensure the token exists initially
    expect(store.getState().auth.token).toBe('valid-token');

    // Find the logout button
    const logoutBtn = screen.getByTitle(/Logout/i);
    const user = userEvent.setup();
    
    // Click logout
    await user.click(logoutBtn);

    // The store should be cleared
    const state = store.getState().auth;
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });
});
