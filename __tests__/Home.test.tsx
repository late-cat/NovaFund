import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

// Mock the custom hook to avoid async state updates during testing
jest.mock('../src/hooks/useCampaigns', () => ({
  useCampaigns: () => ({
    campaigns: [],
    loading: false,
    error: null,
    fetchCampaigns: jest.fn(),
  })
}));

describe('Home Page', () => {
  it('renders the hero section with the title', () => {
    render(<Home />);
    expect(screen.getByText(/Fund the future on/i)).toBeInTheDocument();
  });

  it('renders the Start a Campaign button', () => {
    render(<Home />);
    const buttons = screen.getAllByText('Start a Campaign');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders the explore section heading', () => {
    render(<Home />);
    expect(screen.getByText(/Launch your visionary projects with trustless, decentralized crowdfunding/i)).toBeInTheDocument();
  });
});
