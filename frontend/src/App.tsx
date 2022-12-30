import React from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/system";
import { ToastContainer } from "react-toastify";

import "./styles/App.css";
import TopicsPage from "./pages/TopicsPage";
import TweetsPage from "./pages/TweetsPage";
import RoutesNames from "./constants/RouteNames";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#1D98F0",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      {/* Pop Up Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={true}
        closeOnClick={true}
      />
      <BrowserRouter>
        <Routes>
          <Route path={RoutesNames.home} element={<TopicsPage />} />
          <Route path={RoutesNames.topicsPage} element={<TopicsPage />} />
          <Route path={RoutesNames.tweetsPage} element={<TweetsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
