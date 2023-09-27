import React from 'react';
import logo from './logo.svg';
import './App.css';
import './output.css'
import Homepage from './components/SplashPage/Main/Homepage';
import { Switch, Route } from "react-router-dom";
import EventHomepage from './components/EventPage/Main/EventHomepage';
import UserProfile from './components/UserPage/UserProfile/UserProfile';
import Login from './components/LoginPage/login';
import Signup from './components/SignUpPage/signup';

function App() {
  return (
    <>
    <Switch>
      <Route exact path="/"><Homepage /></Route>
      <Route path="/login"><Login /></Route>
      <Route path="/register"><Signup /></Route>
      <Route path="/event/:id?"><EventHomepage /></Route>
      <Route path="/profile"><UserProfile /></Route>
    </Switch>
    </>
  );
}

export default App;
