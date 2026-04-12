import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface BottomSheetContextType {
  isOpen: boolean;
  content: ReactNode | null;
  showBottomSheet: (content: ReactNode) => void;
  hideBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const showBottomSheet = useCallback((newContent: ReactNode) => {
    setContent(newContent);
    setIsOpen(true);
  }, []);

  const hideBottomSheet = useCallback(() => {
    setIsOpen(false);
    // 可选：加个短暂延迟清空内容，让退出动画播完
    setTimeout(() => {
      setContent(null);
    }, 300);
  }, []);

  return (
    <BottomSheetContext.Provider value={{ isOpen, content, showBottomSheet, hideBottomSheet }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
