import React from 'react';
import { User } from '../App';
import { UserPlusIcon, UserCheckIcon } from './icons';

interface UserListScreenProps {
  currentUser: User;
  allUsers: User[];
  onToggleFollow: (targetUserId: number) => void;
}

const UserListScreen: React.FC<UserListScreenProps> = ({ currentUser, allUsers, onToggleFollow }) => {
  const otherUsers = allUsers.filter(user => user.id !== currentUser.id);

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 dark:bg-black p-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 px-2">Discover Users</h2>
      {otherUsers.length > 0 ? (
        <ul className="space-y-3">
          {otherUsers.map(user => {
            const isFollowing = currentUser.following.includes(user.id);
            return (
              <li
                key={user.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={() => onToggleFollow(user.id)}
                  className={`flex items-center justify-center px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-gray-400'
                      : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                  }`}
                  aria-label={isFollowing ? `Unfollow ${user.username}` : `Follow ${user.username}`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheckIcon className="h-5 w-5 mr-2" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="h-5 w-5 mr-2" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>No other users to show.</p>
        </div>
      )}
    </div>
  );
};

export default UserListScreen;