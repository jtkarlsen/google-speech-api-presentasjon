let express = require('express');
let router = express.Router();
const speech = require('@google-cloud/speech');
let http = require('http');

let app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = 8080;
app.set('port', port);
let server = http.createServer(app);
server.listen(port);

const client = new speech.SpeechClient();

module.exports = router;

function startGoogleSpeechStream(ws) {
    let request = {
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 44100,
            languageCode: 'nb'
        },
        interimResults: true, // set to true to receive in-progress guesses
        singleUtterance: false // set to true to close stream after a finished utterance
    };
    let recognizeStream = client.streamingRecognize(request)
        .on('error', (err) => {
            console.log(`ERROR: On Streaming recognize stream: ${err}`);
            return ws.terminate();
        })
        .on('data', (data) => {
            let text = data.results[0].alternatives[0].transcript;
            ws.send(`[Heard]: ${text}`); // send transcript to client
        });
    return recognizeStream;
}

/*================================================

Websocket connection to client browsers

==================================================*/

let WebSocketServer = require("ws").Server;
let wss = new WebSocketServer({ server });

wss.on('connection', function (ws) {
    console.log('Client connected: ' + ws._ultron.id);
    let gstreams = [];
    let activeStreamID = -1;
    ws.on('message', function (data) {
        if ( typeof data === 'string' ) {
            if (data.indexOf("info")>0) {
                console.log('Start first stream');
                gstreams.push(startGoogleSpeechStream(ws));
                activeStreamID = activeStreamID + 1;
            }
            else {
                console.log('Start another stream');
                gstreams[activeStreamID].end();
                gstreams.push(startGoogleSpeechStream(ws));
                activeStreamID = activeStreamID + 1;
            }
        }
        else  {
            gstreams[activeStreamID].write(data);
        }
    });
    ws.on('close', function () {
        console.log('Client disconnected');
        ws.isAlive = false;
        gstreams[activeStreamID].end();
    });
    ws.on('error', function (err) {
        console.log(`Web socket error ${err.message}`);
    });
});
