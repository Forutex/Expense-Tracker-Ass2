import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const welcomeMessage =
  "Welcome to the Expense Tracker! Please log in or sign up to manage your expenses.";

function Login() {
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();

      localStorage.setItem("token", data.access_token);

      const decoded = jwtDecode(data.access_token);

      localStorage.setItem("user", JSON.stringify(decoded));

      console.log("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please check your details.");
    }
  };

  /* temporary login for testing
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (
      loginForm.email === "test@test.com" &&
      loginForm.password === "password123"
    ) {
      const fakeToken = "fake-jwt-token";
  
      localStorage.setItem("token", fakeToken);
  
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          username: "Test User",
          email: "test@test.com",
        })
      );
  
      navigate("/dashboard");
    } else {
      setErrorMessage("Invalid login");
    }
  };*/

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
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email"
                value={loginForm.email}
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

            {errorMessage && (
              <p className="error-message">
                {errorMessage}
              </p>
            )}

            <button type="submit">
              Log In
            </button>

            {errorMessage && (
              <p style={{ color: "red" }}>{errorMessage}</p>
            )}
          </form>

          <p>
            Don't have an account?{" "}
            <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;