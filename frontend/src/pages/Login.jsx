import { useState } from "react";
import { useNavigate } from "react-router-dom";

const welcomeMessage =
  "Welcome to the Expense Tracker! Please log in or sign up to manage your expenses.";

function Login() {
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulated login
    console.log(loginForm);

    navigate("/dashboard");
  };

  return (
    <div className="app">
      <div className="login-container">
        <div className="login">
          <header>
            <h1>Expense Tracker</h1>
            <p>{welcomeMessage}</p>
          </header>

          <form className="loginform" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter username"
                value={loginForm.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit">
              Log In
            </button>
          </form>

          <p>
            Don't have an account?{" "}
            <a href="#">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;