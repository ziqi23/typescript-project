import React from 'react';
import logo from './logo.svg';
import './App.css';
import Homepage from './components/SplashPage/Main/Homepage';
import { Switch, Route } from "react-router-dom";
import EventHomepage from './components/EventPage/Main/EventHomepage';

function App() {
  return (
    <>
    <Switch>
      <Route exact path="/"><Homepage /></Route>
      <Route path="/event"><EventHomepage /></Route>
    </Switch>
    </>
  );
}

export default App;
