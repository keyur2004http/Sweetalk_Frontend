import React from 'react';
import UserCard from './UserCard';

const ProfileList = ({ users, type, onAction, onSecondaryAction, loading }) => {
  if (loading) return <div className="text-center p-3">Loading...</div>;

  if (!users || users.length === 0) {
    return (
      <div className="text-center p-4 text-muted">
        <small>No profiles found.</small>
      </div>
    );
  }

  return (
    <div className="profile-list-container">
      {users.map((user) => (
        <UserCard
          key={user.userId || user.username}
          user={user}
          type={type}
          onConfirm={onAction}          
          onCancel={onSecondaryAction} 
          onFollowBack={onAction}
        />
      ))}
    </div>
  );
};

export default ProfileList;