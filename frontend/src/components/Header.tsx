import React from "react";
import { NavLink, Link } from "react-router-dom";
import RoutesNames from "../constants/RouteNames";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <Link to={RoutesNames.home}>
        <p className="logo">Twitter-Scraper</p>
      </Link>
      <nav>
        {/* <NavLink
          to={RoutesNames.topicsPage}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Topics
        </NavLink> */}
        <NavLink
          to={RoutesNames.bookmarkedTweetsPage}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Bookmarked Tweets
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
