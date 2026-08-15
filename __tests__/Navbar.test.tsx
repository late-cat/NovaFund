import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Navbar from '../src/components/Navbar';

// Mock the framer-motion hooks to avoid layout animation issues in Jest
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: () => 0,
  };
});

describe('Navbar Component', () => {
  it('renders the NovaFund logo text', () => {
    render(<Navbar />);
    expect(screen.getByText('NovaFund')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
