import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Frame Vist hero copy', () => {
  render(<App />);
  const heroCopy = screen.getByText(/Curated AI capsules/i);
  expect(heroCopy).toBeInTheDocument();
});
