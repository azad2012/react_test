import React from 'react';
import TestState from './copmonents/test/TestState';
import {BrowserRouter,Switch,Route} from "react-router-dom";
import TableComponent from './copmonents/table';
import Gradient from './copmonents/gradient';
import './App.scss';
import './assets/sass/index.scss'
import Tree from './copmonents/tree';
import CssCopmonent from './copmonents/css';
import Editor from './copmonents/Editor';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/test" component={TestState} />
          <Route path="/table" component={Gradient} />
          <Route path="/gradient" component={TableComponent} />
          <Route path="/tree" component={Tree} />
          <Route path="/css" component={CssCopmonent} />
          <Route path="/editor" component={Editor} />
        </Switch>
      </BrowserRouter>
      {/* <TestState/> */}
    </div>
  );
}

export default App;
