import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/Home/HomePage';
import { CatalogPage } from './pages/Catalog/CatalogPage';
import { MoviePage } from './pages/Movie/MoviePage';
import { FavoritesPage } from './pages/Favorites/FavoritesPage';
import { SearchPage } from './pages/Search/SearchPage';
import './App.css';

// Базовий URL для GitHub Pages (якщо потрібно)
const basename = import.meta.env.PROD ? '/movie-theater' : '';

function App() {
  return (
    <Router basename={basename}>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;