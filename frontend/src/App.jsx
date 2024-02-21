import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import {Row, Col, Container} from 'reactstrap';
import ForecastPage from './pages/forecast/ForecastPage';
import HomepageLayout from './pages/forecast/HomePage';



const BaseLayout = () => (
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route path="/" element={<HomepageLayout />} />
              <Route path="/apps" >
                <Route path="forecast" element={<ForecastPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>


  // footer component will go here

);

function App() {
  return (
    <div className="App" id="AppRoot">
      <BaseLayout />
    </div>
  );
}

export default App;