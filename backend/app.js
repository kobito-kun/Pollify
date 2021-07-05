// Main Imports
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const port = process.env.PORT || 5000

// Express Limitations
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));

// Functions to shorten code
const db = new sqlite3.Database('./main.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);  
  console.log('Connected to the database.');
});

const emitStatus = (socket, status) => {
  socket.emit("status", status)
};

const emitState = () => {
  io.emit("state", )
};

const addCountState = () => {
  return
}

const makeTables = () => {
  db.run(`CREATE TABLE poll(
    pollId text,
    vote blob)`)
}

const fetchPoll = (id) => {
  db.get(`SELECT * FROM poll WHERE pollId = ${id}`, (err, result) => {
    if(err) return console.error(err);
    console.log(JSON.parse(result["vote"]))
  })
}

const makePoll = (pollId, vote) => {
  db.run(`INSERT INTO poll(pollId, vote) VALUES('${pollId}', '${vote}')`)
}

// Initial State Connection
io.on('connection', (socket) => {
  emitStatus(socket, "connected");
  socket.on("vote", (arg) => {
    emitState();
  });
});

// Routes
app.get('/', (req, res) => {
  res.send("Success")
})

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

// TESTING
app.get('/test', (req, res) => {
  db.all(`SELECT * FROM poll`, (err, result) => {
    res.send(result)
  })
})

app.get('/:pollId', (req, res) => {
  const pollId = req.params.pollId;
  const result = fetchPoll(pollId);
  res.send(pollId);
})

http.listen(port, () => console.log("Listening on http://localhost:" + port));