import { useLocation, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { HouseDoorFill, BellFill, ChatDotsFill, PersonFill, PlusSquare,BoxArrowRight,Search } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import { getProfileById } from '../Service/api';

const Sidebar = () => {
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const [profile, setProfile] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const profileRes = await getProfileById(userId);
      setProfile(profileRes);
     
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const navItems = [
    { name: 'Home', path: '/homepage', icon: <HouseDoorFill /> },
    { name: 'Search', path: '/search', icon: <Search /> },
    { name: 'Notifications', path: '/notifications', icon: <BellFill /> },
    { name: 'Messages', path: '/message', icon: <ChatDotsFill /> },
    { name: 'Create', path: '/create', icon: <PlusSquare /> },
    { 
      name: 'Profile', 
      path: `/profile/${userId}`, 
      icon: profile?.profilePic ? (
        <img
          src={profile.profilePic}
          alt="Profile"
          className="w-6 h-6 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <img 
          src={`https://ui-avatars.com/api/?name=${username || 'User'}&background=random`} 
          className="w-6 h-6 rounded-full" 
          alt="default"
        />
      )
    }
  ];
  const menuItem = [
    { name: 'Home', path: '/homepage', icon: <HouseDoorFill /> },
    { name: 'Search', path: '/search', icon: <Search /> },
    { name: 'Notifications', path: '/notifications', icon: <BellFill /> },
    { name: 'Create', path: '/create', icon: <PlusSquare /> },
    { 
      name: 'Profile', 
      path: `/profile/${username}`, 
      icon: profile?.profilePic ? (
        <img
          src={profile.profilePic}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <img 
          src={`https://ui-avatars.com/api/?name=${username || 'User'}&background=random`} 
          className="w-9 h-9 rounded-full" 
          alt="default"
        />
      )
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    setShowModal(false);
    navigate("/");
  };
 return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 p-6 z-20">
        {/* Logo & Greeting */}
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter italic mb-1">SweeTalk</h1>
          <p className="text-sm text-gray-400 font-medium">Welcome, <span className="text-gray-900">{profile?.firstname}</span> 👋</p>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="mb-6 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-2xl py-2.5 pl-10 pr-4 text-sm transition-all outline-none"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-semibold
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[15px]">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout at Bottom */}
        <div className="pt-6 border-t border-gray-50">
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all group"
          >
            <BoxArrowRight className="text-xl group-hover:scale-110 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-around p-3 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {menuItem.slice(0, 5).map((item) => ( 
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `text-2xl transition-transform active:scale-90 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>
    </>
  );

};


export default Sidebar;