import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
  FaHeart,
  FaSignOutAlt,
  FaSignInAlt,
  FaTools,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const UtilityIconLink = ({ to, icon: Icon, label, badge }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-indigo-600 transition-colors p-2 relative"
    aria-label={label}
  >
    <Icon className="w-5 h-5" />
    {badge > 0 && (
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-700 font-medium hover:text-indigo-600 transition-colors px-3 py-2 border-b-2 border-transparent hover:border-indigo-600"
      onClick={() => setMenuOpen(false)} // close mobile menu after clicking
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Brand */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-3xl font-extrabold text-gray-900 tracking-wider"
          >
            <span className="text-indigo-600">AURA</span>
            <span className="text-gray-900">.</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/order-history">Orders</NavLink>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <UtilityIconLink icon={FaSearch} label="Search" />

          {user ? (
            <>
              {user.role === "admin" && (
                <UtilityIconLink to="/admin" icon={FaTools} label="Admin" />
              )}

              {/* Profile Dropdown */}
              <div className="group relative cursor-pointer">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-indigo-500 object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-600" />
                  )}
                </div>

                <div className="absolute right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 hidden group-hover:block transition-all duration-300 z-10">
                  <span className="block px-4 py-2 text-sm text-gray-800 font-semibold truncate">
                    Hi, {user.displayName || "User"}
                  </span>
                  <hr className="my-1" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              aria-label="Login with Google"
            >
              <FaSignInAlt /> Login
            </button>
          )}

          <UtilityIconLink to="/wishlist" icon={FaHeart} label="Wishlist" />
          <UtilityIconLink
            to="/cart"
            icon={FaShoppingCart}
            label="Cart"
            badge={cartCount}
          />

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md flex flex-col items-start px-6 py-4 space-y-3">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/order-history">Orders</NavLink>
        </div>
      )}
    </nav>
  );
}
