import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupForm),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      console.log("Account created");

      // redirect to login page
      navigate("/");

    } catch (error) {
      console.error(error);
      setErrorMessage("Could not create account.");
    }
  };

  return (
    <div className="app">
      <div className="login-container">
        <div className="login">
          <header>
            <h1>Create Account</h1>
          </header>

          <form className="loginform" onSubmit={handleSignup}>

            <div className="input-group">
              <label>Username</label>

              <input
                type="text"
                name="username"
                value={signupForm.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={signupForm.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={signupForm.password}
                onChange={handleInputChange}
              />
            </div>

            {errorMessage && (
              <p>{errorMessage}</p>
            )}

            <button type="submit">
              Sign Up
            </button>

             <p>
              Already have an account?{" "}
              <a href="/">Log in</a>
             </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;