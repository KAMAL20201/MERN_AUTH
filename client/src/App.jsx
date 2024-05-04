import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import { useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "./redux/user/userSlice";

export default function App() {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const handleWindowLoad = useCallback(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const decoded = jwtDecode(response.credential);

        const { name, picture, email } = decoded;
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            photo: picture,
          }),
        });
        const data = await res.json();
        dispatch(signInSuccess(data));
      },
    });
    google.accounts.id.prompt();
  }, []);

  useEffect(() => {
    if (currentUser) return;
    console.log(currentUser);

    const timer = setTimeout(() => {
      handleWindowLoad();
    }, 1100);

    return () => clearTimeout(timer);
  }, [currentUser, handleWindowLoad]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<PrivateRoute component={Profile} />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
