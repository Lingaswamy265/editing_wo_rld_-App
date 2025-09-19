import React, { useState, useCallback } from 'react';
import { useTheme, View, Reel, User } from '../App';
import { MenuIcon, LogoutIcon, HeartIcon, CommentIcon, ShareIcon, SunIcon, MoonIcon, HomeIcon, ReelsIcon, UsersIcon, ChevronDownIcon, UploadIcon } from './icons';
import ReelsScreen from './ReelsScreen';
import UserListScreen from './UserListScreen';

interface WebViewProps {
  url: string;
  onLogout: () => void;
  currentUser: User;
  allUsers: User[];
  currentView: View;
  setCurrentView: (view: View) => void;
  reels: Reel[];
  onAddReel: (file: File) => void;
  onToggleFollow: (targetUserId: number) => void;
  onDeleteReel: (reelId: string) => void;
}

const WebView: React.FC<WebViewProps> = ({ url, onLogout, currentUser, allUsers, currentView, setCurrentView, reels, onAddReel, onToggleFollow, onDeleteReel }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFollowersExpanded, setIsFollowersExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const viewTitles: Record<View, string> = {
    webview: 'Home',
    reels: 'Discover Reels',
    myReels: 'My Uploads',
    users: 'Discover Users',
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const toggleFollowers = useCallback(() => {
    setIsFollowersExpanded(prev => !prev);
  }, []);
  
  const handleActionClick = (action: string) => {
    alert(`${action} feature is not yet implemented.`);
  };

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  }
  
  const getFollowerUsernames = () => {
    return currentUser.followers.map(followerId => {
      const user = allUsers.find(u => u.id === followerId);
      return user ? user.username : 'Unknown User';
    });
  };

  const renderMainContent = () => {
    switch(currentView) {
      case 'webview':
        return (
          <>
            <iframe
              src={url}
              title="Web View"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
            {/* Floating Action Buttons */}
            <div className="absolute bottom-16 right-2 flex flex-col items-center space-y-4">
              <button onClick={() => handleActionClick('Like')} className="p-3 bg-black/40 rounded-full text-white hover:bg-pink-500/80 transition-all duration-300 focus:outline-none shadow-lg" aria-label="Like">
                  <HeartIcon className="h-7 w-7" />
              </button>
              <button onClick={() => handleActionClick('Comment')} className="p-3 bg-black/40 rounded-full text-white hover:bg-blue-500/80 transition-all duration-300 focus:outline-none shadow-lg" aria-label="Comment">
                  <CommentIcon className="h-7 w-7" />
              </button>
              <button onClick={() => handleActionClick('Share')} className="p-3 bg-black/40 rounded-full text-white hover:bg-green-500/80 transition-all duration-300 focus:outline-none shadow-lg" aria-label="Share">
                  <ShareIcon className="h-7 w-7" />
              </button>
            </div>
          </>
        );
      case 'reels':
        return <ReelsScreen title="Discover Reels" reels={reels} onAddReel={onAddReel} currentUser={currentUser} onDeleteReel={onDeleteReel} />;
      case 'myReels':
        const myReels = reels.filter(reel => reel.uploaderId === currentUser.id);
        return <ReelsScreen title="My Uploads" reels={myReels} onAddReel={onAddReel} currentUser={currentUser} onDeleteReel={onDeleteReel} />;
      case 'users':
        return <UserListScreen currentUser={currentUser} allUsers={allUsers} onToggleFollow={onToggleFollow} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-950 relative overflow-hidden transition-colors">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="absolute inset-0 bg-black/50 z-20 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`absolute top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transform transition-all duration-300 ease-in-out z-30 shadow-lg ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 flex flex-col h-full">
           <div className="flex-shrink-0">
                <div className="flex items-center space-x-4 p-2 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F22EE5] to-[#174B80] flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{currentUser.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <p className="font-semibold text-base text-gray-800 dark:text-gray-100">{currentUser.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                    </div>
                </div>
            </div>

          <nav className="flex-grow overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavClick('webview')}
                  className="w-full flex items-center p-3 rounded-lg text-left text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <HomeIcon className="h-6 w-6 mr-3 text-gray-500" />
                  Home
                </button>
              </li>
               <li>
                <button
                  onClick={() => handleNavClick('reels')}
                  className="w-full flex items-center p-3 rounded-lg text-left text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ReelsIcon className="h-6 w-6 mr-3 text-gray-500" />
                  Reels
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('myReels')}
                  className="w-full flex items-center p-3 rounded-lg text-left text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <UploadIcon className="h-6 w-6 mr-3 text-gray-500" />
                  My Uploads
                </button>
              </li>
               <li>
                <button
                  onClick={() => handleNavClick('users')}
                  className="w-full flex items-center p-3 rounded-lg text-left text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <UsersIcon className="h-6 w-6 mr-3 text-gray-500" />
                  Discover Users
                </button>
              </li>
               <hr className="border-gray-200 dark:border-gray-600 my-2" />
               <li>
                <div
                  className="w-full flex items-center p-3 rounded-lg text-left text-base font-medium"
                >
                  <UsersIcon className="h-6 w-6 mr-3 text-gray-500" />
                  <span className="flex-grow">Following</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{currentUser.following.length}</span>
                </div>
              </li>
               <li>
                 <button
                    onClick={toggleFollowers}
                    className="w-full flex items-center p-3 rounded-lg text-left text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UsersIcon className="h-6 w-6 mr-3 text-gray-500" />
                    <span className="flex-grow">Followers</span>
                     <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">{currentUser.followers.length}</span>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transform transition-transform ${isFollowersExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isFollowersExpanded && (
                    <div className="pl-8 py-2 text-sm text-gray-600 dark:text-gray-300">
                      <ul className="space-y-1 list-disc list-inside">
                        {getFollowerUsernames().map(name => <li key={name}>{name}</li>)}
                      </ul>
                    </div>
                  )}
              </li>
              <hr className="border-gray-200 dark:border-gray-600 my-2" />
              <li>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center p-3 rounded-lg text-left text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'light' ? 
                    <SunIcon className="h-6 w-6 mr-3 text-yellow-500" /> : 
                    <MoonIcon className="h-6 w-6 mr-3 text-blue-400" />
                  }
                  <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-600">
             <button
              onClick={onLogout}
              className="w-full flex items-center p-3 rounded-lg text-left text-base font-medium text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogoutIcon className="h-6 w-6 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="h-full flex flex-col flex-grow">
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-md z-10 transition-colors">
          <div className="h-14 flex items-center justify-between px-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
              {viewTitles[currentView]}
            </h1>
            <div className="w-8"></div> {/* Spacer to balance the header */}
          </div>
        </header>
        <main className="flex-grow relative bg-gray-50 dark:bg-gray-900">
           {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default WebView;