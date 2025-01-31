# ✈️ Real-Time Flight Status Board

A **React** web application that displays real-time flight status updates. The application fetches flight data from an API, updates at regular intervals, and allows users to view detailed flight information.

## 🚀 Features

- **Real-Time Flight Data**: Fetches and updates flight information every 30 seconds.
- **Flight List Table**: Displays a list of flights with details such as Flight Number, Airline, Origin, Destination, Departure Time, and Status.
- **Flight Detail View**: Provides additional details about a specific flight when clicked.
- **Smooth Navigation**: Uses `react-router-dom` for seamless transitions between pages.
- **Enhanced UI**: Built with **ShadCN components**, **Framer Motion animations**, and **Lucide icons** for a modern and responsive design.
- **Error Handling**: Displays appropriate messages when data fetching fails.
- **Unit Tests**: Includes tests using **Vitest** and **React Testing Library**.

---

## 📌 Tech Stack

- **Frontend**: React (Vite) + TypeScript
- **UI Components**: ShadCN + TailwindCSS
- **Animations**: Framer Motion
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Routing**: React Router
- **HTTP Requests**: Axios
- **Testing**: Vitest + React Testing Library

---

## 🛠️ Setup & Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/FaizAlam/flight-status-assignment.git
cd flight-status
```

### **2️⃣ Install Dependencies**
```sh
npm install
```


### **4️⃣ Start the Development Server**
```sh
npm run dev
```
Your app should now be running on `http://localhost:5173/`.

---

## 🧪 Running Tests

### **2️⃣ Run Tests**
```sh
npm test
```
To run tests in watch mode:
```sh
npm test --watch
```

---

## 📂 Project Structure
```
flight-status-board/
│── src/
│   ├── api/             # API functions (fetchFlights, fetchFlightDetails)
│   ├── components/      # UI Components (ShadCN components)
│   ├── pages/           # Page Components (FlightList, FlightDetail)
│   ├── tests/           # Unit Tests
│   ├── router.tsx       # Application Routes
│   ├── App.tsx          # Root Component
│   ├── main.tsx         # Entry Point
│── public/
│── package.json        # Project Configuration
│── tailwind.config.js  # Tailwind Configuration
│── README.md           # Project Documentation
```

---

## 📜 API Endpoints
The application fetches data from the following API:

- **Get all flights:** `GET https://flight-status-mock.core.travelopia.cloud/flights`
- **Get flight details:** `GET https://flight-status-mock.core.travelopia.cloud/flights/:id`

Example Response:
```json
[
  {
    "id": "1",
    "flightNumber": "AA101",
    "airline": "American Airlines",
    "origin": "JFK",
    "destination": "LAX",
    "departureTime": "2025-01-30T14:00:00Z",
    "status": "On Time"
  }
]
```
---

## 📌 Future Enhancements
- ⏳ **Add Filtering & Sorting for Flights**
- ⏳ **Implement Dark Mode**
- ⏳ **Progressive Web App (PWA) Support**

---