import { useNavigate } from "react-router-dom";
import { ChatDotsFill } from "react-bootstrap-icons";

const UserCard = ({ user, type, onConfirm, onCancel, onFollowBack }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/profile/${user.username}`);
  };

  const ActionButton = () => {
    if (type === "follow-request") {
      return (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm(user.userId);
            }}
            className="px-4 py-1.5 text-xs font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition active:scale-95"
          >
            Confirm
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel(user.userId);
            }}
            className="px-4 py-1.5 text-xs font-bold rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition active:scale-95"
          >
            Delete
          </button>
        </div>
      );
    }

    if (type === "follow-back") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFollowBack(user.userId);
          }}
          className="px-4 py-1.5 text-xs font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition active:scale-95"
        >
          Follow Back
        </button>
      );
    }

    if (type === "message") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/chatDetailPage/${user.username}`);
          }}
          className="p-2 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
        >
          <ChatDotsFill size={18} />
        </button>
      );
    }

    return null;
  };

  return (
    <div
      onClick={goToProfile}
      className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={
            user.profilePic ||
            `https://ui-avatars.com/api/?name=${user.username}&background=random`
          }
          className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
          alt="Profile"
        />

        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">
            {user.username}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.name || `${user.firstname || ""} ${user.lastname || ""}`}
          </p>
        </div>
      </div>

      <ActionButton />
    </div>
  );
};

export default UserCard;
