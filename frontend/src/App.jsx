import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForecastPage from './pages/forecast/ForecastPage';
import SudokuPage from './pages/sudoku/SudokuPage';
import SudokuGame from './pages/sudoku/SudokuGamePage';
import MainPage from './pages/MainPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Container } from 'semantic-ui-react';


const BaseLayout = () => (
    <Container className='AppContent'>
      <Routes>
        <Route index element={<MainPage />}/>
        <Route path="/apps/forecast" element={<ForecastPage />} />
        <Route path="/apps/sudoku" element={<SudokuPage />} />
        <Route path="/apps/sudoku/game" element={<SudokuGame />} />

      </Routes>
    </Container>
);

function App() {
  // The App component now simply renders the structure of the page
  // Auth state is managed globally and used directly via useAuth in the components that need it
  return (
    <>
      <NavBar />
      <BaseLayout/>
      <Footer />
    </>
  );
}

export default App;
