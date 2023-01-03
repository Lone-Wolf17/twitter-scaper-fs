import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

interface LoadingIndicatorProps {
  size?: number | string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size,
}) => {
  return (
    <CircularProgress
      color="primary"
      size={size}
      data-testid={"loadingSpinner"}
    />
  );
};

export default LoadingIndicator;
