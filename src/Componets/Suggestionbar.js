import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import UserCard from '../FixedComponet/UserCard'; 
import { toggleFollow } from '../Service/api';

const SuggestionBar = ({ initialSuggestions = [] }) => {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [filteredSuggestions, setFilteredSuggestions] = useState(initialSuggestions);
  const [miniSearch, setMiniSearch] = useState('');

  useEffect(() => {
    setSuggestions(initialSuggestions);
    setFilteredSuggestions(initialSuggestions);
  }, [initialSuggestions]);

  useEffect(() => {
    if (miniSearch.trim() === '') {
      setFilteredSuggestions(suggestions);
    } else {
      const lowerCaseSearch = miniSearch.toLowerCase();
      const filtered = suggestions.filter(u =>
        u.username.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredSuggestions(filtered);
    }
  }, [miniSearch, suggestions]);

  const handleFollowSuggestion = async (targetId) => {
    try {
      await toggleFollow(targetId);
      setSuggestions(prev => prev.filter(u => u.userId !== targetId));
    } catch (err) {
      console.error("Follow failed", err);
    }
  };

  return (
    <aside className="hidden lg:block w-80 py-4">
      <div className="sticky top-20 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h6 className="font-bold text-gray-800 mb-3">Suggestions for you</h6>

        <div className="relative mb-4 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400 group-focus-within:text-blue-500 transition-colors size-3" />
          </div>
          <input
            type="text"
            placeholder="Filter suggestions..."
            className="w-full bg-gray-50 border border-gray-200 py-1.5 pl-9 pr-3 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            value={miniSearch}
            onChange={(e) => setMiniSearch(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((user) => (
              <UserCard
                key={user.userId}
                user={user}
                type="suggestion"
                onConfirm={() => handleFollowSuggestion(user.userId)}
              />
            ))
          ) : (
            <p className="text-center py-4 text-gray-400 text-xs italic">
              {miniSearch ? "No matches found" : "No new suggestions"}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SuggestionBar;