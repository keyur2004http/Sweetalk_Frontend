import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaShare } from "react-icons/fa";
import { X, Trash3Fill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import {
    likePost,
    isPostLiked,
    getPostComments,
    addComment,
    deleteComment
} from "../../Service/api";


const PostDetailModal = ({ post, onClose, onDelete, isOwnPost }) => {
    const userId = Number(localStorage.getItem("userId"));
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        isPostLiked(post.postId, userId).then(setIsLiked);
    }, [post.postId, userId]);

    useEffect(() => {
        getPostComments(post.postId)
            .then(res => {
                const data = res;
                setComments(data);
            })
            .catch(() => setComments([]));
    }, [post.postId]);

    const handleLike = async () => {
        setIsLiked(prev => !prev);
        setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
        await likePost(post.postId, userId);
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        const res = await addComment(post.postId, userId, commentText);
        console.log(res);
        setComments(res);
        setCommentText("");
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId, userId);

            // 🔥 instant UI update
            setComments(prev =>
                prev.filter(comment => comment.commentId !== commentId)
            );

        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />

            <div className="relative bg-white flex w-full max-w-5xl h-[85vh] rounded-xl overflow-hidden">

                {/* IMAGE */}
                <div className="hidden lg:flex w-[60%] bg-black">
                    <img src={post.imageUrl} className="w-full h-full object-contain" />
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-[40%] flex flex-col">

                    {/* HEADER */}
                    <div className="flex justify-between p-4 border-b">
                        <div className="flex items-center gap-3">
                            <img src={post.profilePic} className="w-8 h-8 rounded-full" />
                            <b>@{post.ownerUsername}</b>
                        </div>
                        <div className="flex gap-2">
                            {isOwnPost && (
                                <button onClick={onDelete}>
                                    <Trash3Fill />
                                </button>
                            )}
                            <button onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* COMMENTS */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <p>
                            <b>{post.ownerUsername}</b> {post.content}
                        </p>

                        {Array.isArray(comments) && comments.map((c,index) => (
                            <div key={index} className="flex items-start justify-between gap-3 py-2">

                                {/* Left: Commenter Profile Image and Text Content */}
                                <div className="flex items-start gap-3">
                                    <img
                                        src={c.profilePic || "/default-avatar.png"} // Use the commenter's pic
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

                                {/* Right: Delete Button (Only shown if it's the user's own comment) */}
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
                    </div>

                    {/* ACTIONS */}
                    <div className="p-4 border-t">
                        <div className="flex gap-4 mb-2">
                            <button onClick={handleLike}>
                                {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                            </button>
                            <FaRegComment />
                            <FaShare className="ml-auto" />
                        </div>

                        <b>{likeCount} likes</b>

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

                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
