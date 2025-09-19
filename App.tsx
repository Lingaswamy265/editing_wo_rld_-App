import React, { useState, useCallback, createContext, useContext, useMemo, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import WebView from './components/WebView';
import AndroidFrame from './components/AndroidFrame';

// --- Types ---
export interface User {
  id: number;
  username: string;
  email: string;
  password;
  followers: number[]; // Array of user IDs
  following: number[]; // Array of user IDs
}

// --- Initial Mock Data ---
const INITIAL_USERS: User[] = [
  { id: 1, username: 'editor_pro', email: 'pro@editor.com', password: 'password123', followers: [2, 3], following: [2] },
  { id: 2, username: 'creative_cat', email: 'cat@creative.com', password: 'password123', followers: [1], following: [1, 3] },
  { id: 3, username: 'design_diva', email: 'diva@design.com', password: 'password123', followers: [2], following: [2] },
];


// --- Theme Context ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
// --- End Theme Context ---

export type View = 'webview' | 'reels' | 'users' | 'myReels';
export interface Reel {
  id: string;
  src: string;
  uploaderId: number;
  uploaderUsername: string;
}

const AppContent: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('webview');
  const [reels, setReels] = useState<Reel[]>([]);
  const targetUrl = 'https://editingworld.netlify.app';

  const handleLoginSuccess = useCallback((username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);
  
  const handleSignup = useCallback((username: string, email: string, password: string): { success: boolean, message?: string } => {
    if (users.some(u => u.username === username)) {
      return { success: false, message: 'Username is already taken.' };
    }
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: Date.now(),
      username,
      email,
      password,
      followers: [],
      following: [],
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser); // Automatically log in the new user
    return { success: true };
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentView('webview');
    setReels([]);
  }, []);

  const handleAddReel = useCallback((file: File) => {
    if (!currentUser) return;
    const newReel: Reel = {
      id: `${Date.now()}-${file.name}`,
      src: URL.createObjectURL(file),
      uploaderId: currentUser.id,
      uploaderUsername: currentUser.username,
    };
    setReels(prev => [newReel, ...prev]);
  }, [currentUser]);

  const handleDeleteReel = useCallback((reelId: string) => {
    const reelToDelete = reels.find(r => r.id === reelId);
    if (reelToDelete && reelToDelete.uploaderId === currentUser?.id) {
        setReels(prevReels => prevReels.filter(reel => reel.id !== reelId));
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(reelToDelete.src);
    } else {
        console.error("Attempted to delete a reel that doesn't exist or user is not the owner.");
    }
  }, [reels, currentUser]);
  
  const handleToggleFollow = useCallback((targetUserId: number) => {
    if (currentUser && currentUser.id === targetUserId) {
      console.error("User cannot follow themselves.");
      return;
    }

    let updatedCurrentUser: User | null = null;

    const updatedUsers = users.map(user => {
      // Update the target user's followers list
      if (user.id === targetUserId) {
        const isFollowing = user.followers.includes(currentUser!.id);
        const newFollowers = isFollowing
          ? user.followers.filter(id => id !== currentUser!.id)
          : [...user.followers, currentUser!.id];
        return { ...user, followers: newFollowers };
      }
      
      // Update the current user's following list
      if (user.id === currentUser!.id) {
        const isFollowing = user.following.includes(targetUserId);
        const newFollowing = isFollowing
          ? user.following.filter(id => id !== targetUserId)
          : [...user.following, targetUserId];
        updatedCurrentUser = { ...user, following: newFollowing };
        return updatedCurrentUser;
      }

      return user;
    });

    setUsers(updatedUsers);
    if (updatedCurrentUser) {
      setCurrentUser(updatedCurrentUser);
    }
  }, [users, currentUser]);


  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-gray-200 dark:bg-gray-900 transition-colors duration-300">
      <AndroidFrame>
        {currentUser ? (
          <WebView 
            url={targetUrl} 
            onLogout={handleLogout} 
            currentUser={currentUser}
            allUsers={users}
            currentView={currentView}
            setCurrentView={setCurrentView}
            reels={reels}
            onAddReel={handleAddReel}
            onToggleFollow={handleToggleFollow}
            onDeleteReel={handleDeleteReel}
          />
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} onSignup={handleSignup} />
        )}
      </AndroidFrame>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);


export default App;