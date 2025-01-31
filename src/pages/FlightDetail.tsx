import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFlightDetails } from "../api/flights";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowLeft, Plane, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface FlightDetails {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
}

const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<FlightDetails | null>(null);
  const [error, setError] = useState(false);


  useEffect(() => {
    const loadFlightDetails = async () => {
      try {
        const data = await fetchFlightDetails(id!);
        setFlight(data);
      } catch (error) {
        console.error("Failed to fetch flight details");
        setError(true);
      }
    };

    loadFlightDetails();
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="w-full max-w-2xl border-none shadow-lg bg-white/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <p className="text-red-600 font-semibold">Failed to load flight details.</p>
            <Button className="mt-4" onClick={() => navigate("/")}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDepartureTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      time: format(date, "h:mm a"),
      date: format(date, "MMMM d, yyyy")
    };
  };

  if (!flight) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="w-full max-w-2xl border-none shadow-lg bg-white/50 backdrop-blur-sm">
          <CardContent className="p-12 flex justify-center">
            <div role="status" className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on time":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-200";
      case "delayed":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm shadow-amber-200";
      case "cancelled":
        return "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-200";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-200";
    }
  };

  const departureTimeFormatted = formatDepartureTime(flight.departureTime);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-10 px-4"
    >
      <Button
        variant="ghost"
        className="mb-6 hover:bg-gray-100 transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="font-medium">Back to Flights</span>
      </Button>
      
      <Card className="w-full max-w-2xl mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white rounded-t-xl px-8 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="h-8 w-8" />
            <CardTitle className="text-3xl font-bold tracking-tight">Flight Details</CardTitle>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(flight.status)} px-4 py-2 rounded-full font-medium text-sm tracking-wide mx-auto`}
          >
            {flight.status}
          </Badge>
        </CardHeader>
        <CardContent className="p-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 tracking-wide">Flight Number</h3>
              <p className="text-xl font-semibold text-gray-900 tracking-wide">{flight.flightNumber}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 tracking-wide">Airline</h3>
              <p className="text-xl font-semibold text-gray-900 tracking-wide">{flight.airline}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 tracking-wide">Origin</h3>
              <p className="text-xl font-semibold text-gray-900 tracking-wide">{flight.origin}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 tracking-wide">Destination</h3>
              <p className="text-xl font-semibold text-gray-900 tracking-wide">{flight.destination}</p>
            </div>
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-500 tracking-wide">Departure Time</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <p className="text-xl font-semibold text-gray-900 tracking-wide">
                    {departureTimeFormatted.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <p className="text-xl font-semibold text-gray-900 tracking-wide">
                    {departureTimeFormatted.date}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FlightDetail;
