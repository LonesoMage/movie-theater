import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/UI/Button';
import { MovieDetailsSkeleton } from '../../components/UI/MovieDetailsSkeleton';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useToast } from '../../hooks/useToast';
import { setCurrentMovieLoading, setCurrentMovieSuccess, setCurrentMovieError, clearCurrentMovie } from '../../store/slices/movieSlice';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { movieService } from '../../services/movieService';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0f172a;
  margin: 0;
  padding: 0;
`;

const BackButton = styled(Button)`
  position: fixed;
  top: 100px;
  left: 20px;
  z-index: 100;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid #374151;
  
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    left: auto;
    margin: 20px;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 18px;
  color: #64748b;
  background: #1e293b;
  border-radius: 16px;
  margin: 40px 20px;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  text-align: center;
  
  h2 {
    color: #ef4444;
    margin-bottom: 16px;
  }
  
  p {
    color: #94a3b8;
    margin-bottom: 24px;
  }
`;

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 60vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  overflow: hidden;
`;

const HeroBackground = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'poster',
})<{ poster?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => props.poster ? `url(${props.poster})` : 'none'};
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.3);
  transform: scale(1.1);
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.8) 0%,
    rgba(30, 41, 59, 0.6) 50%,
    rgba(51, 65, 85, 0.8) 100%
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: center;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const PosterContainer = styled.div`
  width: 320px;
  height: 480px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 968px) {
    width: 280px;
    height: 420px;
    margin: 0 auto;
  }
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PosterFallback = styled.div`
  font-size: 64px;
  color: #64748b;
`;

const MovieInfo = styled.div`
  color: white;
`;

const MovieTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #fff, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const MovieMeta = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #94a3b8;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const RatingItem = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  text-align: center;
  
  .rating-value {
    font-size: 20px;
    font-weight: 700;
    color: #3b82f6;
    display: block;
  }
  
  .rating-source {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FavoriteButton = styled(Button).withConfig({
  shouldForwardProp: (prop) => prop !== 'isFavorite',
})<{ isFavorite: boolean }>`
  background: ${props => props.isFavorite 
    ? 'linear-gradient(45deg, #ef4444, #dc2626)' 
    : 'linear-gradient(45deg, #374151, #4b5563)'};
  border: none;
  box-shadow: 0 4px 15px ${props => props.isFavorite 
    ? 'rgba(239, 68, 68, 0.3)' 
    : 'rgba(0, 0, 0, 0.3)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.isFavorite 
      ? 'rgba(239, 68, 68, 0.4)' 
      : 'rgba(0, 0, 0, 0.4)'};
  }
`;

const PlotText = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #e2e8f0;
  max-width: 800px;
  
  @media (max-width: 968px) {
    text-align: left;
  }
`;

const DetailsSection = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 32px;
  text-align: center;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
`;

const DetailCard = styled.div`
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const DetailTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #3b82f6;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailContent = styled.div`
  color: #e2e8f0;
  line-height: 1.6;
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GenreTag = styled.span`
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const ActorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActorItem = styled.div`
  color: #e2e8f0;
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  font-size: 16px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

export const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  const { currentMovie, currentMovieLoading, currentMovieError } = useAppSelector(state => state.movies);
  const favorites = useAppSelector(state => state.favorites.favorites);

  const isFavorite = currentMovie ? favorites.some((fav) => fav.movieId === currentMovie.id) : false;

  const loadMovie = useCallback(async (movieId: string) => {
    try {
      dispatch(setCurrentMovieLoading(true));
      const movie = await movieService.getMovieById(movieId);
      dispatch(setCurrentMovieSuccess(movie));
    } catch {
      dispatch(setCurrentMovieError('Помилка завантаження деталей фільму'));
    }
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      loadMovie(id);
    }
    
    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [id, loadMovie, dispatch]);

  const handleToggleFavorite = () => {
    if (!currentMovie) return;
    
    if (isFavorite) {
      dispatch(removeFromFavorites(currentMovie.id));
      showToast(`"${currentMovie.title}" видалено з обраних`, 'info');
    } else {
      dispatch(addToFavorites(currentMovie.id));
      showToast(`"${currentMovie.title}" додано до обраних`, 'success');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getMovieIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'movie': return '🎬';
      case 'series': return '📺';
      case 'episode': return '📹';
      default: return '🎭';
    }
  };

  if (currentMovieLoading) {
    return (
      <Container>
        <BackButton onClick={handleBack} variant="outline">
          ← Назад
        </BackButton>
        <LoadingContainer>Завантаження деталей фільму...</LoadingContainer>
        <MovieDetailsSkeleton />
      </Container>
    );
  }

  if (currentMovieError || !currentMovie) {
    return (
      <Container>
        <ErrorMessage>
          <h2>Помилка завантаження</h2>
          <p>{currentMovieError || 'Фільм не знайдено'}</p>
          <Button onClick={handleBack}>Повернутися назад</Button>
        </ErrorMessage>
      </Container>
    );
  }

  const actors = currentMovie.actors && currentMovie.actors !== 'N/A' 
    ? currentMovie.actors.split(', ').filter((actor) => actor.trim())
    : [];

  const genres = currentMovie.genre && currentMovie.genre !== 'N/A'
    ? currentMovie.genre.split(', ').filter((genre) => genre.trim())
    : [];

  return (
    <Container>
      <BackButton onClick={handleBack} variant="outline">
        ← Назад
      </BackButton>

      <HeroSection>
        {currentMovie.poster && currentMovie.poster !== 'N/A' && (
          <HeroBackground poster={currentMovie.poster} />
        )}
        <HeroOverlay />
        
        <HeroContent>
          <PosterContainer>
            {currentMovie.poster && currentMovie.poster !== 'N/A' ? (
              <PosterImage src={currentMovie.poster} alt={currentMovie.title} />
            ) : (
              <PosterFallback>{getMovieIcon(currentMovie.type)}</PosterFallback>
            )}
          </PosterContainer>

          <MovieInfo>
            <MovieTitle>{currentMovie.title}</MovieTitle>
            
            <MovieMeta>
              <MetaItem>
                <span>📅</span>
                <span>{currentMovie.year}</span>
              </MetaItem>
              <MetaItem>
                <span>⏱️</span>
                <span>{currentMovie.runtime}</span>
              </MetaItem>
              <MetaItem>
                <span>{getMovieIcon(currentMovie.type)}</span>
                <span>{currentMovie.type === 'movie' ? 'Фільм' : currentMovie.type === 'series' ? 'Серіал' : 'Епізод'}</span>
              </MetaItem>
              {currentMovie.rated && currentMovie.rated !== 'N/A' && (
                <MetaItem>
                  <span>🏷️</span>
                  <span>{currentMovie.rated}</span>
                </MetaItem>
              )}
            </MovieMeta>

            {currentMovie.ratings && currentMovie.ratings.length > 0 && (
              <RatingContainer>
                {currentMovie.ratings.slice(0, 3).map((rating, index) => (
                  <RatingItem key={index}>
                    <span className="rating-value">{rating.Value}</span>
                    <div className="rating-source">{rating.Source}</div>
                  </RatingItem>
                ))}
              </RatingContainer>
            )}

            <ActionButtons>
              <FavoriteButton
                isFavorite={isFavorite}
                onClick={handleToggleFavorite}
                size="large"
              >
                {isFavorite ? '❤️ Видалити з обраних' : '🤍 Додати до обраних'}
              </FavoriteButton>
            </ActionButtons>

            {currentMovie.plot && currentMovie.plot !== 'N/A' && (
              <PlotText>{currentMovie.plot}</PlotText>
            )}
          </MovieInfo>
        </HeroContent>
      </HeroSection>

      <DetailsSection>
        <SectionTitle>Детальна інформація</SectionTitle>
        
        <DetailsGrid>
          <DetailCard>
            <DetailTitle>
              <span>🎭</span>
              Жанри
            </DetailTitle>
            <DetailContent>
              {genres.length > 0 ? (
                <GenreList>
                  {genres.map((genre, index) => (
                    <GenreTag key={index}>{genre}</GenreTag>
                  ))}
                </GenreList>
              ) : (
                <span>Інформація недоступна</span>
              )}
            </DetailContent>
          </DetailCard>

          <DetailCard>
            <DetailTitle>
              <span>🎬</span>
              Режисер
            </DetailTitle>
            <DetailContent>
              {currentMovie.director && currentMovie.director !== 'N/A' 
                ? currentMovie.director 
                : 'Інформація недоступна'}
            </DetailContent>
          </DetailCard>

          <DetailCard>
            <DetailTitle>
              <span>✍️</span>
              Сценарист
            </DetailTitle>
            <DetailContent>
              {currentMovie.writer && currentMovie.writer !== 'N/A' 
                ? currentMovie.writer 
                : 'Інформація недоступна'}
            </DetailContent>
          </DetailCard>

          <DetailCard>
            <DetailTitle>
              <span>🌍</span>
              Країна та мова
            </DetailTitle>
            <DetailContent>
              <div>
                <strong>Країна:</strong> {currentMovie.country && currentMovie.country !== 'N/A' 
                  ? currentMovie.country 
                  : 'Інформація недоступна'}
              </div>
              <div style={{ marginTop: '8px' }}>
                <strong>Мова:</strong> {currentMovie.language && currentMovie.language !== 'N/A' 
                  ? currentMovie.language 
                  : 'Інформація недоступна'}
              </div>
            </DetailContent>
          </DetailCard>

          <DetailCard>
            <DetailTitle>
              <span>🏆</span>
              Нагороди
            </DetailTitle>
            <DetailContent>
              {currentMovie.awards && currentMovie.awards !== 'N/A' 
                ? currentMovie.awards 
                : 'Інформація недоступна'}
            </DetailContent>
          </DetailCard>

          <DetailCard>
            <DetailTitle>
              <span>👥</span>
              Акторський склад
            </DetailTitle>
            <DetailContent>
              {actors.length > 0 ? (
                <ActorsList>
                  {actors.slice(0, 8).map((actor, index) => (
                    <ActorItem key={index}>
                      {actor}
                    </ActorItem>
                  ))}
                  {actors.length > 8 && (
                    <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', marginTop: '8px' }}>
                      та ще {actors.length - 8} {actors.length - 8 === 1 ? 'актор' : 'акторів'}...
                    </div>
                  )}
                </ActorsList>
              ) : (
                <span>Інформація недоступна</span>
              )}
            </DetailContent>
          </DetailCard>
        </DetailsGrid>
      </DetailsSection>
    </Container>
  );
};