import React, {Fragment, useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';

import ChartRenderingContainer from './components/Chart_rendering/Container';
import Signin from './components/authentication/Signin';
import OpCen from './components/marirong/OpCen';
import Events from './components/marirong/Events';
import Communication from './components/marirong/Communication';
import Analysis from './components/marirong/Analysis';
import Assessment from './components/marirong/Assessment';
import MarirongHeader from './components/utils/MarirongHeader';
import CRA from './components/marirong/CRA';
import GroundData from './components/marirong/GroundData';
import HazardMapping from './components/marirong/HazardMapping';
import CaV from './components/marirong/CaV';
import Rainfall from './components/marirong/Rainfall';
import Subsurface from './components/marirong/Subsurface';
import Surficial from './components/marirong/Surficial';
import Earthquake from './components/marirong/Earthquake';
import SurficialMarkers from './components/marirong/SurficialMarkers';
import Moms from './components/marirong/Moms';
import Resources from './components/marirong/Resources';
import Feedback from './components/marirong/Feedback';

const App = props => {
  const [nav, setNav] = useState(null);
  const Header = () => {
    let location = window.location.pathname;
    if (location !== '/signin' && location !== '/') {
      return <MarirongHeader />;
    }
  };

  useEffect(() => {
    Header();
    setNav(Header());
  }, [props]);

  return (
    <Fragment>
      <SnackbarProvider>
        <Router>
          {nav}
          <Routes>
            <Route exact path="" element={<Signin />} />
            <Route exact path="/signin" element={<Signin />} />
            <Route exact path="/feedback" element={<Feedback />} />
            <Route
              path="/lpa/:chart_type"
              element={<ChartRenderingContainer />}
            />
            <Route
              path="*"
              element={
                <main style={{padding: '1rem'}}>
                  <h2>Webpage not found</h2>
                </main>
              }
            />
          </Routes>

          {(localStorage.getItem('credentials') != null) ? 
            <Routes>
              <Route exact path="/opcen" element={<OpCen />} /> 
              <Route exact path="/events" element={<Events />} />
              <Route exact path="/communication" element={<Communication />} />
              <Route exact path="/analysis" element={<Analysis />} />
              <Route exact path="/assessment" element={<Assessment />} />
              <Route exact path="/cra" element={<CRA />} />
              <Route exact path="/ground_data" element={<GroundData />} />
              <Route exact path="/hazard_mapping" element={<HazardMapping />} />
              <Route exact path="/cav" element={<CaV />} />
              <Route exact path="/rainfall" element={<Rainfall />} />
              <Route exact path="/subsurface" element={<Subsurface />} />
              <Route exact path="/surficial" element={<Surficial />} />
              <Route exact path="/earthquake" element={<Earthquake />} />
              <Route exact path="/resources" element={<Resources />} />
              <Route
                exact
                path="/surficial_markers"
                element={<SurficialMarkers />}
              />
              <Route exact path="/moms" element={<Moms />} />
            </Routes>
            : 
            (window.location.pathname != "/" && window.location.pathname != "/signin" && window.location.pathname != "/feedback") &&
              (window.location = "/")
            }
            
        </Router>
      </SnackbarProvider>
    </Fragment>
  );
};

export default App;
