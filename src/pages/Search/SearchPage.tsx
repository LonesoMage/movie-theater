import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MovieCard } from '../../components/Movie/MovieCard';
import { Button } from '../../components/UI/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setSearchLoading, setSearchSuccess, setSearchError, setSearchQuery, clearSearch } from '../../store/slices/movieSlice';
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

const SearchSection = styled.section`
  background: #1e293b;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const SearchForm = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  border: 2px solid #374151;
  border-radius: 12px;
  font-size: 18px;
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
`;

const SearchButton = styled(Button)`
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  padding: 16px 32px;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

const QuickSearches = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const QuickSearchLabel = styled.span`
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
`;

const QuickSearchButton = styled(Button)`
  font-size: 14px;
  padding: 6px 12px;
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

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
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
  padding: 80px 20px;
  color: #6b7280;
  background: #1e293b;
  border-radius: 12px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

export const SearchPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchResults, searchLoading, searchError, searchQuery } = useAppSelector(state => state.movies);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const quickSearchTerms = [
    'Marvel', 'Batman', 'Star Wars', 'Harry Potter', 'Avengers', 'Spider'
  ];

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    try {
      dispatch(setSearchLoading(true));
      dispatch(setSearchQuery(query));
      
      const response = await movieService.searchMovies(query);
      dispatch(setSearchSuccess({
        movies: response.movies,
        totalResults: response.totalResults,
        totalPages: response.totalPages
      }));
    } catch (err) {
      console.error('Error searching movies:', err);
      dispatch(setSearchError('Помилка пошуку фільмів'));
    }
  }, [dispatch]);

  const handleSubmit = () => {
    handleSearch(localQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleQuickSearch = (term: string) => {
    setLocalQuery(term);
    handleSearch(term);
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    dispatch(clearSearch());
  };

  const handleViewDetails = (id: string) => {
    navigate(`/movie/${id}`);
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Пошук фільмів</Title>
          <Subtitle>Знайдіть свій ідеальний фільм серед тисяч варіантів</Subtitle>
        </HeaderContent>
      </Header>

      <MainContent>
        <SearchSection>
          <SearchForm>
            <SearchInput
              type="text"
              placeholder="Введіть назву фільму, актора або режисера..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchButton onClick={handleSubmit} disabled={!localQuery.trim()}>
              🔍 Знайти
            </SearchButton>
            {searchQuery && (
              <Button variant="outline" onClick={handleClearSearch}>
                Очистити
              </Button>
            )}
          </SearchForm>

          <QuickSearches>
            <QuickSearchLabel>Популярні пошуки:</QuickSearchLabel>
            {quickSearchTerms.map(term => (
              <QuickSearchButton
                key={term}
                variant="ghost"
                size="small"
                onClick={() => handleQuickSearch(term)}
              >
                {term}
              </QuickSearchButton>
            ))}
          </QuickSearches>
        </SearchSection>

        <ResultsSection>
          {searchLoading ? (
            <LoadingSpinner>Пошук фільмів...</LoadingSpinner>
          ) : searchError ? (
            <ErrorMessage>
              {searchError}
              <br />
              <Button onClick={() => handleSearch(localQuery)} style={{ marginTop: '16px' }}>
                Спробувати знову
              </Button>
            </ErrorMessage>
          ) : searchQuery ? (
            <>
              <ResultsHeader>
                <ResultsCount>
                  Знайдено {searchResults.length} результатів для "{searchQuery}"
                </ResultsCount>
              </ResultsHeader>
              
              {searchResults.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>🔍</EmptyIcon>
                  <h3>Нічого не знайдено</h3>
                  <p>Спробуйте інший пошуковий запит</p>
                </EmptyState>
              ) : (
                <MovieGrid>
                  {searchResults.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </MovieGrid>
              )}
            </>
          ) : (
            <EmptyState>
              <EmptyIcon>🎬</EmptyIcon>
              <h3>Почніть пошук</h3>
              <p>Введіть назву фільму, щоб знайти те, що шукаєте</p>
            </EmptyState>
          )}
        </ResultsSection>
      </MainContent>
    </Container>
  );
};