import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {Bell} from "lucide-react";
import '../theme.css'
import '../Navbar/Header.css'

const Header = () => {

    const navigate = useNavigate();
        const handleLogout = () => {
        const isLogout = window.confirm('Are you sure you want to logout this user?');
        if (isLogout) {
            navigate('/login');
        }
    };

  return (
    <>
     <nav className="gv-topbar">
         <div className="gv-login-brand">
          <span className="gv-mark" />
          GoldVault
        </div>
        <div className="gv-nav">
            <ul className="navbar-ul">
            <li><NavLink  to="/dashboard"  className={({ isActive }) => (isActive ? "active" : "")}>Dashboard</NavLink></li>
            <li><NavLink  to="/invest"  className={({ isActive }) => (isActive ? "active" : "")}>Invest</NavLink></li>
            <li><NavLink  to="/transaction"  className={({ isActive }) => (isActive ? "active" : "")}>Transactions</NavLink></li>
            
            </ul>
         </div>
         <div className="gv-topbar-right">
            <button className="logout-button" onClick={handleLogout}>Logout</button>

            <button className="gv-icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="gv-avatar">{'M'}</div>
         </div>
        </nav>
    </>
  )
}

export default Header