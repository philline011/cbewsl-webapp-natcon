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
import Dashboard from './components/lipata/Dashboard';
import OpCen from './components/lipata/OpCen';
import Events from './components/lipata/Events';
import Communication from './components/lipata/Communication';
import Analysis from './components/lipata/Analysis';
import Assessment from './components/lipata/Assessment';
import LipataHeader from './components/utils/LipataHeader';
import CRA from './components/lipata/CRA';
import GroundData from './components/lipata/GroundData';
import HazardMapping from './components/lipata/HazardMapping';
import CaV from './components/lipata/CaV';
import Rainfall from './components/lipata/Rainfall';
import Subsurface from './components/lipata/Subsurface';
import Surficial from './components/lipata/Surficial';
import Earthquake from './components/lipata/Earthquake';
import SurficialMarkers from './components/lipata/SurficialMarkers';
import Moms from './components/lipata/Moms';
import Resources from './components/lipata/Resources';
import Feedback from './components/lipata/Feedback';

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
