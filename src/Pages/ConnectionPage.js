import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getFollowers, getFollowing } from '../Service/api';
import UserCard from '../FixedComponet/UserCard';
import Sidebar from '../FixedComponet/Sidebar';

const ConnectionPage = () => {
  const { userId } = useParams();  
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFollowerMode = location.pathname.includes('followers');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let data;
        if (isFollowerMode) {
          data = await getFollowers(userId);
        } else {
          data = await getFollowing(userId);
        }
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch connections", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadData();
  }, [userId, isFollowerMode]);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">
            {isFollowerMode ? 'Followers' : 'Following'}
          </h2>

          {loading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2">
              {users.map((user) => (
                <UserCard key={user.userId} user={user} type="search" />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">
              No {isFollowerMode ? 'followers' : 'following'} found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConnectionPage;