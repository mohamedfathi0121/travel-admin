import React, { useState } from "react";
import { FiSearch, FiMenu, FiX, FiUser } from "react-icons/fi";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const activeClassName = "text-button-primary ";
  // Assuming you have a useAuth hook to get user info

  return (
    <header className="w-full  bg-background shadow-md z-50 relative border-b border-gray-300">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        <h1 className="text-xl md:text-2xl font-bold text-text-primary whitespace-nowrap">
          AdventureCo
        </h1>
        <ul className="flex w-100 justify-start gap-4 hidden md:flex space-x-6 ml-6 text-sm font-medium text-text-primary">
          {user && (
            <>
              <li className="display flex items-center flex-column">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? activeClassName : "hover:text-button-primary"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="companies"
                  className={({ isActive }) =>
                    isActive ? activeClassName : "hover:text-button-primary"
                  }
                >
                  companies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="users"
                  className={({ isActive }) =>
                    isActive ? activeClassName : "hover:text-button-primary"
                  }
                >
                  customers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? activeClassName : "hover:text-button-primary"
                  }
                >
                  chats
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="hidden md:flex">
          {user && (
            <button
              onClick={() => {
                signOut();
              }}
              className="bg-button-primary hover:bg-button-primary-hover shadow-text-secondary hover:shadow-sm text-button-text font-bold py-2 px-4 rounded-full transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
        <div className="hidden md:flex">
          <ThemeSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? (
            <FiX className="w-6 h-6 text-text-primary" />
          ) : (
            <FiMenu className="w-6 h-6 text-text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="flex w-full justify-center ali md:hidden px-4 pb-4 flex flex-col space-y-3 text-sm font-medium text-text-primary">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeClassName : "hover:text-button-primary"
            }
          >
            Home
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/trips"
                className={({ isActive }) =>
                  isActive ? activeClassName : "hover:text-button-primary"
                }
              >
                My Trips
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? activeClassName : "hover:text-button-primary"
                }
              >
                Profile
              </NavLink>
            </>
          )}

          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? activeClassName : "hover:text-button-primary"
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? activeClassName : "hover:text-button-primary"
                }
              >
                Register
              </NavLink>
            </>
          )}

          <ThemeSwitcher />
          {user && (
            <button
              onClick={() => {
                signOut();
              }}
              className="bg-button-primary hover:bg-button-primary-hover shadow-text-secondary hover:shadow-sm text-button-text font-bold py-2 px-4 rounded-full transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
