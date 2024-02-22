import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import {Row, Col, Container} from 'reactstrap';
import ForecastPage from './pages/forecast/ForecastPage';
import MainPage from './pages/MainPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';



const BaseLayout = () => (
        <>
          <Routes>
            <Route path="/">
              <Route path="/" element={<MainPage />} />
              <Route path="/apps" >
                <Route path="forecast" element={<ForecastPage />} />
              </Route>
            </Route>
          </Routes>
        </>

);

function App() {
  return (
    <div className="App" id="AppRoot">
      <NavBar />
      <BaseLayout />
      <Footer />
    </div>
  );
}

export default App;