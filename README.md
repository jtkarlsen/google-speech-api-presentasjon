This application is a presentation about Google Cloud Speech API.
It requires gcloud installed and an account set locally to run.

The application send recorded sound from the browser with websockets to a node.js backend and the backend use the Cloud Speech API node.js client to get transcript and then return them to the browser to be displayed in the top of the presentation.