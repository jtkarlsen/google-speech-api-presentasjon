import React, { Component } from 'react';
import './Slide.css';
import { Route, Switch } from 'react-router-dom'
import {withRouter} from "react-router-dom";


function getCurrentUrlParam() {
    return window.location.href.substr(window.location.href.lastIndexOf('/') + 1)
}

const Slide1 = () => (
    <div>
        <h1 className="Slide-main-title">Cloud Speech API</h1>
    </div>
);

const Slide2 = () => (
    <div className="Slide">
        <h1 className="Slide-header">Hva</h1>
        <ul className="Slide-body">
            <li>Tjeneste som konverterer tale til tekst</li>
            <li>Støtter over 110 forskjellige språk og dialekter</li>
            <li>Håndterer støy i varierende grad</li>
            <li>Støtter word-hints (nyttig om den skal gjenkjenne kommandoer)</li>
            <li>Støtter filopplastning og streaming</li>
            <li>Opptak lengre enn ~1 minutt må behandles asynkront</li>
            <li>
                Pris
                <ul>
                    <li>Første 60 min gratis i måneden</li>
                    <li>$0.006 per 15 sec ($1.44 per time)</li>
                </ul>
            </li>
        </ul>
    </div>
);

const Slide3 = () => (
    <div className="Slide">
        <h1 className="Slide-header">Hva+</h1>
        <ul className="Slide-body">
            <li>Bruker nevrale nett for å tolke tale</li>
            <li>Støtter 7 forskjellige lydformater, hvor FLAC og LINEAR16 er anbefalt</li>
            <li>Støtter frekvenser mellom 8000 og 48000 Hz</li>
            <li>Kan bruke REST og gRPC mot API'et (bare gRPC for streaming)</li>
            <li>Har klientbibliotek for C#, Go, Java, Node.js, PHP, Python og Ruby</li>
        </ul>
    </div>
);

const Slide4 = () => (
    <div className="Slide">
        <h1 className="Slide-header">node.js eksempel</h1>
        <div className="Slide-body">
            <code>
                const record = require('node-record-lpcm16');<br/>
                const speech = require('@google-cloud/speech');<br/>
                const client = new speech.SpeechClient();<br/>
                <br/>
                const request = {'{'}<br/>
                &nbsp;config: {'{'}<br/>
                &nbsp;&nbsp;encoding: LINEAR16,<br/>
                &nbsp;&nbsp;sampleRateHertz: 16000,<br/>
                &nbsp;&nbsp;languageCode: nb,<br/>
                &nbsp;{'}'},<br/>
                &nbsp;interimResults: true,<br/>
                {'}'};<br/>
                <br/>
                const recognizeStream = client<br/>
                &nbsp;.streamingRecognize(request)<br/>
                &nbsp;.on('data', data =><br/>
                &nbsp;&nbsp;process.stdout.write(data.results[0].alternatives[0].transcript});<br/>
                <br/>
                record.start({'{'}<br/>
                &nbsp;sampleRateHertz: 16000,<br/>
                &nbsp;threshold: 0,<br/>
                &nbsp;verbose: false,<br/>
                &nbsp;recordProgram: 'rec',<br/>
                &nbsp;silence: '10.0',<br/>
                {'}'})<br/>
                .pipe(recognizeStream);<br/>
                <br/>
                <br/>

            </code>
        </div>
    </div>
);

const Slide5 = () => (
    <div className="Slide">
        <h1 className="Slide-main-title">Fungerer det?</h1>
    </div>
);

const Slide6 = () => (
    <div className="Slide">
        <h1 className="Slide-main-title">Kildekode</h1>
        <a className="Slide-github" target="_blank" href="https://github.com/jtkarlsen/google-speech-api-presentasjon">github.com/jtkarlsen/google-speech-api-presentasjon</a>
    </div>
)

class SlideContainer extends Component {

    componentDidMount() {
        document.addEventListener('keydown', event => {
            if(event.key === 'ArrowRight'){
                this.props.history.push(`/${Number(getCurrentUrlParam())+1}`)
            } else if (event.key === 'ArrowLeft') {
                this.props.history.push(`/${Number(getCurrentUrlParam())-1}`)
            }
        });
    }

    render() {
        return (
            <Switch>
                <Route exact path='/' component={Slide1}/>
                <Route exact path='/1' component={Slide1}/>
                <Route exact path='/2' component={Slide2}/>
                <Route exact path='/3' component={Slide3}/>
                <Route exact path='/4' component={Slide4}/>
                <Route exact path='/5' component={Slide5}/>
                <Route exact path='/6' component={Slide6}/>
            </Switch>
        );
    }
}

export default withRouter(SlideContainer);