import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MovieCard } from '../../components/Movie/MovieCard';
import { Button } from '../../components/UI/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setPopularMoviesLoading, setPopularMoviesSuccess, setPopularMoviesError } from '../../store/slices/movieSlice';
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
  background: linear-gradient(45deg, #fff, #3b82f6);
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

const FiltersSection = styled.section`
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 24px;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #f8fafc;
  font-size: 14px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #374151;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  background: #0f172a;
  color: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: #6b7280;
  }
`;

const YearInput = styled.input`
  width: 120px;
  padding: 8px 12px;
  border: 2px solid #374151;
  border-radius: 8px;
  font-size: 14px;
  background: #0f172a;
  color: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: #6b7280;
  }
`;

const TypeFilters = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 24px;
`;

const TypeButton = styled(Button)<{ active: boolean }>`
  background: ${props => props.active ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' : 'transparent'};
  border: 2px solid ${props => props.active ? '#3b82f6' : '#374151'};
  color: ${props => props.active ? 'white' : '#94a3b8'};
  
  &:hover {
    border-color: #3b82f6;
    color: white;
  }
`;

const ResultsSection = styled.section``;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #1e293b;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ResultsCount = styled.span`
  color: #94a3b8;
  font-size: 16px;
`;

const PaginationContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PageButton = styled(Button)`
  min-width: 40px;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 18px;
  color: #6b7280;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: #6b7280;
  background: #1e293b;
  border-radius: 12px;
`;

export const CatalogPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { popularMovies, popularMoviesLoading, popularMoviesError, currentPage, totalPages } = useAppSelector(state => state.movies);
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [year, setYear] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isSearching, setIsSearching] = useState(false);

  const types = [
    { value: 'all', label: 'Усі' },
    { value: 'movie', label: 'Фільми' },
    { value: 'series', label: 'Серіали' },
  ];

  const loadMovies = useCallback(async (page = 1, searchQuery = '', movieYear = '', type = 'all') => {
    try {
      dispatch(setPopularMoviesLoading(true));
      
      let response;
      if (searchQuery.trim()) {
        setIsSearching(true);
        const filters: any = {};
        if (movieYear) filters.year = movieYear;
        if (type !== 'all') filters.type = type;
        response = await movieService.searchMovies(searchQuery, page, filters);
      } else {
        setIsSearching(false);
        response = await movieService.getPopularMovies(page);
      }
      
      dispatch(setPopularMoviesSuccess({
        movies: response.movies,
        page: page,
        totalPages: response.totalPages,
        totalResults: response.totalResults
      }));
    } catch (err) {
      console.error('Error loading movies:', err);
      dispatch(setPopularMoviesError('Помилка завантаження фільмів'));
    }
  }, [dispatch]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleSearch = () => {
    loadMovies(1, localSearchQuery, year, selectedType);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handlePageChange = (page: number) => {
    loadMovies(page, localSearchQuery, year, selectedType);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/movie/${id}`);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    setYear('');
    setSelectedType('all');
    loadMovies(1);
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PageButton
          key={i}
          variant={i === currentPage ? 'primary' : 'outline'}
          size="small"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    return buttons;
  };

  if (popularMoviesLoading) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <Title>Каталог фільмів</Title>
            <Subtitle>Досліджуйте нашу повну колекцію</Subtitle>
          </HeaderContent>
        </Header>
        <MainContent>
          <LoadingSpinner>Завантаження фільмів...</LoadingSpinner>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Каталог фільмів</Title>
          <Subtitle>Досліджуйте нашу повну колекцію преміальних фільмів та серіалів</Subtitle>
        </HeaderContent>
      </Header>

      <MainContent>
        <FiltersSection>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Пошук фільмів</FilterLabel>
              <SearchContainer>
                <SearchInput
                  type="text"
                  placeholder="Пошук за назвою..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={handleSearch}>Знайти</Button>
              </SearchContainer>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Рік випуску</FilterLabel>
              <YearInput
                type="number"
                placeholder="Наприклад: 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max={new Date().getFullYear()}
              />
            </FilterGroup>

            <FilterGroup>
              <Button variant="outline" onClick={handleClearFilters}>
                Очистити фільтри
              </Button>
            </FilterGroup>
          </FiltersGrid>

          <TypeFilters>
            {types.map(type => (
              <TypeButton
                key={type.value}
                active={selectedType === type.value}
                size="small"
                onClick={() => handleTypeChange(type.value)}
              >
                {type.label}
              </TypeButton>
            ))}
          </TypeFilters>
        </FiltersSection>

        <ResultsSection>
          <ResultsHeader>
            <ResultsCount>
              {isSearching ? `Результати пошуку: ${popularMovies.length}` : `Показано ${popularMovies.length} фільмів`}
            </ResultsCount>
            
            {totalPages > 1 && (
              <PaginationContainer>
                <PageButton
                  variant="outline"
                  size="small"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  ←
                </PageButton>
                
                {getPaginationButtons()}
                
                <PageButton
                  variant="outline"
                  size="small"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  →
                </PageButton>
              </PaginationContainer>
            )}
          </ResultsHeader>

          {popularMoviesError ? (
            <ErrorMessage>
              {popularMoviesError}
              <br />
              <Button onClick={() => loadMovies()} style={{ marginTop: '16px' }}>
                Спробувати знову
              </Button>
            </ErrorMessage>
          ) : popularMovies.length === 0 ? (
            <EmptyState>
              <h3>Фільмів не знайдено</h3>
              <p>Спробуйте змінити параметри пошуку</p>
              <Button onClick={handleClearFilters} style={{ marginTop: '16px' }}>
                Очистити всі фільтри
              </Button>
            </EmptyState>
          ) : (
            <MovieGrid>
              {popularMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </MovieGrid>
          )}
        </ResultsSection>
      </MainContent>
    </Container>
  );
};