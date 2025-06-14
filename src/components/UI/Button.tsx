import { type ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled.button<ButtonProps>`
  padding: ${props => {
    switch (props.size) {
      case 'small': return '8px 16px';
      case 'large': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  }};
  
  border-radius: 8px;
  border: 2px solid;
  cursor: pointer;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: #475569;
          border-color: #475569;
          color: white;
          &:hover:not(:disabled) { 
            background-color: #334155; 
            border-color: #334155; 
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border-color: #3b82f6;
          color: #3b82f6;
          &:hover:not(:disabled) { 
            background-color: #3b82f6; 
            color: white; 
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          border-color: transparent;
          color: #64748b;
          &:hover:not(:disabled) { 
            background-color: #1e293b; 
            color: #f8fafc; 
          }
        `;
      default:
        return `
          background-color: #3b82f6;
          border-color: #3b82f6;
          color: white;
          &:hover:not(:disabled) { 
            background-color: #2563eb; 
            border-color: #2563eb; 
          }
        `;
    }
  }}
  
  ${props => props.disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    &:hover { 
      background-color: ${props.variant === 'outline' || props.variant === 'ghost' ? 'transparent' : '#3b82f6'}; 
    }
  `}
`;

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </StyledButton>
  );
};