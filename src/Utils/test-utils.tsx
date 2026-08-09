import type { PropsWithChildren, ReactElement } from 'react';
import type { Reducer, UnknownAction } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import authReducer from '../Store/Slices/AuthSlice';
import type { RootState } from '../Store/store';

interface ExtendedRenderOptions {
  preloadedState?: Partial<RootState>;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const store = configureStore({
    reducer: {
      auth: authReducer as Reducer<RootState['auth'], UnknownAction, RootState['auth'] | undefined>,
    },
    preloadedState,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries for testing
      },
    },
  });

  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }: PropsWithChildren<unknown>): ReactElement {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
