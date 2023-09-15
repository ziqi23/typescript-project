import React from 'react';
import logo from './logo.svg';
import './App.css';
import Homepage from './components/SplashPage/Main/Homepage';
import { Switch, Route } from "react-router-dom";
import EventHomepage from './components/EventPage/Main/EventHomepage';
import UserProfile from './components/UserPage/UserProfile/UserProfile';

function App() {
  return (
    <>
    <Switch>
      <Route exact path="/"><Homepage /></Route>
      <Route path="/event"><EventHomepage /></Route>
      <Route path="/profile"><UserProfile /></Route>
    </Switch>
    </>
  );
}

export default App;
