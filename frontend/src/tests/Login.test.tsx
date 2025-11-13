import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../pages/Login';
import { useAuth } from '../context/AuthContext';
import { vi } from 'vitest';
import { ReactNode } from 'react';

vi.mock('../context/AuthContext');

const mockedUseAuth = useAuth as unknown as vi.Mock;

const renderWithProviders = (children: ReactNode) => render(<BrowserRouter>{children}</BrowserRouter>);

describe('Login page', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      login: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn(),
      user: null,
      token: null,
      isAuthenticated: false
    });
  });

  it('renders login form inputs', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('submits the form with credentials', async () => {
    const loginMock = vi.fn().mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({
      login: loginMock,
      logout: vi.fn(),
      user: null,
      token: null,
      isAuthenticated: false
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('user@example.com', 'password123');
    });
  });
});
