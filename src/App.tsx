import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Camera from './Camera';
import Art from './Art';
import './App.css';

interface State {
  imageData?: string;
}

class App extends React.Component<{}, State> {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const {imageData} = this.state;
    const onImage = (data: string) => this.setState({imageData: data});
    return (
      <BrowserRouter>
        <div className="App">
            <Route exact={true} path="/" component={Home} />
            <Route path="/camera" component={() => (<Camera history={null} onImage={onImage} />)} />
            <Route path="/art" component={() => (<Art imageData={imageData!} />)} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
