import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForecastPage from './pages/forecast/ForecastPage';
import MainPage from './pages/MainPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

const BaseLayout = () => (
    <>
      <Routes>
        <Route index element={<MainPage />} />
        <Route path="/apps/forecast" element={<ForecastPage />} />
      </Routes>
    </>
);

function App() {
  // The App component now simply renders the structure of the page
  // Auth state is managed globally and used directly via useAuth in the components that need it
  return (
    <>
      <NavBar />
      <BaseLayout />
      <Footer />
    </>
  );
}

export default App;
