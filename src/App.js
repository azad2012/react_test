import React from 'react';
import TestState from './copmonents/test/TestState';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import TableComponent from './copmonents/table';
import Gradient from './copmonents/gradient';
import './App.scss';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/test" component={TestState} />
          <Route path="/table" component={Gradient} />
          <Route path="/gradient" component={TableComponent} />
        </Switch>
      </BrowserRouter>
      {/* <TestState/> */}
    </div>
  );
}

export default App;
