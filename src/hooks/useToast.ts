import { useContext } from 'react';
import { ToastContext } from '../components/Toast/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast має використовуватися всередині ToastProvider');
  }
  return context;
};