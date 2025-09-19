
import React from 'react';

const StatusBar: React.FC = () => (
  <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 dark:bg-gray-900 px-4 flex items-center justify-between z-20 transition-colors">
    <div className="text-gray-800 dark:text-white text-xs font-semibold">10:30 AM</div>
    <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.555a5.556 5.556 0 015.556 0M12 20.37V12m0 8.37a8.333 8.333 0 01-8.333-8.333H3.667a8.333 8.333 0 018.333-8.333v0a8.333 8.333 0 018.333 8.333h0a8.333 8.333 0 01-8.333 8.333z" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <div className="w-6 h-3 border-2 border-gray-800 dark:border-white rounded-sm flex items-center p-0.5">
          <div className="w-full h-full bg-gray-800 dark:bg-white rounded-xs"></div>
      </div>
    </div>
  </div>
);

const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-[375px] h-[812px] bg-black rounded-[40px] shadow-2xl p-4 relative overflow-hidden border-4 border-gray-800 dark:border-gray-600 transition-colors">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-30"></div>
        <div className="w-full h-full bg-white dark:bg-black rounded-[24px] overflow-hidden relative transition-colors">
            <StatusBar />
            <div className="pt-8 h-full">
                {children}
            </div>
        </div>
    </div>
  );
};

export default AndroidFrame;