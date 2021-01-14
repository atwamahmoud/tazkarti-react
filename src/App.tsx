import React from "react";
import "./App.css";
import { Container } from "@material-ui/core";
import { Router } from "@reach/router";
import SignUp from "./Routes/SignUp";
import Login from "./Routes/Login";
import { Home } from "./Routes/Home";
import Logout from "./Routes/Logout";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';


function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth={false}>
        <Router>
          <Home path="/*" />
          <Logout path="/logout" />
          <SignUp path="/sign-up" />
          <Login path="/login" />
        </Router>
      </Container>
    </MuiPickersUtilsProvider>
  );
}

export default App;
