import React from "react";
import { NavLink } from "react-router-dom";
import RoutesNames from "../constants/RouteNames";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <p className="logo">Twitter-Scraper</p>
      <nav>
        <NavLink
          to={RoutesNames.topicsPage}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Topics
        </NavLink>
        <NavLink
          to={RoutesNames.tweetsPage}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Tweets
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
