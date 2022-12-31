import React from "react";
import { NavLink, Link } from "react-router-dom";
import RoutesPaths from "../constants/RoutePaths";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <Link to={RoutesPaths.home}>
        <p className="logo">Twitter-Scraper</p>
      </Link>
      <nav>
        <NavLink
          to={RoutesPaths.bookmarkedTweetsPage}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Bookmarked Tweets
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
