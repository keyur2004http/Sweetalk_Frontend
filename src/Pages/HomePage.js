import React, { useState, useEffect } from 'react';
import PostList from '../Componets/PostList';
import Sidebar from '../FixedComponet/Sidebar';
import { getRandomSuggestions, homepage, getProfileById } from '../Service/api';
import SuggestionBar from '../Componets/Suggestionbar';
import MobileTopbar from '../FixedComponet/MobileTopbar';

function HomePage() {
  
  const [suggestions, setSuggestions] = useState([]);
  const [miniSearch, setMiniSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        const [postRes, profileRes, suggestRes] = await Promise.all([
          homepage(username).catch(() => []),

          getProfileById(userId).catch(() => ({})),
          getRandomSuggestions().catch(() => [])
        ]);
        setSuggestions(suggestRes);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (miniSearch.trim() === '') {
     
    } else {
      const lowerCaseSearch = miniSearch.toLowerCase();
      const filtered = suggestions.filter(u =>
        u.username.toLowerCase().includes(lowerCaseSearch)
      );
    
    }
  }, [miniSearch, suggestions]);

return (
  <div className="min-h-screen bg-gray-50">
    <MobileTopbar />
    <Sidebar />
    <main className="pt-14 lg:pl-64 flex justify-center">
      <div className="w-full max-w-[1200px] px-0 sm:px-6 py-4 flex gap-6">
        
        <section className="w-full max-w-2xl bg-white border-x min-h-screen pb-20">
          <PostList />
        </section>

        <aside className="hidden lg:block w-[320px] shrink-0">
          <SuggestionBar initialSuggestions={suggestions} />
        </aside>

      </div>
    </main>
  </div>
);
}
export default HomePage;