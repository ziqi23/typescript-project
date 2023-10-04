import React, { ReactElement } from 'react';
import logo from './logo.svg';
import './App.css';
import './output.css'
import Homepage from './components/SplashPage/Main/Homepage';
import { Switch, Route } from "react-router-dom";
import EventHomepage from './components/EventPage/Main/EventHomepage';
import UserProfile from './components/UserPage/UserProfile/UserProfile';
import Login from './components/LoginPage/login';
import Signup from './components/SignUpPage/signup';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { validateCurrentUser } from './store/session';

type RouteType = {
  path : string,
  children : ReactElement
}

function App() {
  const AuthRoute = ({ path, children } : RouteType) => {
    console.log(path, children);
    let loggedIn = useAppSelector(state => !!state.session.data);
    console.log(loggedIn)
    if (loggedIn) {
        return <Route path={path}>{children}</Route>
    }
    else {
        return <Route path="/"><Homepage /></Route>
    }
  }

  return (
    <>
    <Switch>
      <Route exact path="/"><Homepage /></Route>
      <Route path="/login"><Login /></Route>
      <Route path="/register"><Signup /></Route>
      <Route path="/event/:id?"><EventHomepage /></Route>
      <AuthRoute path="/profile"><UserProfile /></AuthRoute>
      <Route path="/"><Homepage /></Route>
    </Switch>
    </>
  );
}

export default App;
