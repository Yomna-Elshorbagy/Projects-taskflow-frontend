import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RequireAuth, RequireGuest } from '../App';
import { renderWithProviders } from '../Utils/test-utils';
import type { User } from '../Interfaces/IUser';

// Mock child components
const ProtectedChild = () => <div data-testid="protected-content">Protected Content</div>;
const GuestChild = () => <div data-testid="guest-content">Guest Content</div>;

// Mock Navigate to intercept redirects in BrowserRouter
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid={`navigate-to-${to}`}>Redirected to {to}</div>,
  };
});

describe('Routing and Authorization Tests', () => {
  describe('RequireAuth', () => {
    it('redirects to /login if user is not authenticated', () => {
      // preloadedState defaults to empty object -> no token
      renderWithProviders(
        <RequireAuth>
          <ProtectedChild />
        </RequireAuth>
      );

      // Should not render protected content
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      // Should render the mocked Navigate component
      expect(screen.getByTestId('navigate-to-/login')).toBeInTheDocument();
    });

    it('renders children if user is authenticated', () => {
      renderWithProviders(
        <RequireAuth>
          <ProtectedChild />
        </RequireAuth>,
        {
          preloadedState: {
            auth: { token: 'valid-token', user: {} as User },
          },
        }
      );

      // Should render protected content
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      // Should not render redirect
      expect(screen.queryByTestId('navigate-to-/login')).not.toBeInTheDocument();
    });
  });

  describe('RequireGuest', () => {
    it('redirects to / if user is authenticated', () => {
      renderWithProviders(
        <RequireGuest>
          <GuestChild />
        </RequireGuest>,
        {
          preloadedState: {
            auth: { token: 'valid-token', user: {} as User },
          },
        }
      );

      // Should not render guest content
      expect(screen.queryByTestId('guest-content')).not.toBeInTheDocument();
      // Should render redirect
      expect(screen.getByTestId('navigate-to-/')).toBeInTheDocument();
    });

    it('renders children if user is not authenticated', () => {
      renderWithProviders(
        <RequireGuest>
          <GuestChild />
        </RequireGuest>
      );

      // Should render guest content
      expect(screen.getByTestId('guest-content')).toBeInTheDocument();
      // Should not render redirect
      expect(screen.queryByTestId('navigate-to-/')).not.toBeInTheDocument();
    });
  });
});
