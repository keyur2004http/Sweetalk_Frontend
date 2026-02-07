import { useNavigate } from "react-router-dom";

const ProfileCard = ({
  profile,
  isOwnProfile,
  followStatus,
  doesFollowMe,
  handleFollowToggle,
  followersCount,
  followingCount,
  postsCount,mutualFriends
}) => {
  const navigate = useNavigate();

 const getButtonStyles = () => {
  if (followStatus === "FOLLOWING" || followStatus === "ACCEPTED") {
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
  if (followStatus === "PENDING") {
    return "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100";
  }
  return "bg-blue-600 text-white hover:bg-blue-700";
};

const getButtonText = () => {
  if (followStatus === "ACCEPTED" || followStatus === "FOLLOWING") return "Following";
    if (followStatus === "PENDING" || followStatus === "REQUESTED") return "Requested";
  if (doesFollowMe) return "Follow Back";
  return "Follow";
};
return (
  <div className="w-full max-w-5xl mx-auto px-4 py-8 border-b border-gray-100">
    <div className="flex items-start gap-6 sm:gap-12">
      
      {/* Profile Image  */}
      <div className="relative shrink-0">
        <img
          src={profile.profilePic || `https://ui-avatars.com/api/?name=${profile.username}`}
          alt="Profile"
          className="w-20 h-20 sm:w-40 sm:h-40 rounded-full object-cover ring-1 ring-gray-200 shadow-sm"
        />
      </div>

      {/*  Right Side Content - Everything else */}
      <div className="flex flex-col flex-1 gap-4 sm:gap-6">
        
        {/* TOP ROW: Username + Desktop Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {profile.firstname}{" "}{profile.lastname}
          </h2>
          
          {/* Desktop Buttons (Visible only on desktop) */}
          <div className="hidden sm:flex gap-2">
            {isOwnProfile ? (
              <button onClick={() => navigate("/editPage", { state: { profile } })} className="px-4 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50 transition">
                Edit profile
              </button>
            ) : (
              <>
                <button onClick={handleFollowToggle} className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition ${getButtonStyles()}`}>
                  {getButtonText()}
                </button>
                <button onClick={() => navigate(`/chatDetailPage/${profile.username}`)} className="px-4 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50 transition">
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* MIDDLE ROW: Stats - Clean and horizontal on desktop */}
        <div className="flex justify-around sm:justify-start gap-4 sm:gap-10">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5">
            <span className="font-bold text-gray-900">{postsCount}</span>
            <span className="text-sm text-gray-600 sm:text-gray-900">posts</span>
          </div>
          <div onClick={() => navigate(`/profile/${profile.userId}/followers`)} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 cursor-pointer">
            <span className="font-bold text-gray-900">{followersCount}</span>
            <span className="text-sm text-gray-600 sm:text-gray-900">followers</span>
          </div>
          <div onClick={() => navigate(`/profile/${profile.userId}/following`)} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 cursor-pointer">
            <span className="font-bold text-gray-900">{followingCount}</span>
            <span className="text-sm text-gray-600 sm:text-gray-900">following</span>
          </div>
        </div>

        {/* BOTTOM ROW: Name and Bio */}
        <div className="hidden sm:block">
         
          <p className="text-sm text-gray-800 leading-snug whitespace-pre-wrap mt-1">
            {profile.bio || "No bio yet."}
          </p>
        </div>
      </div>
    </div>

    {/* MOBILE ONLY SECTION: Bio and Buttons below image */}
    <div className="mt-6 sm:hidden">
      <p className="text-sm text-gray-800 leading-snug whitespace-pre-wrap mt-1">
        {profile.bio || "No bio yet."}
      </p>
      
      <div className="mt-6 flex gap-2">
        {isOwnProfile ? (
          <button onClick={() => navigate("/editPage", { state: { profile } })} className="flex-1 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
            Edit profile
          </button>
        ) : (
          <>
            <button onClick={handleFollowToggle} className={`flex-1 py-1.5 rounded-lg text-sm font-semibold ${getButtonStyles()}`}>
              {getButtonText()}
            </button>
            <button onClick={() => navigate(`/chatDetailPage/${profile.username}`)} className="flex-1 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold">
              Message
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);



};

export default ProfileCard;