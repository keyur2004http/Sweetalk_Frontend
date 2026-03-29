const MessageSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div className="max-w-[60%] h-10 bg-gray-200 rounded-2xl"></div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;