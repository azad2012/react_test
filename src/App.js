import React from 'react';
import TestState from './copmonents/test/TestState';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import TableComponent from './copmonents/table';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/test" component={TestState} />
          <Route path="/table" component={TableComponent} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
