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
import OpCen2 from './components/marirong/OpCen2';
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
import ChangePassword from './components/utils/ChangePassword';
import ProfileSettings from './components/utils/ProfileSettings';
import './components/marirong/css/sandbox.css'
import './components/marirong/css/embla.css'

console.log(localStorage.getItem('credentials'))
// const OPTIONS = {}
// let SLIDE_COUNT = localStorage.getItem('credentials') != null ? JSON.parse(localStorage.getItem('credentials'))['img_length'] : 0

// const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

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
            {/* <Route
              path="*"
              element={
                <main style={{padding: '1rem'}}>
                  <h2>Webpage notafefe found</h2>
                </main>
              }
            /> */}
          </Routes>

            <Routes>
              <Route exact path="/opcen" element={<OpCen2 />} /> 
              <Route exact path="/events" element={<Events />} />
              <Route exact path="/communication" element={<Communication />} />
              <Route exact path="/analysis" element={<Analysis />} />
              <Route exact path="/assessment" element={<Assessment />} />
              <Route exact path="/cra" element={<CRA />} />
              <Route exact path="/ground_data" element={<GroundData />} />
              <Route exact path="/hazard_mapping" element={<HazardMapping/>} />
              <Route exact path="/cav" element={<CaV />} />
              <Route exact path="/rainfall" element={<Rainfall />} />
              <Route exact path="/subsurface" element={<Subsurface />} />
              <Route exact path="/surficial" element={<Surficial />} />
              <Route exact path="/earthquake" element={<Earthquake />} />
              <Route exact path="/resources" element={<Resources />} />
              <Route exact path="/resources" element={<Resources />} />
              <Route exact path="/change-password" element={<ChangePassword />} />
              <Route exact path="/profile-settings" element={<ProfileSettings />} />
              <Route
                exact
                path="/surficial_markers"
                element={<SurficialMarkers />}
              />
              <Route exact path="/moms" element={<Moms />} />
            </Routes>
            
        </Router>
      </SnackbarProvider>
    </Fragment>
  );
};

export default App;
