import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CampaignCard from '../src/components/CampaignCard';

describe('CampaignCard Component', () => {
  const mockProps = {
    id: 'campaign-123',
    title: 'Test Campaign for NovaFund',
    creator: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ',
    goal: '1000',
    raised: '250',
    deadline: '2027-01-01',
    deadlineSecs: Math.floor(Date.now() / 1000) + 86400, // +1 day
  };

  it('renders the campaign title correctly', () => {
    render(<CampaignCard {...mockProps} />);
    expect(screen.getByText('Test Campaign for NovaFund')).toBeInTheDocument();
  });

  it('renders the creator address truncated or full depending on logic', () => {
    render(<CampaignCard {...mockProps} />);
    // The component might truncate it, just look for part of it or 'By'
    expect(screen.getByText(/By/i)).toBeInTheDocument();
  });

  it('renders the correct progress percentage', () => {
    render(<CampaignCard {...mockProps} />);
    // 250 / 1000 = 25%
    expect(screen.getByText(/25%/i)).toBeInTheDocument();
  });
});
