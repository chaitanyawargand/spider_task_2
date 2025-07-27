import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUsers, FaUser } from "react-icons/fa";
import "./styles/navbar.css";
const BottomNav = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/signup"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;
  return (
    <div className="bottom-nav">
      <NavLink to="/groups" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
        <FaUsers />
        <span>Groups</span>
      </NavLink>
      <NavLink to="/friend" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
        <FaUser />
        <span>Friends</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
