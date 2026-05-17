import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ExpenseTracker from "./pages/Dashboard";
<<<<<<< Updated upstream
=======
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
<<<<<<< Updated upstream
        <Route path="/dashboard" element={<ExpenseTracker />} />
=======
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ExpenseTracker />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;