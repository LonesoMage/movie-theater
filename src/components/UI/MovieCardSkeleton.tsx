import styled from 'styled-components';
import { SkeletonBox, SkeletonText, SkeletonTitle } from './Skeleton';

const SkeletonCard = styled.div`
  background: #1e293b;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SkeletonImageContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
`;

const SkeletonContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SkeletonMetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SkeletonButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

export const MovieCardSkeleton = () => {
  return (
    <SkeletonCard>
      <SkeletonImageContainer>
        <SkeletonBox height="100%" />
      </SkeletonImageContainer>
      
      <SkeletonContent>
        <SkeletonTitle width="90%" />
        <SkeletonText width="100%" />
        <SkeletonText width="80%" />
        <SkeletonText width="60%" />
        
        <SkeletonMetaInfo>
          <SkeletonText width="60px" />
          <SkeletonText width="80px" />
        </SkeletonMetaInfo>
        
        <SkeletonButtonGroup>
          <SkeletonBox height="36px" width="100%" />
        </SkeletonButtonGroup>
      </SkeletonContent>
    </SkeletonCard>
  );
};