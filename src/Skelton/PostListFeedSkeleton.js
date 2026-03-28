import PostFeedSkeleton from "./PostFeedSkeleton";

const PostListFeedSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <PostFeedSkeleton key={i} />
      ))}
    </>
  );
};

export default PostListFeedSkeleton;