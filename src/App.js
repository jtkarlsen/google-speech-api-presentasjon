import React, { Component } from 'react';
import './App.css';
import SpeechWS from './speech/SpeechWS'
import SlideContainer from './slide/SlideContainer'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
        }
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <SpeechWS/>
        </header>
        <div className="App-intro">
          <SlideContainer page={this.state.page}/>
        </div>
      </div>
    );
  }
}

export default App;
