import React, { Component } from 'react';
import logo from './speech-api-lead_2x.png'
import './Speech.css';

class Speech extends Component {

  constructor(props) {
    super(props)
    this.state = {
      transcript: '',
    }
  }

  componentDidMount() {
    setInterval(() => {
        fetch('http://localhost:8080/transcript')
            .then((response) => {
                response.json().then((data) => {
                    this.setState({
                        transcript: data.transcript,
                    })
                });
            })
    }, 3000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.transcript}</h1>
        </header>
      </div>
    );
  }
}

export default Speech;