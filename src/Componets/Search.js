import { useState, useEffect } from "react";
import Sidebar from "../FixedComponet/Sidebar";
import ProfileList from "../FixedComponet/ProfileList"; 
import { searchUsers } from "../Service/api";
import { Search as SearchIcon } from "react-bootstrap-icons";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim() !== "") {
        setLoading(true);
        try {
          const data = await searchUsers(searchTerm);
          setSearchResults(data);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 pt-8">
          
          {/* Search Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore</h2>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-white border border-gray-200 py-3 pl-12 pr-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                placeholder="Search for creators, friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {searchTerm.trim() === "" ? (
              // Empty State / Suggestions
              <div className="p-10 text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <SearchIcon className="text-blue-500 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800">Search for SweeTalkers</h3>
                <p className="text-sm text-gray-500 mt-1">Find people you know or discover new ones.</p>
              </div>
            ) : (
              // Results List
              <div className="p-2">
                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {loading ? "Searching..." : `Results for "${searchTerm}"`}
                  </span>
                </div>
                
                <ProfileList 
                  users={searchResults} 
                  type="search" 
                  loading={loading}
                />
                
                {!loading && searchResults.length === 0 && (
                   <div className="p-8 text-center text-gray-500 italic">
                      No users found matching that name.
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;