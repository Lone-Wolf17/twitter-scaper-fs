import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import RoutePaths from "../constants/RoutePaths";

const NotFound404 = () => {
  return (
    <div>
      <Header />
      <main style={{ textAlign: "center", paddingTop: "3em" }}>
        <h1>404 PAGE NOT FOUND</h1>
        <Link to={RoutePaths.home}>Go to Topics Page</Link>
      </main>
    </div>
  );
};

export default NotFound404;
