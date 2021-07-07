import React from 'react'
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import Home from './pages/Home';
import Poll from './pages/Poll';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/poll/:poll" exact component={Poll} />
      </Switch>
    </Router>
  );
}

export default App;
