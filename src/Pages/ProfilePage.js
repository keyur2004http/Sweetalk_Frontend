import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getProfile, getFollowers, getFollowing, getProfileById, getFollowStatus,
  toggleFollow,
  deletePost, getMutualFriends,
} from '../Service/api';
import ProfileCard from '../Componets/Ui/ProfileCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../FixedComponet/Sidebar';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import PostDetailModal from '../Componets/Ui/PostDetailModal';
import PostList from '../Componets/PostList';
import MobileTopbar from '../FixedComponet/MobileTopbar';

const ProfilePage = () => {
  const [canViewPosts, setCanViewPosts] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { username } = useParams();
  const loggedInUsername = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const [profile, setProfile] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [doesFollowMe, setDoesFollowMe] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [followStatus, setFollowStatus] = useState("FOLLOW");
  const [mutualFriends, setMutualFriends] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPostList, setShowPostList] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (username || loggedInUsername) {
      fetchProfileData();
    }
  }, [username, loggedInUsername]);
  useEffect(() => {
    if (showPostList) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showPostList]);

const fetchProfileData = async () => {
  try {
    setLoadingProfile(true);
    setLoadingPosts(true);

    const [loggedInProfile, profileData] = await Promise.all([
      getProfileById(Number(userId)),
      getProfile(username || loggedInUsername, userId)
    ]);

    setProfile(profileData);

    const [followersData, followingData, mutualFriendsData] = await Promise.all([
      getFollowers(profileData.userId),
      getFollowing(profileData.userId),
      getMutualFriends(userId, profileData.userId)
    ]);

    setFollowers(followersData);
    setFollowing(followingData);
    setMutualFriends(mutualFriendsData);

    if (loggedInProfile.userId === profileData.userId) {
      setCanViewPosts(true);
      setFollowStatus("OWN");
    } else {

      const [myStatusToThem, theirStatusToMe] = await Promise.all([
        getFollowStatus(profileData.userId, loggedInProfile.userId),
        getFollowStatus(loggedInProfile.userId, profileData.userId)
      ]);

      setFollowStatus(myStatusToThem);

      setDoesFollowMe(
        theirStatusToMe === "FOLLOWING" ||
        theirStatusToMe === "ACCEPTED"
      );

      const isAccountPublic =
        profileData.isPublic === true ||
        profileData.public === true ||
        profileData.isPublic === 1;

      setCanViewPosts(
        isAccountPublic ||
        myStatusToThem === "FOLLOWING" ||
        myStatusToThem === "ACCEPTED"
      );
    }

  } catch (err) {
    console.error("Profile fetch error:", err);
  } finally {
    setLoadingProfile(false);
    setLoadingPosts(false);
  }
};

  const handleFollowToggle = async () => {
    const loggedInId = localStorage.getItem("userId");
    try {
      const newStatus = await toggleFollow(profile.userId, loggedInId);
      setFollowStatus(newStatus);
      if (newStatus === "FOLLOWING" || profile.isPublic) {
        setCanViewPosts(true);
      }
      setTimeout(() => {
        fetchProfileData();
      }, 1200);

    } catch (err) {
      console.error("Follow failed", err);
    }
  };


  const confirmDelete = async () => {
    try {
      await deletePost(postToDelete, localStorage.getItem("username"));
      toast.success("Post deleted successfully!");
      fetchProfileData();
      setPostToDelete(null);
      setShowModal(false);
      navigate("/");
    } catch (err) {
      console.log(err)
    }
  };

  const handleClick = async (postId) => {
    const index = profile.posts.findIndex(p => p.postId === postId);
    setSelectedPost(profile.posts[index]);
    if (window.innerWidth >= 1024) {
      setShowPostModal(true);
    } else {
      setShowPostList(true);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MobileTopbar></MobileTopbar>
      <Sidebar />
      <main className="lg:ml-64 flex justify-center w-full">
        <div className="flex-1 w-full px-3 sm:px-6 lg:px-10 pt-10 pb-24 lg:pb-10 max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm mb-6">
            <ProfileCard
              profile={profile}
              isOwnProfile={username === loggedInUsername || !username}
              followStatus={followStatus}
              doesFollowMe={doesFollowMe}
              handleFollowToggle={handleFollowToggle}
              followersCount={followers.length}
              followingCount={following.length}
              postsCount={profile?.posts?.length || 0}
              mutualFriends={mutualFriends}
            />
          </div>
          {loadingProfile ? (

  /* LOADING STATE */
  <div className="flex justify-center items-center py-20">
    <p className="text-gray-400">Loading profile...</p>
  </div>

) : canViewPosts ? (

            <div className="bg-white sm:rounded-3xl sm:shadow-sm sm:p-6 min-h-[300px] flex flex-col">
              <h4 className="hidden sm:block text-lg font-bold mb-4">Posts</h4>

              {loadingPosts ? (

                /* LOADING STATE */
                <div className="flex justify-center items-center py-20">
                  <p className="text-gray-400">Loading posts...</p>
                </div>

              ) : profile.posts && profile.posts.length > 0 ? (

                /* POSTS GRID */
                <div className="grid grid-cols-3 gap-[1px] sm:gap-2">
                  {profile.posts.map((post) => (
                    <div
                      key={post.postId}
                      onClick={() => handleClick(post.postId)}
                      className="aspect-[4/5] cursor-pointer overflow-hidden rounded-md"
                    >
                      <img
                        src={post.imageUrl}
                        className="w-full h-full object-cover transition hover:scale-105"
                      />
                    </div>
                  ))}
                </div>

              ) : (
                /* EMPTY POSTS STATE - Centered */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No Posts Yet</h3>
                  <p className="text-gray-500 text-sm mt-1">When {profile.firstname} posts, they'll appear here.</p>
                </div>
              )}
            </div>
          ) : (
            /* PRIVATE ACCOUNT STATE - Centered with Lock Icon */
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">This account is private</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">Follow this account to see their photos and videos.</p>
            </div>
          )}
          {showPostModal && (
            <PostDetailModal
              post={selectedPost}
              onClose={() => setShowPostModal(false)}
              isOwnPost={selectedPost?.ownerUsername === loggedInUsername}
              onDelete={() => {
                setPostToDelete(selectedPost.postId);
                setShowDeleteDialog(true);
              }}
            />
          )}
          {showPostList && (
            <div className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto">
              <button
                onClick={() => setShowPostList(false)}
                className="sticky top-0 z-10 p-4 bg-white/80 backdrop-blur-md w-full text-left font-bold border-b"
              >
                ← Posts
              </button>

              <PostList
                posts={profile.posts}
                startPostId={selectedPost?.postId}
                onClose={() => setShowPostList(false)}
              />
            </div>
          )}

          <div className="block lg:hidden">
            {showModal && (
              <PostList posts={profile.posts} />
            )}
          </div>
          {showDeleteDialog && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

              <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleFill size={32} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Post?
                </h3>

                <p className="text-sm text-gray-500 mb-8">
                  This action cannot be undone. The post will be permanently removed.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={confirmDelete}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition active:scale-95"
                  >
                    Yes, Delete Post
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setPostToDelete(null);
                    }}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
