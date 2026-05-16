import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const welcomeMessage = "Welcome to the Expense Tracker! Please log in or sign up to manage your expenses.";

function Login() {
  const navigate = useNavigate();
  const handleLogin = () => {
    // Simulate login logic here (e.g., API call)
    // For demonstration, we'll just navigate to the dashboard
    navigate("/dashboard");
  };

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <><div className="app">
      <h1>Expense Tracker</h1>
      {welcomeMessage}
    </div><div className="login-container">
      <h2>Login</h2>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button className="login-action" onClick={handleLogin}>
        Log In
      </button>
      <p>Don't have an account? <a href="#">Sign up</a></p>
      </div></>
  );
}

export default Login;