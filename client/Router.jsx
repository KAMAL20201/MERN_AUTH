import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "./src/pages/About";
import PrivateRoute from "./src/components/PrivateRoute";
import Profile from "./src/pages/Profile";
import SignIn from "./src/pages/SignIn";
import SignUp from "./src/pages/SignUp";
import HomePage from "./src/views/HomePage/HomePage";
import Home from "./src/pages/Home";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage children={<Home />} />} />
      <Route path="/about" element={<HomePage children={<About />} />} />
      <Route
        path="/profile"
        element={<HomePage children={<PrivateRoute component={Profile} />} />}
      />
      <Route path="/sign-in" element={<HomePage children={<SignIn />} />} />
      <Route path="/sign-up" element={<HomePage children={<SignUp />} />} />
    </Routes>
  );
};

export default Router;
