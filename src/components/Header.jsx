
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = ({ onLogin, onSignup }) => {
  return (
    <header className="sticky top-0 w-full bg-gray-100 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>
        <div className="flex space-x-6">
          <button
            onClick={onSignup}
            className="hover:text-blue-700 transition"
          >
            SIGN UP
          </button>
          <button
            onClick={onLogin}
            className="hover:text-blue-700 transition"
          >
            LOG IN
          </button>
        </div>
      </div>
    </header>
  );
};


export default Header;
