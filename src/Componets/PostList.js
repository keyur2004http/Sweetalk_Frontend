import React, { useState, useEffect } from 'react';
import PostCard from './Ui/PostCard';
import { homepage } from '../Service/api';

const PostList = ({ posts: externalPosts,startPostId }) => {
  const [posts, setPosts] = useState(externalPosts || []);
  const [loading, setLoading] = useState(!externalPosts);

  useEffect(() => {
    if (externalPosts) {
      if (startPostId) {
        const sorted = [...externalPosts].sort((a, b) =>
          a.postId === startPostId ? -1 : b.postId === startPostId ? 1 : 0
        );
        setPosts(sorted);
      } else {
        setPosts(externalPosts);
      }
      setLoading(false);
      return;
    }
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const username = localStorage.getItem('username');
      const data = await homepage(username);
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchPosts();
}, [externalPosts, startPostId]);
const handleRemovePost = (postId) => {
  setPosts(prev => prev.filter(p => p.postId !== postId));
};
if (loading) {
  return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}
return (
  <div className="flex flex-col w-full max-w-[500px] mx-auto py-6 px-2 lg:px-0">
    {posts.length > 0 ? (
      posts.map(post => (
        <PostCard
          key={post.postId}
          post={post}
          isDetailedView={false}
          onDeleteSuccess={() => handleRemovePost(post.postId)}
        />
      ))
    ) : (
      <div className="text-center py-20 text-gray-400">
        No posts yet
      </div>
    )}
  </div>
);
};
export default PostList;