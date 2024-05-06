import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import toast from "react-hot-toast";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [validationError, setValidationError] = useState({
    username: false,
    email: false,
    password: false,
  });

  const isValidEmailChecker = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Check if password length is at least 8 characters
    if (password?.length < 8) return false;

    // Check if password contains at least 1 uppercase letter
    if (!/[A-Z]/.test(password)) return false;

    // Check if password contains at least 1 lowercase letter
    if (!/[a-z]/.test(password)) return false;

    // Check if password contains at least 1 number
    if (!/\d/.test(password)) return false;

    // Check if password contains at least 1 symbol
    if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) return false;

    return true;
  };

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;
    if (
      !validatePassword(formData.password) ||
      !isValidEmailChecker(formData.email) ||
      formData?.username?.trim().length === 0
    ) {
      setValidationError({
        ...validationError,
        password: !validatePassword(formData.password),
        email: !isValidEmailChecker(formData.email),
        username: formData.username.trim().length === 0,
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(false);

      const response = await fetch("http://localhost:5173/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        if (data.code === "EMAIL_ALREADY_EXISTS") {
          toast.error("Email already exists");
        }
        if (data.code === "USERNAME_ALREADY_EXISTS") {
          toast.error("Username already exists");
        }
        return;
      }
      // navigate("/sign-in", { state: { email: formData.email } });
      toast.success("Verification link sent");
    } catch (error) {
      setError(true);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl  text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="bg-slate-100 p-3 rounded-lg w-full"
            onChange={(e) => {
              handleChange(e);
              setValidationError({
                ...validationError,
                username: formData.username.trim().length === 0,
              });
            }}
            value={formData.username}
          />
          {validationError.username && (
            <p className="text-red-700 mb-2 text-sm ">Username is required</p>
          )}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-100 p-3 rounded-lg w-full"
            onChange={(e) => {
              handleChange(e);

              setValidationError({
                ...validationError,
                email: !isValidEmailChecker(e.target.value),
              });
            }}
            value={formData.email}
          />
          {validationError.email && (
            <p className="text-red-700 mb-2 text-sm">
              Please enter a valid email address
            </p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-slate-100 p-3 rounded-lg w-full"
            onChange={(e) => {
              handleChange(e);
              setValidationError({
                ...validationError,
                password: !validatePassword(e.target.value),
              });
            }}
            value={formData.password}
          />
          {validationError.password && (
            <p className="text-red-700 mb-2 text-sm ">
              Password must be at least 8 characters long and contain at least 1
              uppercase letter, 1 lowercase letter, 1 number, and 1 symbol
            </p>
          )}
        </div>

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-80">
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500 ">Sign in</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong"}</p>
    </div>
  );
}
