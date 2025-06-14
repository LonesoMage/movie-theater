import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MovieCard } from '../../components/Movie/MovieCard';
import { Button } from '../../components/UI/Button';
import { useAppDispatch } from '../../hooks/redux';
import { setPopularMoviesLoading, setPopularMoviesError } from '../../store/slices/movieSlice';
import { movieService } from '../../services/movieService';
import type { Movie } from '../../types/movie';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: #0f172a;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  color: white;
  padding: 120px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="movies" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><text x="50" y="50" font-size="30" text-anchor="middle" fill="rgba(255,255,255,0.05)">🎬</text></pattern></defs><rect width="1000" height="1000" fill="url(%23movies)"/></svg>');
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 72px;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(45deg, #fff, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const HeroButton = styled(Button)`
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border: none;
  padding: 20px 40px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
  }
`;

const FeaturedSection = styled.section`
  padding: 100px 0;
  background: #0f172a;
  width: 100%;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const SectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: #f8fafc;
  background: linear-gradient(45deg, #f8fafc, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
`;

const ViewAllButton = styled(Button)`
  margin: 60px auto 0;
  display: block;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  padding: 16px 32px;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 18px;
  color: #64748b;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 18px;
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  margin: 24px 0;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);

  const loadFeaturedMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      dispatch(setPopularMoviesLoading(true));
      
      const response = await movieService.getTopRatedMovies();
      setFeaturedMovies(response.movies);
    } catch (err) {
      const errorMessage = 'Помилка завантаження рекомендованих фільмів';
      console.error('Error loading featured movies:', err);
      setError(errorMessage);
      dispatch(setPopularMoviesError(errorMessage));
    } finally {
      setLoading(false);
      dispatch(setPopularMoviesLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadFeaturedMovies();
  }, [loadFeaturedMovies]);

  const handleViewDetails = (id: string) => {
    navigate(`/movie/${id}`);
  };

  const handleViewCatalog = () => {
    navigate('/catalog');
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Відкрийте дивовижне кіно</HeroTitle>
          <HeroSubtitle>
            Досліджуйте тисячі фільмів, знаходьте улюблені та відкривайте нові кінематографічні переживання.
            Від блокбастерів до незалежного кіно - ваш наступний чудовий перегляд вже чекає.
          </HeroSubtitle>
          <HeroButton onClick={handleViewCatalog}>
            Дослідити каталог фільмів
          </HeroButton>
        </HeroContent>
      </HeroSection>

      <FeaturedSection>
        <SectionContainer>
          <SectionTitle>Рекомендовані фільми</SectionTitle>
          {loading ? (
            <LoadingSpinner>Завантаження рекомендованих фільмів...</LoadingSpinner>
          ) : error ? (
            <ErrorMessage>
              {error}
              <br />
              <Button onClick={loadFeaturedMovies} style={{ marginTop: '16px' }}>
                Спробувати знову
              </Button>
            </ErrorMessage>
          ) : (
            <>
              <FeaturedGrid>
                {featuredMovies.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </FeaturedGrid>
              {featuredMovies.length > 0 && (
                <ViewAllButton onClick={handleViewCatalog}>
                  Переглянути всі фільми
                </ViewAllButton>
              )}
            </>
          )}
        </SectionContainer>
      </FeaturedSection>
    </Container>
  );
};