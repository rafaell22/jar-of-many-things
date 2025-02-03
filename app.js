const express = require('express');
const helmet = require('helmet');
const path = require('path')
const WebSocket = require('ws');

let wsClientRef;
const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': ['\'self\'', 'localhost', '127.0.0.1', 'cdn.jsdelivr.net'],
      'default-src': ['\'self\'', 'localhost', '127.0.0.1']
    }
  }
}));

app.use('/jar', express.static(path.join(__dirname, 'public')));

app.post('/jar/drop', (req, res) => {
  if(wsClientRef) {
    wsClientRef.send('{"event":"drop"}')
  }

  res.send('OK');
});

/*
app.get('/races/details/:category/:raceSlug/data', async function getRaceDetails(req, res, next) {
  try {
    const response = await axios({
      method: 'get',
        url: `https://racetime.gg/${req.params.category}/${req.params.raceSlug}/data`
    })

    response.data.date_exact = response.headers['x-date-exact'];
    res.send(response.data);
  } catch(error) {
    console.log('ERROR!')
    console.log(error);
  }
});

app.get('/races/data', async (req, res, next) => {
  try {
    const response = await axios({
      method: 'get',
        url: `https://racetime.gg/races/data`
    })

    res.send(response.data);
  } catch(error) {
    console.log('ERROR!')
    console.log(error);
  }
});

app.get('/races/:category', async function getRacesByCategory(req, res, next) {
  try {
    const response = await axios({
      method: 'get',
        url: `https://racetime.gg/${req.params.category}/data`
    })

    res.send(response.data.current_races);
  } catch(error) {
    console.log('ERROR!')
    console.log(error);
  }
});
*/

app.use(function errorOnRequest(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})

app.use(function handleErrors(err, req, res, next) {
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = err;

  res.status(err.status || 505);
  res.send();
});

const server = app.listen(8080);
console.log('Listening on port 8080...');

const wss = new WebSocket.Server({
  noServer: true,
  path: "/websockets",
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (websocket) => {
    wss.emit('connection', websocket, request);
  });
});

wss.on('connection', (wsClient, connectionRequest) => {
  const [_path, params] = connectionRequest?.url?.split("?");
  // const connectionParams = queryString.parse(params);

  console.log('Websocket connected!')

  wsClientRef = wsClient;

  wsClient.on('message', (message) => {
    console.log('WS message')
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
  });

  wsClient.on('error', (e) => { 
    console.log('WS connection error');
    console.log(e);
  });

  wsClient.on('close', () => {
    console.log('WS connection closed');
    wsClientRef = null;
  });
});

