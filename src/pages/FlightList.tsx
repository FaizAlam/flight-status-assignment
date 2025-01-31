import { useEffect, useState } from "react";
import { fetchFlights } from "../api/flights";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import { format } from "date-fns";

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
}

const FlightList = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFlights = async () => {
      try {
        const data = await fetchFlights();
        setFlights(data);
      } catch (error) {
        console.error("Failed to fetch flights");
      }
    };

    loadFlights();
    const interval = setInterval(loadFlights, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDepartureTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {format(date, "h:mm a")}
        </span>
        <span className="text-sm text-gray-500">
          {format(date, "MMM d, yyyy")}
        </span>
      </div>
    );
  };

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-10 px-4 max-w-7xl"
    >
      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white rounded-t-xl px-8 py-8">
          <div className="flex items-center justify-center gap-3">
            <Plane className="h-9 w-9" />
            <CardTitle className="text-4xl font-bold tracking-tight">
              Real-Time Flight Status
            </CardTitle>
          </div>
          <p className="text-center text-blue-100 mt-3 font-medium tracking-wide">
            Live updates every 30 seconds
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/80">
                  <TableHead className="font-semibold text-gray-700 px-6 py-5 text-[0.925rem]">Flight Number</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-5 text-[0.925rem]">Airline</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-5 text-[0.925rem]">Origin</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-5 text-[0.925rem]">Destination</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-5 text-[0.925rem]">Departure Time</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-5 text-[0.925rem]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {flights?.map((flight) => (
                    <motion.tr
                      key={flight.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ 
                        backgroundColor: "rgba(249, 250, 251, 1)",
                        scale: 1.001,
                      }}
                      transition={{ duration: 0.2 }}
                      onClick={() => navigate(`/flight/${flight.id}`)}
                      className="cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-none hover:shadow-md group"
                    >
                      <TableCell className="font-semibold text-gray-900 px-6 py-5 tracking-wide">
                        {flight.flightNumber}
                      </TableCell>
                      <TableCell className="text-gray-600 px-6 py-5 group-hover:text-gray-900 transition-colors">
                        {flight.airline}
                      </TableCell>
                      <TableCell className="text-gray-600 px-6 py-5 group-hover:text-gray-900 transition-colors">
                        {flight.origin}
                      </TableCell>
                      <TableCell className="text-gray-600 px-6 py-5 group-hover:text-gray-900 transition-colors">
                        {flight.destination}
                      </TableCell>
                      <TableCell className="text-gray-600 px-6 py-5 group-hover:text-gray-900 transition-colors">
                        {formatDepartureTime(flight.departureTime)}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(flight.status)} px-4 py-1.5 rounded-full font-medium text-sm tracking-wide transition-transform group-hover:scale-105`}
                        >
                          {flight.status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FlightList;
