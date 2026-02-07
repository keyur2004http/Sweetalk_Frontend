// src/pages/MessagesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../FixedComponet/UserCard";
import { useNavigate } from "react-router-dom";
import { getChattedUsers } from "../Service/api";
import Sidebar from "../FixedComponet/Sidebar";
import { ChatDotsFill, Search, PencilSquare } from 'react-bootstrap-icons';
import MobileTopbar from "../FixedComponet/MobileTopbar";

const MessagesPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getChattedUsers(username);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [username]);

  const handleMessageClick = (user) => {
    navigate(`/chatDetailPage/${user.username}`, {
      state: { receiverId: user.userId },
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
     <MobileTopbar></MobileTopbar>
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 mt-20">
        <div className="max-w-3xl mx-auto">
          
          {/* Header Section */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                <ChatDotsFill className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-sm text-gray-500">Chat with your friends and connections</p>
              </div>
            </div>
            
            {/* Optional: Action button for new message */}
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
               <PencilSquare className="text-xl text-gray-700" />
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Active Conversations Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Recent Chats</h2>
                  <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {users.length}
                  </span>
                </div>
                
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {users.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {users.map(user => (
                        <div key={user.userId} className="p-2 hover:bg-gray-50 transition-colors">
                          <UserCard
                            user={user}
                            type="message" 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="mb-4 flex justify-center">
                         <ChatDotsFill className="text-gray-200 text-5xl" />
                      </div>
                      <p className="text-gray-400 italic text-sm">
                        No messages yet. Start a conversation!
                      </p>
                    </div>
                  )}
                </div>
              </section>

            </div>
          )}
        </div>
      </main>
    </div>
  );

}  

export default MessagesPage;
