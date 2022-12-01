import React, {Fragment, useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';

import ChartRenderingContainer from './components/Chart_rendering/Container';
import Signin from './components/authentication/Signin';
import Dashboard from './components/umingan/Dashboard';
import OpCen from './components/umingan/OpCen';
import Events from './components/umingan/Events';
import Communication from './components/umingan/Communication';
import Analysis from './components/umingan/Analysis';
import Assessment from './components/umingan/Assessment';
import LipataHeader from './components/utils/LipataHeader';
import CRA from './components/umingan/CRA';
import GroundData from './components/umingan/GroundData';
import HazardMapping from './components/umingan/HazardMapping';
import CaV from './components/umingan/CaV';
import Rainfall from './components/umingan/Rainfall';
import Subsurface from './components/umingan/Subsurface';
import Surficial from './components/umingan/Surficial';
import Earthquake from './components/umingan/Earthquake';
import SurficialMarkers from './components/umingan/SurficialMarkers';
import Moms from './components/umingan/Moms';
import Resources from './components/umingan/Resources';
import Feedback from './components/umingan/Feedback';

const App = props => {
  const [nav, setNav] = useState(null);
  const Header = () => {
    let location = window.location.pathname;
    if (location !== '/signin' && location !== '/') {
      return <LipataHeader />;
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
            <Route
              path="/lpa/:chart_type"
              element={<ChartRenderingContainer />}
            />
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
            <Route exact path="/feedback" element={<Feedback />} />
            <Route
              exact
              path="/surficial_markers"
              element={<SurficialMarkers />}
            />
            <Route exact path="/moms" element={<Moms />} />
            <Route
              path="*"
              element={
                <main style={{padding: '1rem'}}>
                  <h2>Webpage not found</h2>
                </main>
              }
            />
          </Routes>
        </Router>
      </SnackbarProvider>
    </Fragment>
  );
};

export default App;
