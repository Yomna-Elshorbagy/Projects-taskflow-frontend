import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import TasksPage from '../Pages/TasksPage';
import { renderWithProviders } from '../Utils/test-utils';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  }
}));

describe('TasksPage Integration Tests', () => {
  it('validates task creation form', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
      </Routes>,
      {
        route: '/projects/proj1/tasks',
        preloadedState: {
          auth: {
            token: 'fake-jwt-token',
            user: { _id: '1', role: 'admin' } as any,
          }
        }
      }
    );

    const user = userEvent.setup();

    // Wait for the tasks and project data to load
    try {
      await waitFor(() => {
        expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
      });
    } catch (e) {
      console.log(document.body.innerHTML);
      throw e;
    }

    // Click "New task" to open the modal
    const newTaskBtn = screen.getByRole('button', { name: /new task/i });
    await user.click(newTaskBtn);

    // Wait for modal
    expect(screen.getByRole('heading', { name: /create task/i })).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    
    // Submit empty form
    await user.click(submitBtn);

    // Assert validation errors
    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Description must be at least 20 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid assignee id/i)).toBeInTheDocument();
    });
  });

  it('successfully creates a task', async () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
      </Routes>,
      {
        route: '/projects/proj1/tasks',
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
      expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
    });

    // Click "New task" to open the modal
    const newTaskBtn = screen.getByRole('button', { name: /new task/i });
    await user.click(newTaskBtn);

    // Fill out form
    await user.type(screen.getByLabelText(/Title/i), 'Valid Task Title');
    await user.type(screen.getByLabelText(/Description/i), 'This is a description that exceeds twenty characters.');
    
    // Wait for the project data to load which populates the assignee dropdown
    await waitFor(() => {
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(5);
    });
    
    const selects = screen.getAllByRole('combobox');
    // Toolbar: Status (0), Priority (1)
    // Modal: Status (2), Priority (3), Assignee (4)
    const assigneeSelect = selects[4];
    await user.selectOptions(assigneeSelect, '507f1f77bcf86cd799439011'); // Select 'Test User'

    // Due date
    const dueDateInput = container.querySelector('input[type="date"]') as HTMLElement;
    await user.type(dueDateInput, '2026-10-10');
    
    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // Should succeed and show success toast
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Task Created!'
        })
      );
    });
  });
});
