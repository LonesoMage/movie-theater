import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { ToastContext, type Toast } from './ToastContext';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

const ToastItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['type', 'isLeaving'].includes(prop),
})<{ type: Toast['type']; isLeaving: boolean }>`
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  animation: ${props => props.isLeaving ? slideOut : slideIn} 0.3s ease;
  cursor: pointer;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9));
          color: white;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'error':
        return `
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
          color: white;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9));
          color: white;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'info':
        return `
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9));
          color: white;
          border: 1px solid rgba(59, 130, 246, 0.3);
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
`;

const ToastIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const ToastMessage = styled.span`
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [leavingToasts, setLeavingToasts] = useState<Set<string>>(new Set());

  const hideToast = useCallback((id: string) => {
    setLeavingToasts(prev => new Set(prev).add(id));
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      setLeavingToasts(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'], duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  }, [hideToast]);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            type={toast.type}
            isLeaving={leavingToasts.has(toast.id)}
            onClick={() => hideToast(toast.id)}
          >
            <ToastIcon>{getIcon(toast.type)}</ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
            <CloseButton onClick={(e) => {
              e.stopPropagation();
              hideToast(toast.id);
            }}>
              ×
            </CloseButton>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};