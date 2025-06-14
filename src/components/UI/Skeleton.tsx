import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

export const SkeletonBox = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
`;

export const SkeletonText = styled(SkeletonBase)<{ width?: string }>`
  height: 16px;
  width: ${props => props.width || '100%'};
  margin-bottom: 8px;
`;

export const SkeletonTitle = styled(SkeletonBase)<{ width?: string }>`
  height: 24px;
  width: ${props => props.width || '80%'};
  margin-bottom: 12px;
`;
