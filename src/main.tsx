import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BottomSheetProvider } from '@/src/context/BottomSheetContext';
import BottomSheet from '@/src/components/common/BottomSheet';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BottomSheetProvider>
      <App />
      <BottomSheet />
    </BottomSheetProvider>
  </StrictMode>
);
