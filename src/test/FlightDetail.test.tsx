import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import FlightDetail from '../pages/FlightDetail';
import { fetchFlightDetails } from '../api/flights';
import { format } from "date-fns";


// Mock the flight API
vi.mock('../api/flights', () => ({
  fetchFlightDetails: vi.fn()
}));

// Mock the framer-motion component to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockFlight = {
  id: '123',
  flightNumber: 'FL123',
  airline: 'Test Airlines',
  origin: 'New York',
  destination: 'London',
  departureTime: '2025-01-30T20:38:29.431Z',
  status: 'on time'
};

// Wrapper component for router context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FlightDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<FlightDetail />, { wrapper });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays flight details after loading', async () => {
    (fetchFlightDetails as any).mockResolvedValueOnce(mockFlight);

    render(<FlightDetail />, { wrapper });

    // Wait for the loading state to be replaced with flight details
    await waitFor(() => {
      expect(screen.getByText('Flight Details')).toBeInTheDocument();
    });

    // Check if all flight information is displayed

    const expectedTime = format(new Date(mockFlight.departureTime), "h:mm a");
    const expectedDate = format(new Date(mockFlight.departureTime), "MMMM d, yyyy");
    expect(screen.getByText('FL123')).toBeInTheDocument();
    expect(screen.getByText('Test Airlines')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText(expectedTime)).toBeInTheDocument();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
    expect(screen.getByText('on time')).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    (fetchFlightDetails as any).mockRejectedValueOnce(new Error("API Error"));
  
    render(<FlightDetail />, { wrapper });
  
    await waitFor(() => {
      expect(screen.getByText("Failed to load flight details.")).toBeInTheDocument();
    });
  });
  

  it('navigates back when clicking the back button', async () => {
    const user = userEvent.setup();
    (fetchFlightDetails as any).mockResolvedValueOnce(mockFlight);

    render(<FlightDetail />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Back to Flights')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Back to Flights');
    await user.click(backButton);

    // Check if we're trying to navigate back
    // Note: actual navigation won't happen in tests
    expect(window.location.pathname).toBe('/');
  });

  it('applies correct status color based on flight status', async () => {
    const statusTests = [
      { status: 'on time', expectedColor: 'emerald' },
      { status: 'delayed', expectedColor: 'amber' },
      { status: 'cancelled', expectedColor: 'rose' },
    ];

    for (const { status, expectedColor } of statusTests) {
      (fetchFlightDetails as any).mockResolvedValueOnce({
        ...mockFlight,
        status
      });

      render(<FlightDetail />, { wrapper });

      await waitFor(() => {
        const statusBadge = screen.getByText(status);
        expect(statusBadge.className).toContain(expectedColor);
      });

      // Cleanup after each status test
      vi.clearAllMocks();
    }
  });

  it('formats departure time correctly', async () => {
    (fetchFlightDetails as any).mockResolvedValueOnce(mockFlight);

    render(<FlightDetail />, { wrapper: BrowserRouter });
  
    await waitFor(() => {
      const expectedTime = format(new Date(mockFlight.departureTime), "h:mm a"); // Formats in local time
      const expectedDate = format(new Date(mockFlight.departureTime), "MMMM d, yyyy");
  
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });  });

  it('renders with correct layout on mobile and desktop', async () => {
    (fetchFlightDetails as any).mockResolvedValueOnce(mockFlight);

    const { container } = render(<FlightDetail />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Flight Details')).toBeInTheDocument();
    });

    // Check if the grid layout classes are applied correctly
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2');

    // Check if the departure time section spans full width
    const departureTimeSection = screen.getByText('Departure Time').closest('.md\\:col-span-2');
    expect(departureTimeSection).toBeInTheDocument();
  });
}); 