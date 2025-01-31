import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import FlightList from '../pages/FlightList';
import { fetchFlights } from '../api/flights';

// Mock the flight API
vi.mock('../api/flights', () => ({
  fetchFlights: vi.fn()
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockFlights = [
  {
    id: '1',
    flightNumber: 'AA123',
    airline: 'American Airlines',
    origin: 'NYC',
    destination: 'LAX',
    departureTime: '2025-02-01T12:45:00',
    status: 'on time',
  },
  {
    id: '2',
    flightNumber: 'DL456',
    airline: 'Delta Airlines',
    origin: 'DLH',
    destination: 'SFO',
    departureTime: '2025-02-01T17:45:00Z',
    status: 'delayed',
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FlightList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<FlightList />, { wrapper });
    
    expect(screen.getByText('Real-Time Flight Status')).toBeInTheDocument();
    expect(screen.getByText('Live updates every 30 seconds')).toBeInTheDocument();
    expect(screen.getByText('Flight Number')).toBeInTheDocument();
  });

  it('fetches and displays flights', async () => {
    (fetchFlights as any).mockResolvedValueOnce(mockFlights);

    render(<FlightList />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('AA123')).toBeInTheDocument();
      expect(screen.getByText('Delta Airlines')).toBeInTheDocument();
      expect(screen.getByText('LAX')).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(fetchFlights).toHaveBeenCalledTimes(1);
  });

  it('handles API error gracefully', async () => {
    (fetchFlights as any).mockRejectedValueOnce(new Error('API Error'));

    render(<FlightList />, { wrapper });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to fetch flights');
    }, { timeout: 2000 });
  });

  it('renders correct badge colors for status', async () => {
    (fetchFlights as any).mockResolvedValueOnce(mockFlights);

    render(<FlightList />, { wrapper });

    await waitFor(() => {
      // Find the badge elements by role and text
      const onTimeBadge = screen.getByText('on time').closest('.bg-gradient-to-r');
      const delayedBadge = screen.getByText('delayed').closest('.bg-gradient-to-r');
      
      expect(onTimeBadge).toBeInTheDocument();
      expect(delayedBadge).toBeInTheDocument();
      
      // Check if the badges have the correct color classes
      expect(onTimeBadge).toHaveClass('from-emerald-500', { exact: false });
      expect(delayedBadge).toHaveClass('from-amber-500', { exact: false });
    }, { timeout: 2000 });
  });


  it('navigates to flight details on row click', async () => {
    const user = userEvent.setup();
    (fetchFlights as any).mockResolvedValueOnce([mockFlights[0]]);

    render(<FlightList />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('AA123')).toBeInTheDocument();
    }, { timeout: 2000 });

    const row = screen.getByText('AA123').closest('tr');
    expect(row).toBeInTheDocument();
    
    await user.click(row!);
    expect(mockNavigate).toHaveBeenCalledWith('/flight/1');
  });

});
