import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import RouteNames from "../constants/RouteNames";

const NotFound404 = () => {
  return (
    <div>
      <Header />
      <main style={{ textAlign: "center", paddingTop: "3em" }}>
        <h1>404 PAGE NOT FOUND</h1>
        <Link to={RouteNames.home}>Go to Topics Page</Link>
      </main>
    </div>
  );
};

export default NotFound404;
