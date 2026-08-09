import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import ProjectsPage from '../Pages/ProjectsPage';
import { renderWithProviders } from '../Utils/test-utils';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  }
}));

describe('ProjectsPage Integration Tests', () => {
  it('validates project creation form', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>,
      {
        route: '/projects',
        preloadedState: {
          auth: {
            token: 'fake-jwt-token',
            user: { _id: '1', role: 'admin' } as any,
          }
        }
      }
    );

    const user = userEvent.setup();

    // Wait for the projects to load
    await waitFor(() => {
      expect(screen.getByText(/Test Project/i)).toBeInTheDocument();
    });

    // Click "New project" to open the modal
    const createProjectBtn = screen.getByRole('button', { name: /new project/i });
    await user.click(createProjectBtn);

    // Wait for modal
    expect(screen.getByRole('heading', { name: /new project/i })).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /create/i, hidden: true });
    
    // Submit empty form
    await user.click(submitBtn);

    // Assert validation errors
    await waitFor(() => {
      expect(screen.getByText(/Project name must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('successfully creates a project', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>,
      {
        route: '/projects',
        preloadedState: {
          auth: {
            token: 'fake-jwt-token',
            user: { _id: '1', role: 'admin' } as any,
          }
        }
      }
    );

    const user = userEvent.setup();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/Test Project/i)).toBeInTheDocument();
    });

    // Click "New project" to open the modal
    const createProjectBtn = screen.getByRole('button', { name: /new project/i });
    await user.click(createProjectBtn);

    // Fill out form
    await user.type(screen.getByLabelText(/Project Name/i), 'New Project Name');
    await user.type(screen.getByLabelText(/Description/i), 'This is a description that exceeds twenty characters.');
    
    const submitBtn = screen.getByRole('button', { name: /create/i, hidden: true });
    await user.click(submitBtn);

    // Should succeed and show success toast
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Project Created!'
        })
      );
    });
  });
});
