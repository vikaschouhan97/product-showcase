import { useEffect, useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import Drawer from "./drawer";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [openRight, setOpenRight] = useState<boolean>(false);
  const navigate = useNavigate();

  const updateCartCount = () => {
    console.log("here");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  return (
    <>
      <header className="bg-blue-400 shadow top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          {/* Logo and Brand Name */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <img
              src="/logo.svg" // replace with your logo path
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="font-bold text-xl bg-blue-400 p-1 rounded-md text-white">
              PShowcase
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a
              onClick={() => setMenuOpen(!menuOpen)}
              href="#contact"
              className="!text-white hover:!text-indigo-100 transition"
            >
              Contact Us
            </a>
            <a
              onClick={() => setMenuOpen(!menuOpen)}
              href="#services"
              className="!text-white hover:!text-indigo-100 transition"
            >
              Services
            </a>
            <a
              onClick={() => setMenuOpen(!menuOpen)}
              href="#careers"
              className="!text-white hover:!text-indigo-100 transition"
            >
              Careers
            </a>
            <a
              className="!text-white  hover:!text-indigo-100 transition flex gap-2 relative cursor-pointer"
              onClick={() => setOpenRight((prev) => !prev)}
            >
              Cart <ShoppingCart size={24} />
              <span className="absolute -right-2 top-0 bg-red-500 rounded-xl p-1 px-2 text-[8px]">
                {cartCount}
              </span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none !bg-white"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="flex flex-col px-4 pb-4 space-y-2 text-gray-700 font-medium justify-center items-center">
            <a
              onClick={() => setMenuOpen(!menuOpen)}
              href="#contact"
              className="!text-white hover:text-white"
            >
              Contact Us
            </a>
            <a
              onClick={() => setMenuOpen(!menuOpen)}
              href="#"
              className="!text-white hover:text-white-"
            >
              Services
            </a>
            <a
              onClick={() => setMenuOpen(!menuOpen)}
              href="#"
              className="!text-white hover:text-white-"
            >
              Careers
            </a>
            <a
              href="#"
              className="!text-white transition flex gap-2 relative"
              onClick={() => setOpenRight((prev) => !prev)}
            >
              Cart <ShoppingCart size={24} />
              <span className="absolute -right-2 top-0 bg-red-500 rounded-xl p-1 px-2 text-[8px]">
                {cartCount}
              </span>
            </a>
          </div>
        </div>
      </header>
      <Drawer open={openRight} side="right" setOpen={setOpenRight} />
    </>
  );
};

export default Navbar;
