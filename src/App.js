import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/header';
import Footer from './components/footer';
import UserProfile from './components/profile/UserProfile';
import SignIn from './components/Sign_In';
import SignUp from './components/Sign_Up';
import About from './components/About';
import Contact from './components/Contact';
import Home from './components/Home';
import pageNotFound from './components/pageNotFound';
import SignOut from './components/Sign_Out';

import { ProtectedRoute } from './components/ProtectedRoute';
import { getToken, removeUserSession, setUserSession, getUser } from './components/Common';

import 'tachyons';

function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
   
    const token = getToken();
    if (!token) {
      return;
    }
    fetch(`http://localhost:4412/api/verifyToken?token=${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setUserSession(data.Token, data.Data);
        setAuthLoading(false);
      })
      .catch(error => {
        removeUserSession();
        setAuthLoading(false);
      })
      .then(response => console.log('Success:', response));
  }, []);


  return (
    <Router>
      <div>
        <Header  />
        <Switch>
        <Route exact path="/"  component={SignIn}/>
          <ProtectedRoute path="/profile" component={UserProfile} />
          <ProtectedRoute exact path="/home" component={Home}/>
          <Route exact path="/about" component={About} />
          <Route exact path="/contact-us" component={Contact} />
          <Route exact path="/sign_in" component={SignIn} />
          <Route exact path="/sign_up" component={SignUp} />
          <ProtectedRoute exact path="/sign_out" component={SignOut} />
          <Route path = "/**" component={pageNotFound}/>
        </Switch>
        <Footer />
      </div>
    </Router>
  );

}

export default App;