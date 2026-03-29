import React, { useState, useEffect } from 'react';
import PostCard from './Ui/PostCard';
import { homepage } from '../Service/api';

const PostList = ({ posts = [], startPostId }) => {
  const [sortedPosts, setSortedPosts] = useState(posts);

  useEffect(() => {
    if (startPostId) {
      const sorted = [...posts].sort((a, b) =>
        a.postId === startPostId ? -1 : b.postId === startPostId ? 1 : 0
      );
      setSortedPosts(sorted);
    } else {
      setSortedPosts(posts);
    }
  }, [posts, startPostId]);

  const handleRemovePost = (postId) => {
    setSortedPosts(prev => prev.filter(p => p.postId !== postId));
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto py-6 px-2 lg:px-0">
      {sortedPosts.length > 0 ? (
        sortedPosts.map(post => (
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