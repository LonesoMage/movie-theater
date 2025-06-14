import styled from 'styled-components';
import { useState } from 'react';
import type { Movie } from '../../types/movie';
import { Button } from '../UI/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import { useToast } from '../../hooks/useToast';

interface MovieCardProps {
  movie: Movie;
  onViewDetails?: (id: string) => void;
}

const Card = styled.div`
  background: #1e293b;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const FallbackIcon = styled.div`
  font-size: 48px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const FavoriteButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isFavorite',
})<{ isFavorite: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.isFavorite ? '#ef4444' : '#64748b'};
  
  &:hover {
    background: rgba(15, 23, 42, 0.9);
    transform: scale(1.1);
    color: ${props => props.isFavorite ? '#dc2626' : '#f87171'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TypeBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 4px;
  text-transform: capitalize;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #f8fafc;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PlaceholderText = styled.p`
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  flex: 1;
  font-style: italic;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: #64748b;
`;

const Year = styled.span`
  font-weight: 600;
  color: #94a3b8;
`;

const Type = styled.span`
  text-transform: capitalize;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const DetailsButton = styled(Button)`
  flex: 1;
`;

export const MovieCard = ({ movie, onViewDetails }: MovieCardProps) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.favorites);
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isFavorite = favorites.some(fav => fav.movieId === movie.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
      showToast(`"${movie.title}" видалено з обраних`, 'info');
    } else {
      dispatch(addToFavorites(movie.id));
      showToast(`"${movie.title}" додано до обраних`, 'success');
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'movie': return '🎬';
      case 'series': return '📺';
      case 'episode': return '📹';
      default: return '🎭';
    }
  };

  const getTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case 'movie': return 'фільм';
      case 'series': return 'серіал';
      case 'episode': return 'епізод';
      default: return type;
    }
  };

  const posterUrl = movie.poster && movie.poster !== 'N/A' ? movie.poster : null;

  return (
    <Card data-testid="movie-card">
      <ImageContainer>
        {!imageError && posterUrl ? (
          <Image 
            src={posterUrl}
            alt={movie.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        ) : null}
        
        {(imageError || !posterUrl || imageLoading) && (
          <FallbackIcon>
            {getTypeIcon(movie.type)}
          </FallbackIcon>
        )}
        
        <FavoriteButton 
          isFavorite={isFavorite}
          onClick={handleToggleFavorite}
          data-testid="favorite-button"
          title={isFavorite ? 'Видалити з обраних' : 'Додати до обраних'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </FavoriteButton>

        <TypeBadge>
          {getTypeIcon(movie.type)} {getTypeText(movie.type)}
        </TypeBadge>
      </ImageContainer>
      
      <Content>
        <Title data-testid="movie-title">{movie.title}</Title>
        <PlaceholderText>
          Натисніть "Деталі", щоб переглянути повну інформацію про цей {getTypeText(movie.type)}.
        </PlaceholderText>
        
        <MetaInfo>
          <Year>{movie.year}</Year>
          <Type>{getTypeText(movie.type)}</Type>
        </MetaInfo>
        
        <ButtonGroup>
          <DetailsButton 
            size="small"
            onClick={() => onViewDetails?.(movie.id)}
          >
            Деталі
          </DetailsButton>
        </ButtonGroup>
      </Content>
    </Card>
  );
};