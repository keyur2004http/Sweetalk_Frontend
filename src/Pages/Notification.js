import { useEffect, useState } from "react";
import UserCard from "../FixedComponet/UserCard";
import Sidebar from "../FixedComponet/Sidebar";
import { 
  getProfileById, 
  getFollowRequests,
  getFollowBackSuggestions,
  acceptFollowRequest,
  followBackUser,
  cancelFollowRequest 
} from "../Service/api";
import { BellFill, PeopleFill, ArrowRightCircle } from "react-bootstrap-icons";
import MobileTopbar from "../FixedComponet/MobileTopbar";

const NotificationPage = () => {
  const [followRequests, setFollowRequests] = useState([]);
  const [followBackSuggestions, setFollowBackSuggestions] = useState([]);
  const [userId] = useState(localStorage.getItem('userId'));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const [profileData, requests, suggestions] = await Promise.all([
          getProfileById(userId),
          getFollowRequests(userId),
          getFollowBackSuggestions(userId)
        ]);
        
        setProfile(profileData);
        setFollowRequests(requests || []);
        setFollowBackSuggestions(suggestions || []);
      } catch (err) {
        console.error("Notification load failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  const handleConfirmFollow = async (targetId) => {
    try {
      await acceptFollowRequest(targetId, profile.userId);
      const acceptedUser = followRequests.find(u => u.userId === targetId);
      setFollowRequests(prev => prev.filter(u => u.userId !== targetId));
      if (acceptedUser) setFollowBackSuggestions(prev => [...prev, acceptedUser]);
    } catch (err) { console.error(err); }
  };

  const handleFollowBack = async (targetId) => {
    try {
      await followBackUser(targetId, userId);
      setFollowBackSuggestions(prev => prev.filter(u => u.userId !== targetId));
    } catch (err) { console.error(err); }
  };

  const handleCancelFollow = async (followerId) => {
    try {
      await cancelFollowRequest(followerId);
      setFollowRequests(prev => prev.filter(u => u.userId !== followerId));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
     <MobileTopbar></MobileTopbar>
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 mt-20">
        <div className="max-w-3xl mx-auto">
          
          <header className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <BellFill className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500">Manage your connections and requests</p>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <PeopleFill className="text-blue-500" />
                  <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Follow Requests</h2>
                  <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {followRequests.length}
                  </span>
                </div>
                
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {followRequests.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {followRequests.map(user => (
                        <div key={user.userId} className="p-2 hover:bg-gray-50 transition-colors">
                          <UserCard
                            user={user}
                            type="follow-request"
                            onCancel={handleCancelFollow}
                            onConfirm={handleConfirmFollow}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-gray-400 italic text-sm">
                      No pending requests at the moment.
                    </div>
                  )}
                </div>
              </section>

              {/* Suggestions Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <ArrowRightCircle className="text-green-500" />
                  <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Follow Back Suggestions</h2>
                </div>
                
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {followBackSuggestions.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {followBackSuggestions.map(user => (
                        <div key={user.userId} className="p-2 hover:bg-gray-50 transition-colors">
                          <UserCard
                            user={user}
                            type="follow-back"
                            onFollowBack={handleFollowBack}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-gray-400 italic text-sm">
                      You're all caught up! No new suggestions.
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
};

export default NotificationPage;