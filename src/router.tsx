import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlightList from "./pages/FlightList";
import FlightDetail from "./pages/FlightDetail";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlightList />} />
        <Route path="/flight/:id" element={<FlightDetail />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
