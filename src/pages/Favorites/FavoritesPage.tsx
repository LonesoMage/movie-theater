import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MovieCard } from '../../components/Movie/MovieCard';
import { Button } from '../../components/UI/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { clearFavorites } from '../../store/slices/favoritesSlice';
import { movieService } from '../../services/movieService';
import type { Movie } from '../../types/movie';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0f172a;
  margin: 0;
  padding: 0;
`;

const Header = styled.section`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
  width: 100%;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #fff, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 20px;
  opacity: 0.9;
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
`;

const StatsSection = styled.section`
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #ef4444;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #94a3b8;
  font-weight: 600;
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid #374151;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const FavoritesInfo = styled.div`
  color: #e2e8f0;
  font-size: 16px;
`;

const ClearButton = styled(Button)`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border: none;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const MoviesSection = styled.section``;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 18px;
  color: #64748b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
  background: #1e293b;
  border-radius: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  color: #e2e8f0;
  margin-bottom: 16px;
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const BrowseButton = styled(Button)`
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border: none;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
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

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.favorites);
  
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavoriteMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const moviePromises = favorites.map(favorite => 
        movieService.getMovieById(favorite.movieId)
      );
      
      const movies = await Promise.all(moviePromises);
      const validMovies = movies
        .filter(movie => movie !== null)
        .map(movie => ({
          id: movie!.id,
          title: movie!.title,
          year: movie!.year,
          poster: movie!.poster,
          type: movie!.type,
        }));
      
      setFavoriteMovies(validMovies);
    } catch (err) {
      console.error('Error loading favorite movies:', err);
      setError('Помилка завантаження обраних фільмів');
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  useEffect(() => {
    if (favorites.length > 0) {
      loadFavoriteMovies();
    } else {
      setFavoriteMovies([]);
    }
  }, [favorites, loadFavoriteMovies]);

  const handleViewDetails = (id: string) => {
    navigate(`/movie/${id}`);
  };

  const handleClearFavorites = () => {
    if (window.confirm('Ви впевнені, що хочете видалити всі обрані фільми?')) {
      dispatch(clearFavorites());
      setFavoriteMovies([]);
    }
  };

  const handleBrowseMovies = () => {
    navigate('/catalog');
  };

  const getMovieTypeStats = () => {
    const stats = favoriteMovies.reduce((acc: Record<string, number>, movie) => {
      const type = movie.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return stats;
  };

  const getYearStats = () => {
    const currentYear = new Date().getFullYear();
    const recentMovies = favoriteMovies.filter(movie => {
      const year = parseInt(movie.year);
      return year >= currentYear - 5;
    }).length;

    return recentMovies;
  };

  const typeStats = getMovieTypeStats();
  const recentMoviesCount = getYearStats();

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <Title>Обрані фільми</Title>
            <Subtitle>Ваша персональна колекція</Subtitle>
          </HeaderContent>
        </Header>
        <MainContent>
          <LoadingSpinner>Завантаження обраних фільмів...</LoadingSpinner>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Обрані фільми</Title>
          <Subtitle>
            {favorites.length === 0 
              ? 'Почніть додавати фільми до своєї колекції'
              : `${favorites.length} ${favorites.length === 1 ? 'фільм' : favorites.length < 5 ? 'фільми' : 'фільмів'} у вашій колекції`
            }
          </Subtitle>
        </HeaderContent>
      </Header>

      <MainContent>
        {favorites.length > 0 && (
          <StatsSection>
            <StatsGrid>
              <StatCard>
                <StatValue>{favorites.length}</StatValue>
                <StatLabel>Усього фільмів</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{typeStats.movie || 0}</StatValue>
                <StatLabel>Фільми</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{typeStats.series || 0}</StatValue>
                <StatLabel>Серіали</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{recentMoviesCount}</StatValue>
                <StatLabel>Нові (останні 5 років)</StatLabel>
              </StatCard>
            </StatsGrid>
            
            <ActionsRow>
              <FavoritesInfo>
                Останній раз оновлено: {new Date().toLocaleDateString('uk-UA')}
              </FavoritesInfo>
              <ClearButton
                variant="secondary"
                onClick={handleClearFavorites}
                disabled={favorites.length === 0}
              >
                🗑️ Очистити всі
              </ClearButton>
            </ActionsRow>
          </StatsSection>
        )}

        <MoviesSection>
          {error ? (
            <ErrorMessage>
              {error}
              <br />
              <Button onClick={loadFavoriteMovies} style={{ marginTop: '16px' }}>
                Спробувати знову
              </Button>
            </ErrorMessage>
          ) : favorites.length === 0 ? (
            <EmptyState>
              <EmptyIcon>💔</EmptyIcon>
              <EmptyTitle>Ваша колекція порожня</EmptyTitle>
              <EmptyDescription>
                Додайте фільми до обраних, щоб легко знаходити їх пізніше. 
                Натисніть на іконку серця на будь-якому фільмі, щоб додати його до колекції.
              </EmptyDescription>
              <BrowseButton onClick={handleBrowseMovies}>
                🎬 Переглянути каталог
              </BrowseButton>
            </EmptyState>
          ) : (
            <MoviesGrid>
              {favoriteMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </MoviesGrid>
          )}
        </MoviesSection>
      </MainContent>
    </Container>
  );
};