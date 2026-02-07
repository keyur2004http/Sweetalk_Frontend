import React, { useState, useEffect } from 'react';
import {
  FaHeart,
  FaRegComment,
  FaShare,
  FaRegHeart,
  FaEllipsisH,
} from 'react-icons/fa';
import { likePost, isPostLiked, deleteComment, getCommetForPost, addComment } from '../../Service/api';
import { useNavigate } from 'react-router-dom';
import { Trash3Fill } from "react-bootstrap-icons";

const PostCard = ({ post, isDetailedView }) => {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));
const [commentCount, setCommentCount] = useState(post.commentCount);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likedByUser || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comments, setComments] = useState([]);

  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const status = await isPostLiked(post.postId, userId);
        
        setIsLiked(status);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLikeStatus();
  }, [post.postId, userId]);
  
  const handleLike = async () => {
    const prev = isLiked;
    setIsLiked(!prev);
    setLikeCount(c => (prev ? c - 1 : c + 1));
    
    try {
      await likePost(post.postId, userId);
    
    } catch {
      setIsLiked(prev);
      setLikeCount(c => (prev ? c + 1 : c - 1));
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const res = await addComment(post.postId, userId, commentText);
     setCommentCount(prev => prev + 1);
    setComments(res);
    setCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, userId);
      setComments(prev =>
        prev.filter(comment => comment.commentId !== commentId)
      );
      setCommentCount(prev => prev - 1);
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };
  const toggleComments = async () => {
    setShowComments(!showComments);

    if (!showComments) {
      setLoadingComments(true);
      try {
        const res = await getCommetForPost(post.postId);
        const incomingComments = Array.isArray(res.data) ? res.data : (res.data?.comments || []);
        setComments(incomingComments);
       
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  return (
    <div className={`bg-white border shadow-sm ${isDetailedView ? 'flex' : 'rounded-xl mb-6'}`}>
      {/* HEADER */}
      <div className="flex items-center justify-between p-3">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate(`/profile/${post.ownerUsername}`)}
        >
          <img
            src={post.profilePic}
            className="w-10 h-10 rounded-full object-cover"
            alt=""
          />
          <span className="font-bold text-sm">@{post.ownerUsername}</span>
        </div>
        <FaEllipsisH />
      </div>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          className="w-full max-h-[600px] object-contain"
          onDoubleClick={handleLike}
          alt=""
        />
      )}

      {/* ACTIONS */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} className="text-2xl">
            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="text-2xl">
            <FaRegComment />
          </button>
          <FaShare className="ml-auto text-2xl" />
        </div>

        <p className="font-bold mt-2">{likeCount} likes</p>
        <p>
          <b>{post.ownerUsername}</b> {post.content}
        </p>

        <button
          className="text-sm text-gray-500 mt-2 hover:underline"
          onClick={toggleComments}
        >
          {loadingComments ? "Loading..." : `View all ${commentCount} comments`}
        </button>
        {showComments && (
          <div className="mt-3 space-y-2">
            {Array.isArray(comments) && comments.map((c,index) => (
                                        <div key={index} className="flex items-start justify-between gap-3 py-2">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={c.profilePic || "/default-avatar.png"} 
                                                    className="w-8 h-8 rounded-full object-cover mt-0.5"
                                                    alt={c.userName}
                                                    onClick={() => navigate(`/profile/${c.userName}`)}
                                                />
            
                                                <div className="text-sm">
                                                    <span
                                                        onClick={() => navigate(`/profile/${c.userName}`)}
                                                        className="font-bold mr-2 cursor-pointer hover:underline text-gray-900"
                                                    >
                                                        {c.userName}
                                                    </span>
                                                    <span className="text-gray-800 break-words">{c.comment}</span>
                                                </div>
                                            </div>
                                            {Number(c.userId) === Number(userId) && (
                                                <button
                                                    onClick={() => handleDeleteComment(c.commentId)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash3Fill size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
            <div className="flex gap-2 mt-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 outline-none"
              />
              <button onClick={handleAddComment} className="text-blue-500 font-bold">
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
