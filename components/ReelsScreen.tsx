import React, { useRef, useState, useCallback } from 'react';
import { Reel, User } from '../App';
import { PlusIcon, PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon, TrashIcon } from './icons';

interface ReelPlayerProps {
    reel: Reel;
    currentUser: User;
    onDeleteReel: (reelId: string) => void;
}

const ReelPlayer: React.FC<ReelPlayerProps> = ({ reel, currentUser, onDeleteReel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleVideoClick = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent video click from firing
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this reel?')) {
        onDeleteReel(reel.id);
    }
  }, [reel.id, onDeleteReel]);

  return (
    <div 
      className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-md group cursor-pointer"
      onClick={handleVideoClick}
      role="button"
      tabIndex={0}
      aria-label={`Play or pause reel by ${reel.uploaderUsername}`}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleVideoClick(); }}
    >
      <video
        ref={videoRef}
        src={reel.src}
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
      />
      {/* --- Overlays --- */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* Delete Button (visible to owner) */}
      {currentUser.id === reel.uploaderId && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={handleDelete}
                className="p-2 text-white bg-red-600/60 rounded-full hover:bg-red-500 focus:outline-none pointer-events-auto"
                aria-label="Delete reel"
            >
                <TrashIcon className="h-5 w-5" />
            </button>
        </div>
      )}

      {/* Central Play/Pause button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isPlaying && (
          <div className="bg-black/50 p-4 rounded-full transition-opacity duration-300 group-hover:opacity-100 opacity-0">
            <PlayIcon className="h-10 w-10 text-white" />
          </div>
        )}
      </div>
      
      {/* Bottom Controls (Uploader name and Mute) */}
       <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none">
          <p className="text-white text-sm font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            @{reel.uploaderUsername}
          </p>
          <button
            onClick={toggleMute}
            className="p-2 text-white bg-black/40 rounded-full hover:bg-black/60 focus:outline-none pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeOffIcon className="h-5 w-5" /> : <VolumeUpIcon className="h-5 w-5" />}
          </button>
      </div>
    </div>
  );
};


interface ReelsScreenProps {
  title: string;
  reels: Reel[];
  onAddReel: (file: File) => void;
  currentUser: User;
  onDeleteReel: (reelId: string) => void;
}

const ReelsScreen: React.FC<ReelsScreenProps> = ({ title, reels, onAddReel, currentUser, onDeleteReel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAddReel(file);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto p-2 bg-gray-100 dark:bg-black relative">
       <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 px-2">{title}</h2>
      {reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-4/5 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No reels yet.</p>
            {title === "My Uploads" && <p>Click the '+' button to upload your first reel!</p>}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {reels.map((reel) => (
            <ReelPlayer key={reel.id} reel={reel} currentUser={currentUser} onDeleteReel={onDeleteReel} />
          ))}
        </div>
      )}

      <button
        onClick={handleUploadClick}
        className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        aria-label="Upload new reel"
      >
        <PlusIcon className="h-8 w-8" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
    </div>
  );
};

export default ReelsScreen;