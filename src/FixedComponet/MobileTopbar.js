import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegPaperPlane, FaBars, FaSignOutAlt, FaTrashAlt } from "react-icons/fa";
import { deleteUserAccount } from "../Service/api"; // Ensure this path is correct

const MobileTopbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const userName = localStorage.getItem("username");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDelete = async () => {
    if (window.confirm("Permanent delete? All posts and chats will be gone.")) {
      try {
        await deleteUserAccount(userName);
        navigate("/");
      } catch (err) {
        alert("Action failed.");
      }
    }
  };

  return (
    <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-white border-b shadow-sm">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left: Menu Icon */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-700 p-1 active:scale-90 transition"
          >
            <FaBars size={20} />
          </button>

          {/* Small Dropdown Menu */}
          {showMenu && (
            <div className="absolute left-0 mt-3 w-48 bg-white border rounded-lg shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              >
                <FaSignOutAlt className="text-gray-500" /> Logout
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 border-t"
              >
                <FaTrashAlt /> Delete Account
              </button>
            </div>
          )}
        </div>

        {/* Center: Logo */}
        <h1 className="text-2xl font-extrabold text-blue-600 tracking-tighter italic">
          SweeTalk
        </h1>

        {/* Right: Message Icon */}
        <button
          onClick={() => navigate("/message")}
          className="text-gray-700 hover:text-black active:scale-95 transition"
        >
          <FaRegPaperPlane size={20} />
        </button>
      </div>
    </header>
  );
};

export default MobileTopbar;