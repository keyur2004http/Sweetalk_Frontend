const handleFollowUnfollow = async () => {
  try {
    if (followers.some(f => f.username === loggedInUsername)) {
      // Unfollow API Call
      await unfollowUser(profile.username);
      setFollowers(prev => prev.filter(f => f.username !== loggedInUsername));
    } else {
      // Follow API Call
      await followUser(profile.username);
      setFollowers(prev => [...prev, { username: loggedInUsername }]);
    }
  } catch (err) {
    console.error(err);
  }
};