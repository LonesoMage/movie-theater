import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast/ToastProvider';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/Home/HomePage';
import { CatalogPage } from './pages/Catalog/CatalogPage';
import { MoviePage } from './pages/Movie/MoviePage';
import { FavoritesPage } from './pages/Favorites/FavoritesPage';
import './App.css';

const basename = import.meta.env.PROD ? '/movie-theater' : '';

function App() {
  return (
    <ToastProvider>
      <Router basename={basename}>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/movie/:id" element={<MoviePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;