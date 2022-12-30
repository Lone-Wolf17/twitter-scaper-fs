import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

interface LoadingIndicatorProps {
  isLoading: boolean;
  size?: number | string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
  size,
}) => {
  return <>{isLoading && <CircularProgress color="primary" size={size} />}</>;
};

export default LoadingIndicator;
