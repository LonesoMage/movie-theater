import styled from 'styled-components';
import { SkeletonBox, SkeletonText, SkeletonTitle } from './Skeleton';

const SkeletonHeroSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 60vh;
  display: flex;
  align-items: center;
  background: #1e293b;
  overflow: hidden;
`;

const SkeletonHeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: center;
  width: 100%;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonPosterContainer = styled.div`
  width: 320px;
  height: 480px;
  border-radius: 16px;
  overflow: hidden;
  
  @media (max-width: 968px) {
    width: 280px;
    height: 420px;
    margin: 0 auto;
  }
`;

const SkeletonMovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkeletonDetailsSection = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const SkeletonDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
`;

const SkeletonDetailCard = styled.div`
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

export const MovieDetailsSkeleton = () => {
  return (
    <>
      <SkeletonHeroSection>
        <SkeletonHeroContent>
          <SkeletonPosterContainer>
            <SkeletonBox height="100%" />
          </SkeletonPosterContainer>

          <SkeletonMovieInfo>
            <SkeletonTitle width="90%" />
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <SkeletonText width="80px" />
              <SkeletonText width="60px" />
              <SkeletonText width="100px" />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <SkeletonBox width="100px" height="60px" />
              <SkeletonBox width="100px" height="60px" />
              <SkeletonBox width="100px" height="60px" />
            </div>
            <SkeletonBox width="200px" height="48px" />
            <SkeletonText width="100%" />
            <SkeletonText width="100%" />
            <SkeletonText width="80%" />
          </SkeletonMovieInfo>
        </SkeletonHeroContent>
      </SkeletonHeroSection>

      <SkeletonDetailsSection>
        <SkeletonTitle width="300px" style={{ textAlign: 'center', margin: '0 auto 32px' }} />
        
        <SkeletonDetailsGrid>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonDetailCard key={index}>
              <SkeletonTitle width="150px" />
              <SkeletonText width="100%" />
              <SkeletonText width="90%" />
              <SkeletonText width="70%" />
            </SkeletonDetailCard>
          ))}
        </SkeletonDetailsGrid>
      </SkeletonDetailsSection>
    </>
  );
};