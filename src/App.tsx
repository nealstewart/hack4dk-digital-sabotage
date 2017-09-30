import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Camera from './Camera';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
            <Route exact={true} path="/" component={Home} />
            <Route path="/camera" component={Camera} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
