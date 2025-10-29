import React from "react";
import { useGetProfileQuery } from "../modules/Profile/api/profileEndpoint";
import { Navigate, useLocation } from "react-router-dom";
import useAuthChecked from "../hooks/useAuthChecked";
import Loader from "../common/Loader/Loader";

interface Props {
  children: React.ReactNode;
}

const PrivateRouter: React.FC<Props> = ({ children }) => {
  useAuthChecked();
  const location = useLocation();
  const { data, isLoading, isSuccess } = useGetProfileQuery();

  if (isLoading) {
    return <Loader />;
  } else if (isSuccess) {
    return children;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default PrivateRouter;
