import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MovieCard } from '../../components/Movie/MovieCard';
import { Button } from '../../components/UI/Button';
import { SkeletonGrid } from '../../components/UI/SkeletonGrid';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useToast } from '../../hooks/useToast';
import { setPopularMoviesLoading, setPopularMoviesSuccess, setPopularMoviesError } from '../../store/slices/movieSlice';
import { movieService } from '../../services/movieService';

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
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
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
  position: relative;
`;

const SearchInput = styled.input<{ isLoading?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #374151;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: #0f172a;
  color: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #6b7280;
  }
  
  ${props => props.isLoading && `
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const SearchButton = styled(Button)<{ isLoading?: boolean }>`
  position: relative;
  min-width: 100px;
  
  ${props => props.isLoading && `
    opacity: 0.8;
    pointer-events: none;
  `}
`;

const SearchLoadingSpinner = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #374151;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
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
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    color: white;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
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
  font-weight: 600;
`;

const SearchStats = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
`;

const PaginationContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PageButton = styled(Button)`
  min-width: 40px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 18px;
  color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
  border-radius: 16px;
  margin: 24px 0;
  border: 1px solid rgba(239, 68, 68, 0.2);
  backdrop-filter: blur(10px);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.6;
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
  line-height: 1.6;
`;

const RetryButton = styled(Button)`
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border: none;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

interface SearchFilters {
  year?: string;
  type?: string;
}

export const CatalogPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { popularMovies, popularMoviesLoading, popularMoviesError, currentPage, totalPages } = useAppSelector(state => state.movies);
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [year, setYear] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);

  const types = [
    { value: 'all', label: 'Усі' },
    { value: 'movie', label: 'Фільми' },
    { value: 'series', label: 'Серіали' },
  ];

  const loadMovies = useCallback(async (page = 1, searchQuery = '', movieYear = '', type = 'all') => {
    try {
      dispatch(setPopularMoviesLoading(true));
      
      if (searchQuery.trim()) {
        setSearchLoading(true);
        setIsSearching(true);
      }
      
      let response;
      if (searchQuery.trim()) {
        const filters: SearchFilters = {};
        if (movieYear) filters.year = movieYear;
        if (type !== 'all') filters.type = type;
        response = await movieService.searchMovies(searchQuery, page, filters);
        
        // Показати toast з результатами пошуку
        const searchTime = Date.now() - lastSearchTime;
        if (searchTime > 100) { // Уникаємо спаму toast-ів
          showToast(
            `Знайдено ${response.movies.length} результатів за "${searchQuery}"`,
            response.movies.length > 0 ? 'success' : 'info'
          );
        }
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
      const errorMessage = 'Помилка завантаження фільмів';
      dispatch(setPopularMoviesError(errorMessage));
      showToast(errorMessage, 'error');
    } finally {
      setSearchLoading(false);
    }
  }, [dispatch, showToast, lastSearchTime]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleSearch = () => {
    if (searchLoading) return;
    
    setLastSearchTime(Date.now());
    loadMovies(1, localSearchQuery, year, selectedType);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searchLoading) {
      handleSearch();
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    
    // Автоматичний пошук при зміні типу, якщо є пошуковий запит
    if (localSearchQuery.trim()) {
      setTimeout(() => {
        loadMovies(1, localSearchQuery, year, type);
      }, 100);
    }
  };

  const handlePageChange = (page: number) => {
    loadMovies(page, localSearchQuery, year, selectedType);
    
    // Плавна прокрутка до початку результатів
    const resultsSection = document.querySelector('[data-results-section]');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/movie/${id}`);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    setYear('');
    setSelectedType('all');
    loadMovies(1);
    showToast('Фільтри очищено', 'info');
  };

  const handleRetry = () => {
    loadMovies(currentPage, localSearchQuery, year, selectedType);
    showToast('Повторне завантаження...', 'info');
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
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
                  isLoading={searchLoading}
                />
                {searchLoading && <SearchLoadingSpinner />}
                <SearchButton 
                  onClick={handleSearch}
                  isLoading={searchLoading}
                  disabled={searchLoading}
                >
                  {searchLoading ? 'Пошук...' : 'Знайти'}
                </SearchButton>
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
              <RetryButton variant="outline" onClick={handleClearFilters}>
                Очистити фільтри
              </RetryButton>
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

        <ResultsSection data-results-section>
          <ResultsHeader>
            <div>
              <ResultsCount>
                {isSearching ? `Результати пошуку: ${popularMovies.length}` : `Показано ${popularMovies.length} фільмів`}
              </ResultsCount>
              {isSearching && localSearchQuery && (
                <SearchStats>
                  за запитом "{localSearchQuery}"
                  {year && ` • рік: ${year}`}
                  {selectedType !== 'all' && ` • тип: ${types.find(t => t.value === selectedType)?.label}`}
                </SearchStats>
              )}
            </div>
            
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

          {popularMoviesLoading ? (
            <SkeletonGrid count={12} />
          ) : popularMoviesError ? (
            <ErrorMessage>
              <div style={{ marginBottom: '16px' }}>
                <strong>Упс! Щось пішло не так</strong>
              </div>
              {popularMoviesError}
              <br />
              <RetryButton onClick={handleRetry} style={{ marginTop: '16px' }}>
                🔄 Спробувати знову
              </RetryButton>
            </ErrorMessage>
          ) : popularMovies.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>
                {isSearching ? 'Нічого не знайдено' : 'Фільми недоступні'}
              </EmptyTitle>
              <EmptyDescription>
                {isSearching 
                  ? 'Спробуйте змінити параметри пошуку або використати інші ключові слова'
                  : 'На даний момент фільми недоступні. Спробуйте пізніше.'
                }
              </EmptyDescription>
              <RetryButton onClick={isSearching ? handleClearFilters : handleRetry}>
                {isSearching ? '🗑️ Очистити всі фільтри' : '🔄 Оновити'}
              </RetryButton>
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