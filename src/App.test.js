import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login page when not authenticated', async () => {
  // Clear any stored user so we always start on the login screen.
  localStorage.removeItem('cnook_user');
  render(<App />);
  // The login page shows "Sign in" tab text.
  const signInButton = await screen.findByText(/sign in/i);
  expect(signInButton).toBeInTheDocument();
});
