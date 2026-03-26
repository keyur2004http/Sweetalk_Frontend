import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import { getChatHistory, getChattedUsers } from '../Service/api';
import Sidebar from '../FixedComponet/Sidebar';
import { SendFill, CircleFill } from 'react-bootstrap-icons';
import { Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';


let stompClient = null;

const ChatDetailPage = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null); 
  const currentUser = localStorage.getItem("username");
  const { receiver } = useParams();
  const [recentChats, setRecentChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const activeChatUser = recentChats?.find(u => u.username === receiver) || null;
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getChattedUsers(currentUser);
        setRecentChats(data);
      } catch (err) { console.error(err); }
    };
    fetchRecent();
  }, [currentUser])

  const filteredChats = recentChats.filter(chat =>
    chat.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const socket = new SockJS('https://sweetalk-backend.onrender.com');
    const token = localStorage.getItem('token');
    stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        stompClient.subscribe('/user/queue/messages', (msg) => {
          const received = JSON.parse(msg.body);
          stompClient.subscribe('/topic/online-users', (msg) => {
            const statusUpdate = JSON.parse(msg.body);
            setOnlineUsers((prev) => {
              const newSet = new Set(prev);
              if (statusUpdate.online) {
                newSet.add(statusUpdate.username);
              } else {
                newSet.delete(statusUpdate.username);
              }
              return newSet;
            });
          });
          if (received.sender === receiver || received.sender === currentUser) {
            setChat((prev) => [...prev, received]);
          }
        });
        setError(null);
      },
      onStompError: () => setError('Chat service unavailable.'),
    });
    stompClient.activate();
    return () => stompClient?.deactivate();
  }, [receiver]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await getChatHistory(currentUser, receiver);
        setChat(data);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };
    if (receiver && currentUser) fetchChatHistory();
  }, [receiver, currentUser]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);
  const sendMessage = () => {
    if (message.trim() === '' || !stompClient?.connected) return;

    const msg = {
      sender: currentUser,
      receiver: receiver,
      content: message,
      timestamp: new Date().toISOString()
    };

    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(msg),
    });

    setChat((prev) => [...prev, msg]);
    setMessage('');
  };
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
     <div className="hidden lg:block">
 < Sidebar/>
</div>

      <main className="flex-1 flex flex-col lg:ml-64 bg-white border-r border-gray-100 relative">
        <header className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={activeChatUser?.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-blue-50" />
              {onlineUsers.has("rr") && (
                <CircleFill className="absolute bottom-0 right-0 text-green-500 border-2 border-white text-[10px]" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">@{receiver}</h2>
              {onlineUsers.has(receiver) ? (
                <p className="text-xs text-green-500 font-medium">Online</p>
              ) : (
                <p className="text-xs text-gray-400 font-medium">Offline</p>
              )}
            </div>
          </div>
        </header>

        <div
  ref={scrollRef}
  className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f0f2f5] scroll-smooth pb-24"
>

          {chat.map((msg, idx) => {
            const isMe = msg.sender === currentUser;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${isMe
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                  }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-100 p-4 z-20">

          <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 border border-transparent focus-within:border-blue-200">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Write a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-1 text-gray-700"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              <SendFill className="text-lg" />
            </button>
          </div>
        </footer>
      </main>
      <aside className="hidden xl:flex w-80 flex-col bg-white border-l border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Chats</h3>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map((chatUser) => (
              <div
                key={chatUser.userId}
                onClick={() => navigate(`/chatDetailPage/${chatUser.username}`)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${receiver === chatUser.username ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
              >
                <img
                  src={`${chatUser.profilePic}`}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 truncate">@{chatUser.username}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chatUser.lastMessage || "Click to chat"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 italic text-sm">
              No chats found
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ChatDetailPage;