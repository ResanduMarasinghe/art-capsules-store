import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Frame Vist hero copy', () => {
  render(<App />);
  const heroCopy = screen.getByText(/Where Imagination Meets Vision\./i);
  expect(heroCopy).toBeInTheDocument();
});
