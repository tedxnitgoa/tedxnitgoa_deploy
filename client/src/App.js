import './App.css';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './Footer';
import MeetTeam from './AboutUs';
import AboutUsCarousel from './AboutUs2';
import Home from './Home';
import Teams from './Teams';
import NotFound from './NotFound';
import Sponsors from './Sponsors';
import Rough from './Roug';
import ContactUs from './ContactUs';
import BuyTickets from './BuyTickets';



function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/AboutUs">
              <AboutUsCarousel />
              <MeetTeam />
            </Route>
            <Route path="/Teams">
              <Teams />
            </Route>
            <Route path="/Sponsors">
              <Sponsors />
            </Route>
            <Route path="/rough">
              <Rough />
            </Route>
            <Route path="/ContactUs">
              <ContactUs />
            </Route>
            <Route path="/BuyTickets">
              <BuyTickets />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;