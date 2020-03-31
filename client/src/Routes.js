import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from "./Home";
import CreatorSignUp from "./CreatorSignUp";
import ConnectSuccess from "./ConnectSuccess";

import EventPage from "./EventPage";
import EventPurchaseSuccess from "./EventPurchaseSuccess";

import ErrorPage from "./ErrorPage";
function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/register">
        <CreatorSignUp />
      </Route>
      <Route exact path="/oauthSuccess">
        <ConnectSuccess />
      </Route>
      <Route exact path="/events/:id">
        <EventPage />
      </Route>
      <Route exact path="/eventPurchaseSuccess">
        <EventPurchaseSuccess />
      </Route>
      <Route exact path="/error">
        <ErrorPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}

export default Routes;
