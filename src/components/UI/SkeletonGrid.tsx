import styled from 'styled-components';
import { MovieCardSkeleton } from './MovieCardSkeleton';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

interface SkeletonGridProps {
  count?: number;
}

export const SkeletonGrid = ({ count = 8 }: SkeletonGridProps) => {
  return (
    <Grid>
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </Grid>
  );
};