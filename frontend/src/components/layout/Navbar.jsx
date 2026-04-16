import { LogIn, LogOut, Menu, UserPlus } from "lucide-react";
import { useState } from "react";
import { FaPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ currentPage }) => {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // console.log("Navbar user:", user);

  const handleLinkClick = (page) => {
    navigate(`/${page}`);
    setIsMenuOpen(false);
  };

  const NavLink = ({
    to,
    children,
    icon: Icon,
    isButton = false,
    isPrimary = false,
    onClick,
  }) => {
    const activeClass =
      currentPage === to
        ? "text-blue-600 font-bold"
        : "text-gray-600 hover:text-blue-600 font-medium";

    if (isButton) {
      const baseClasses =
        "flex items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition duration-150 transform hover:scale-105";
      const buttonClasses = isPrimary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-orange-500 text-white hover:bg-orange-600";

      return (
        <div
          onClick={onClick ? onClick : () => handleLinkClick(to)}
          className={`${baseClasses} ${buttonClasses} cursor-pointer`}
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span>{children}</span>
        </div>
      );
    }

    return (
      <div
        onClick={() => handleLinkClick(to)}
        className={`${activeClass} cursor-pointer p-2 md:p-0 flex items-center gap-2 hover:bg-gray-100 md:hover:bg-transparent rounded-lg`}
      >
        {Icon && <Icon className="h-4 w-4 md:hidden" />}
        {children}
      </div>
    );
  };

  // 🔄 Avoid flicker while auth loads
  if (isLoading) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md">
              <FaPlane className="h-6 w-6 text-white" />
            </div>
            <span className="text-[28px] font-bold text-black">
              Travel Planner
            </span>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-gray-100"
            aria-label="Toggle Menu"
          >
            <Menu className="h-7 w-7 cursor-pointer " />
          </button>

          {/* MENU */}
          <div
            className={`
              ${isMenuOpen ? "block" : "hidden"}
              absolute left-0 top-16 w-full bg-white shadow-xl p-6 space-y-4 rounded-b-xl
              md:static md:p-0 md:shadow-none md:bg-transparent
              md:flex md:space-y-0 md:items-center md:justify-end md:w-auto md:gap-8
            `}
          >
            {/* NAV LINKS */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 text-sm">
              <NavLink to="">Home</NavLink>

              {/* 🔐 Only when logged in */}
        

              <NavLink to="about">About</NavLink>
              <NavLink to="contact">Contact</NavLink>
            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div className="flex flex-col  space-y-3 md:flex-row md:space-y-0 md:space-x-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
              {/* ❌ Not logged in */}
              
                <>
                  <NavLink to="auth" icon={LogIn} isButton isPrimary>
                    Sign In
                  </NavLink>

                  <NavLink to="auth?mode=signup" icon={UserPlus} isButton>
                    Get Started
                  </NavLink>
                </>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
