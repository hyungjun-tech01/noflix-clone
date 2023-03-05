import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from './Routes/Home';
import Tv from './Routes/Tx';
import Search from './Routes/Search';


function App() {
  return (
  <Router>
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/tv">
        <Tv/>
      </Route>
      <Route path="/search">
        <Search />
      </Route>
    </Switch>
  </Router>
  );
}

export default App;
