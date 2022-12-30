import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  return <>{isLoading && <CircularProgress color="primary" />}</>;
};

export default LoadingIndicator;
