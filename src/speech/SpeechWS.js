import React, { Component } from 'react';
import logo from './speech-api-lead_2x.png'
import './Speech.css';

let audioInput;
let context;
let streamStartTime;
let ws;
let breakTime = 45000; // how long to wait before starting a new speech stream on lull in input volume
let volume = 0; // volume meter initial value
let recording = false;
let wsOpen = false;

function startRecording(setState) {
    connectSocket(setState);

    let AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    let recorder = context.createScriptProcessor(2048, 1, 1);
    recorder.connect(context.destination);

    let handleSuccess = function(stream) {
        setRecordingTrue(1000); // give socket 1 sec to open
        audioInput = context.createMediaStreamSource(stream);
        audioInput.connect(recorder);
        recorder.onaudioprocess = function(stream){
            if(!recording || !wsOpen) return;
            let buf = stream.inputBuffer.getChannelData(0);
            volume = detectVolume(buf, this);
            if (volume < 0.01 && (Date.now() > (streamStartTime + breakTime))) {
                ws.send("restarting Google Stream");
                console.log("restarting Google Stream");
                streamStartTime = Date.now();
            }
            else {
                ws.send(float32ToInt16(buf)); // send audio stream to Node server
            }
        }
    }

    try {
        navigator.mediaDevices.getUserMedia({audio: true, video: false})
            .then(handleSuccess)
            .catch((err) => {
                alert('ERROR capturing audio: ' + err);
            });
    }
    catch (err) {
        console.log(`Error starting getUserMedia.${err.name}: ${err.message}`);
    }
}

function stopRecording() {
    recording = false;
    try {
        audioInput.mediaStream.getTracks()[0].stop()
    }
    catch (err) {
        console.log(`ERROR unable to close media stream: ${err}`) // triggers on Firefox
    }
    context.close();
    ws.close();
}


function connectSocket(setState) {

    // const host = window.location.origin.replace(/^http/, 'ws');
    const host = 'ws://localhost:8080';
    ws = new WebSocket(host);
    let socketTimerInterval;

    ws.onopen = () => {
        ws.send('new user info');
        console.log('opened socket')
        wsOpen = true;
        setState({
            wsConnected: true
        })
    };

    // handle inbound transcripts from Node server
    ws.onmessage = (message) => {
        console.error('Got data through ws from server');
        if (message.data.substring(0,7) === "[Heard]") {
            let transcript = message.data.substring(9);
            console.error(transcript);
            setState({ transcript });
        }
        else if (message.data.substring(0,7) === "[Error]") {
            console.log('error')
        }
    };

    ws.onclose = () => {
        clearInterval(socketTimerInterval);
        console.log('closed socket');
        if (recording) {
            stopRecording();
        }
        wsOpen = false;
        setState({ wsConnected: false })
    };
}

function float32ToInt16(buffer) {
    let l = buffer.length;
    let buf = new Int16Array(l);

    while (l--) {
        buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
    }
    return buf.buffer
}

function setRecordingTrue(delay) {
    setTimeout(function() { // web socket needs time to connect before accepting audio
        recording = true;
        streamStartTime = Date.now()
    }, delay);
}

function detectVolume(buf, recorder_context) {
    let bufLength = buf.length;
    let sum = 0;
    let x;
    for (let i=0; i<bufLength; i++) {
        x = buf[i];
        if (Math.abs(x)>=recorder_context.clipLevel) {
            recorder_context.clipping = true;
            recorder_context.lastClip = window.performance.now();
        }
        sum += x * x;
    }
    let rms =  Math.sqrt(sum / bufLength);
    return Math.max(rms, volume*.85); // smoothing
}

class Speech extends Component {

  constructor(props) {
    super(props)
    this.state = {
        transcript: '',
        wsConnected: false,
    }
  }

  setTranscript = (state) => {
      this.setState(state);
  }

  componentDidMount = () => {
      startRecording(this.setTranscript);
  }

  render() {

      const recording = this.state.wsConnected ? <span className="Speech-recording">•REC</span> : '';
      return (
          <div>
                {recording}
                <img src={logo} className="Speech-logo" alt="logo" />
              <h1 className="App-title">{this.state.transcript}</h1>
          </div>
      );
  }
}

export default Speech;