
import './App.css';
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from './Pages/ProfilePage';

import EditPage from './Pages/EditPage';
import NotificationPage from './Pages/Notification';
import Search from './Componets/Search';
import Create from './Pages/Create';
import MessagesPage from './Pages/MessagesPage';
import ChatDetailPage from './Componets/ChatDetailPage';
import ConnectionPage from './Pages/ConnectionPage';
import nprogress from 'nprogress';


function App() {
  
nprogress.configure({ 
  showSpinner: false,     // Disable the spinning wheel
  speed: 500,             // Animation speed in ms
  minimum: 0.2,           // Minimum percentage to start at
  trickleSpeed: 200,      // How often to trickle progress
  easing: 'ease',         // CSS easing string
});
   nprogress.start();
  nprogress.done();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/create" element={<Create />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/editPage" element={<EditPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/search" element={<Search />} />
      <Route path="/message" element={<MessagesPage />} />
      <Route path="/chatDetailPage/:receiver" element={<ChatDetailPage />} />
      <Route path="/profile/:userId/followers" element={<ConnectionPage />} />
      <Route path="/profile/:userId/following" element={<ConnectionPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
    </Routes>

  );
}

export default App;
