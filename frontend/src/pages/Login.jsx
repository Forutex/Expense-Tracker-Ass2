import { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
=======
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  const handleLogin = (e) => {
=======
  const handleLogin = async (e) => {
    
>>>>>>> Stashed changes
    e.preventDefault();

    // Simulated login
    console.log(loginForm);

<<<<<<< Updated upstream
    navigate("/dashboard");
=======
      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();

      // save JWT token
      localStorage.setItem("token", data.access_token);

      // decodes user info from token
      const decoded = jwtDecode(data.access_token);

      // stores user info 
      localStorage.setItem("user", JSON.stringify(decoded));

      console.log("Login successful");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please check your details.");
    }
>>>>>>> Stashed changes
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