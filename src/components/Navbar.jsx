import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Home, ChevronRight } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar({ loggedInUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);

  const profileRef = useRef(null);
  const navbarRef = useRef(null);
  const location = useLocation();

  const navigationItems = {
    "High School": {
      Courses: [
        { name: "BBA/BMS", path: "/courses/bba&bms" },
        { name: "SAT", path: "/courses/sat" },
        { name: "LNAT", path: "/courses/lnat" },
        { name: "LSAT", path: "/courses/lsat" },
      ],
      "Mock Test": [
        { name: "NPAT", path: "/mock/npat" },
        { name: "AAT", path: "/mock/aat" },
        { name: "FEAT", path: "/mock/feat" },
        { name: "LSAT", path: "/mock/lsat" },
      ],
    },
    "Grad School": {
      Courses: [
        { name: "GMAT", path: "/courses/gmat" },
        { name: "GRE", path: "/courses/gre" },
      ],
      "Mock Test": [
        { name: "GMAT", path: "/mock/gmat" },
        { name: "GRE", path: "/mock/gre" },
      ],
    },
  };

  /* -------------------------------------------------- */
  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setProfileHovered(false);
  }, [location.pathname]);

  /* -------------------------------------------------- */
  // Outside click & Escape → close profile menu
  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  /* -------------------------------------------------- */
  // Reset dropdowns when mobile menu closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setActiveDropdown(null);
      setActiveSubmenu(null);
    }
  }, [mobileMenuOpen]);

  /* -------------------------------------------------- */
  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (key) => {
    setActiveSubmenu(activeSubmenu === key ? null : key);
  };

  /* -------------------------------------------------- */
  const NavDropdown = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200
            ${isOpen ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50 hover:text-blue-700"}
          `}
        >
          <span>{title}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-90 scale-110" : ""}`}
          />
        </div>

        {/* Dropdown */}
        <div
          className={`absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}
        >
          {Object.entries(items).map(([category, links]) => (
            <div key={category} className="relative group/submenu">
              <div
                className="w-full flex justify-between items-center px-4 py-3 text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 bg-gray-50"
              >
                <span>{category}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover/submenu:translate-x-1" />
              </div>
              <div className="absolute top-0 left-full ml-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MobileNavItem = ({ title, items }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => toggleDropdown(title)}
        className="flex justify-between items-center w-full py-4 px-4 text-left font-semibold text-gray-900 cursor-pointer"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            activeDropdown === title ? "rotate-180" : ""
          }`}
        />
      </button>

      {activeDropdown === title && (
        <div className="bg-gray-50">
          {Object.entries(items).map(([category, links]) => (
            <div key={category}>
              <button
                onClick={() => toggleSubmenu(`${title}-${category}`)}
                className="flex justify-between items-center w-full px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {category}
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    activeSubmenu === `${title}-${category}` ? "rotate-90" : ""
                  }`}
                />
              </button>

              {activeSubmenu === `${title}-${category}` && (
                <div className="bg-white border-l-4 border-blue-200">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-8 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const profileActive = profileMenuOpen || profileHovered;

  /* -------------------------------------------------- */
  return (
    <>
      {/* Navbar Header */}
      <nav ref={navbarRef} className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <img src={logo} alt="Company Logo" className="h-8 w-auto object-contain" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {Object.entries(navigationItems).map(([title, items]) => (
                <NavDropdown key={title} title={title} items={items} />
              ))}
              <Link
                to="/"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg font-semibold text-gray-700 hover:text-blue-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>HOME</span>
              </Link>
            </div>

            {/* Profile + Hamburger */}
            <div className="flex items-center space-x-4">
              {loggedInUser ? (
                <div
                  ref={profileRef}
                  className="relative md:group"
                  onMouseEnter={() => setProfileHovered(true)}
                  onMouseLeave={() => setProfileHovered(false)}
                >
                  <button
                    onClick={() => setProfileMenuOpen((p) => !p)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                      {loggedInUser?.firstname
                        ? loggedInUser.firstname.charAt(0).toUpperCase()
                        : loggedInUser?.email
                        ? loggedInUser.email.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform ${
                        profileActive ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-150 z-50
                      ${profileActive ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"}`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {loggedInUser.firstname + " " + loggedInUser.lastname}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{loggedInUser.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/activity"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Activity
                    </Link>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/"
                  className="hidden md:block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
                >
                  Log In
                </Link>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <>
        {/* Overlay (fade) */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer (slide) */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-[60] md:hidden transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="py-2 overflow-y-auto h-full pb-20">
            {Object.entries(navigationItems).map(([title, items]) => (
              <MobileNavItem key={title} title={title} items={items} />
            ))}
            <Link
              to="/"
              className="block py-4 px-4 font-semibold text-gray-900 border-b border-gray-200 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              HOME
            </Link>
            {!loggedInUser && (
              <Link
                to="/"
                className="block py-4 px-4 font-semibold text-blue-600 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </>
    </>
  );
}
