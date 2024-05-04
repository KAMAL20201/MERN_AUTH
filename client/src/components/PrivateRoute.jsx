import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component }) => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Component /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
