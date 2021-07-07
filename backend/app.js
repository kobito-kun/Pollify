// Main Imports
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
  });
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
  socket.emit("status", status);
};

const emitState = (arg, socket) => {
  db.get(`SELECT * FROM poll WHERE pollId = '${arg}'`, (err, query) => {
    db.all(`SELECT * FROM vote WHERE pollId = '${arg}'`, (err, countRes) => {
      if(countRes.length === 0){
        socket.emit("state", "none") 
      }else{
        const typesArray = query["types"].split(",");
        const countArray = [...countRes];
        let countResult = {};
        typesArray.forEach(y => {
          const countIndividual = countArray.filter(x => x["title"] === y).length
          countResult[`${y}`] = countIndividual;
        })
        socket.emit("state", countResult);
      }
    })
  })
};


const makeTables = () => {
  db.run(`CREATE TABLE poll(pollId text, types blob)`)
  db.run(`CREATE TABLE vote(pollId text, title text)`)
}

const makePoll = (pollId, types) => {
  db.run(`INSERT INTO poll(pollId, types) VALUES('${pollId}', '${types}')`)
}

const makeVote = (pollId, title) => {
  db.run(`INSERT INTO vote(pollId, title) VALUES('${pollId}', '${title}')`)
}

// Initial State Connection Sockets
io.on('connection', (socket) => {
  emitStatus(socket, "connected");
  socket.on("pollId", (arg) => {
    setInterval(() => {
      emitState(arg, socket);
    }, 500);
  })
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
  db.all(`SELECT * FROM vote`, (err, result) => {
    res.send(result)
  })
})

app.post('/api/poll', (req, res) => {
  const {pollId, types} = req.body;
  makePoll(pollId, types);
  res.json({"status": "complete"})
})

app.put('/api/poll', (req, res) => {
  const {pollId, title} = req.body;
  makeVote(pollId, title)
  res.json({"status" : "success"})
})

app.get('/api/:pollId', (req, res) => {
  const pollId = req.params.pollId;
  db.get(`SELECT * FROM poll WHERE pollId = '${pollId}'`, (err, query) => {
    if(err) return console.error(err);
    const typesArray = query["types"].split(',');
    db.all(`SELECT * FROM vote WHERE pollId = '${pollId}'`, (err, countRes) => {
      const countArray = [...countRes]
      typesArray.forEach(y => {
        const countIndividual = countArray.filter(x => x["title"] === y).length
        query[`${y}`] = countIndividual;
      })
      query["types"] = typesArray;
      res.json(query);
    })
  })
})




http.listen(port, () => console.log("Listening on http://localhost:" + port));