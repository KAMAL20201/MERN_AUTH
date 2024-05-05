import React, { useEffect } from "react";
import Header from "../../components/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
const HomePage = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  function handleVerifyEmail() {
    toast.success("Email verified successfully");
    setSearchParams({});
  }

  useEffect(() => {
    const handleSignIn = () => {
      if (token && token !== "invalid_code_detected") {
        handleVerifyEmail();
      } else if (token === "invalid_code_detected") {
        toast.error(
          "Verification link expired, please resend verification email"
        );
        navigate("/sign-up");
      }
    };
    window.addEventListener("load", handleSignIn);

    return () => window.removeEventListener("load", handleSignIn);
  }, []);

  return (
    <div className="w-full h-full">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default HomePage;
