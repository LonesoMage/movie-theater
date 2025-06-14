import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../UI/Button';
import { useAppSelector } from '../../hooks/redux';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #334155;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const NavLink = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 16px;
  border-radius: 8px;
  position: relative;
  
  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
  
  ${props => props.active && `
    background: rgba(59, 130, 246, 0.2);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: #3b82f6;
      border-radius: 50%;
    }
  `}
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const FavoritesSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FavoritesInfo = styled.div`
  text-align: right;
  font-size: 14px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FavoritesButton = styled(Button)`
  position: relative;
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border: none;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
`;

const FavoritesBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
`;

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const favorites = useAppSelector(state => state.favorites.favorites);
  const favoritesCount = favorites.length;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <HeaderContainer>
      <Container>
        <Logo onClick={() => handleNavigation('/')}>
          🎬 КіноТеатр
        </Logo>
        
        <Nav>
          <NavLink 
            active={isActive('/')} 
            onClick={() => handleNavigation('/')}
          >
            Головна
          </NavLink>
          <NavLink 
            active={isActive('/catalog')} 
            onClick={() => handleNavigation('/catalog')}
          >
            Каталог
          </NavLink>
        </Nav>
        
        <RightSection>
          <FavoritesSection>
            <FavoritesInfo data-testid="favorites-info">
              <div style={{ fontWeight: '600' }}>
                {favoritesCount} {favoritesCount === 1 ? 'фільм' : favoritesCount < 5 ? 'фільми' : 'фільмів'}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                в обраних
              </div>
            </FavoritesInfo>
            <FavoritesButton 
              size="small"
              onClick={() => handleNavigation('/favorites')}
              data-testid="favorites-button"
            >
              ❤️ Обрані
              {favoritesCount > 0 && (
                <FavoritesBadge data-testid="favorites-badge">
                  {favoritesCount}
                </FavoritesBadge>
              )}
            </FavoritesButton>
          </FavoritesSection>
        </RightSection>
      </Container>
    </HeaderContainer>
  );
};