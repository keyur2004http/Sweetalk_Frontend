import api from "../Config/axiosConfig";
import axios from "axios"; 

const BaseURL = "https://sweetalk-backend.onrender.com"; 

export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${BaseURL}/auth/register`, data);
        return response.data;
    } catch (error) {
        console.log("Register API Error:", error);
        throw error;
    }
}
export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${BaseURL}/auth/login`, data);
        localStorage.setItem("userId", response.data.userId);
        return response.data;
    } catch (error) {
        console.log("Login API Error:", error);
        throw error;
    }
}
export const homepage = async (username) => {
    try {
        const response = await api.get(`home/${username}`);
        return response.data;
    } catch (error) {
        console.log("Home page API Error:", error);
        throw error;
    }
}

// Add to api.js
export const getRandomSuggestions = async () => {
    const res = await api.get(`api/follow/suggestions/random`);
    return res.data;
};
export const getProfile = async (username, loggedInUserId) => {
    const id = loggedInUserId || localStorage.getItem("userId");
    const res = await api.get(`/api/profiles/${username}?requesterId=${id}`);
   
    return res.data;
};
  export const getProfileById = async (userId) => {
    const res = await api.get(`/api/profiles/getProfileById/${userId}`);
    return res.data;
};
export const updateProfile = async (userId, profileData) => {
  const res = await api.put(
    `/api/profiles/edit/${userId}`,
    profileData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};
  
// Follower Api
  export const getFollowers = async (userId) => {
    const res = await api.get(`/api/follow/followers/${userId}`)
    return res.data;
  };
  
  export const getFollowing = async (userId) => {
    const res = await api.get(`/api/follow/following/${userId}`);
    return res.data;
  };
  export const getMutualFriends =async(userId,otherUserId)=>{
  const res= await api.get(`/api/follow/${userId}/mutual/${otherUserId}`);
  console.log(res.data);
  return res.data;

}
  export const followUser= async (follower,following) => {
    const res = await api.post(`/profile/${follower}/${following}`);
    return res.data;
  };
  export const unfollowUser= async (follower,following) => {
    const res = await api.put(`/profile/${follower}/${following}`);
    return res.data;
};
export const accepetRequest= async (follower,following,accept) => {
    const res = await api.get(`/profile/${follower}/${following}/${accept}`);
    return res.data;
};
export const getFollowRequests = async (userId) => {
    const res = await api.get(`/api/follow/requests`, {
        params: { userId }
    });
    return res.data;
};
export const getFollowBackSuggestions = async (userId) => {
    const res = await api.get(`/api/follow/followBackSuggestions/${userId}`);
    return res.data;
};

export const acceptFollowRequest = async (followerId, userId) => {
    const res = await api.put(`/api/follow/request/${followerId}`, null, {
        params: { 
            accept: true,
            userId: userId 
        }
    });
    return res.data;
};
export const followBackUser = async (targetId, requesterId) => {
    const res = await api.post(`/api/follow/${targetId}`, null, {
        params: { requesterId }
    });
    return res.data;
};
export const cancelFollowRequest = async (followerId, userId) => {
    await api.put(`/api/follow/request/${followerId}`, null, {
        params: {
            accept: false,
            userId
        }
    });
};


//Profile Api

export const getFollowStatus = async (targetUserId,requesterId) => {
       const res = await api.get(`/api/follow/status/${targetUserId}`, {
        params: { requesterId: requesterId }
    });
    
    return res.data;
};

export const canViewProfilePosts = async (followerId, followingId) => {
    const res = await api.get(`/api/follow/isProfileVisible`, {
        params: { followerId, followingId }
    });
    return res.data;
};

export const isFollowBack = async (followerId, followingId) => {
    const res = await api.get(`/api/follow/isFollowing`, {
        params: { 
            followerId: followerId, // Rohit's ID
            targetId: followingId   // The profile Rohit is visiting
        }
    });
    return res.data;
};

export const toggleFollow = async (targetId, requesterId) => {
    const res = await api.post(`/api/follow/${targetId}`, null, {
        params: { requesterId }
    });
    return res.data;
};



export const cancelFollowRequestProfile = async (profileId, userId) => {
    const res = await api.delete(`/profile/cancel/${profileId}/${userId}`);
    return res.data;
};
// Post
export const getPostById = async (postId) => {
    const res = await api.get(`/api/post/getPost/${postId}`);
    return res.data;
};
export const uploadPost = async (formData) => {
  const res = await api.post("api/post/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const deletePost = async (postId, username) => {
    const res = await api.delete(`/api/post/deletePosts/${postId}`, {
        params: { username }
    });
    return res.data;
};

export const likePost = async (postId, userId) => {
  const res = await api.post(`api/post/like/${postId}`, null, {
    params: { userId },
  });
  return res.data;
};
export const getPostLikes = async (postId) => {
  const res = await api.get(`api/post/likes/${postId}`);
  return res.data; 
};


export const isPostLiked = async (postId, userId) => {
  const res = await api.get(`api/post/isLiked/${postId}`, {
    params: { userId }
  });
  return res.data.liked; 
};

//Chat Api 

export const getChatHistory = async (sender, receiver) => {
  const res = await api.get(`/chat/history/${sender}/${receiver}`);
  return res.data;
};
export const getChattedUsers = async (username) => {
  const res = await api.get(`/chat/getChattedUsers/${username}`);
  console.log(res.data)
  return res.data;
};


//Search user api 
export const searchUsers = async (username) => {
  const res = await api.get("/home/search", {
    params: { username }
  });
  return res.data;
};
//comments
export const getPostComments = async (postId) => {
  const res = await api.get(`/api/comment/get/${postId}`);
  return res.data;
};

export const addComment = async (postId, userId, comment) => {
  const res = await api.post(
    "api/comment/add",
    comment,
    {
      params: { postId, userId },
      headers: { "Content-Type": "text/plain" }
    }
  );
  return res.data;
}; 

export const deleteComment = async (commentId, userId) => {
  return await api.delete(
    `/api/comment/delete/${commentId}`,
    { params: { userId } }
  );
};

export const getCommentsByPostId = async (postId) =>
 await api.get(`/api/comment/post/${postId}`);

export const getCommetForPost = async (postId) =>
 await api.get(`/api/comment/get/${postId}`);

export const deleteUserAccount = async (username) => {
  try {
    const response = await api.delete("/api/profiles/delete", {
      params: { username }
    });
    return response.data;
  } catch (error) {
    console.error("API Error during account deletion:", error.response || error);
    throw error;
  }
};
