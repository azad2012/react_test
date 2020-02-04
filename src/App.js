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
import Home from './Home';
import Carousel from './copmonents/Carousel';
import Scroll from './copmonents/Scroll';

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
          {/* <Route path="/ck-editor" component={CKEditorComponent} /> */}
          <Route path="/editor" component={Editor} />
          <Route path="/carousel" component={Carousel} />
          <Route path="/scroll" component={Scroll} />
          <Route path="/" component={Home} />
        </Switch>
      </BrowserRouter>
      {/* <TestState/> */}
    </div>
  );
}

export default App;
