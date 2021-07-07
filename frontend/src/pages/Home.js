import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import axios from 'axios';

function Home() {
  
  const socket = io("http://localhost:5000/");
  const [currentVote, setCurrentVote] = useState({});
  const [currentPoll, setCurrentPoll] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/kobi").then(data => setCurrentPoll(data.data["types"]))
    socket.emit("pollId", "kobi");
    // eslint-disable-next-line
  }, [])

  socket.on("status", (argument) => {
    console.log(argument)
  })

  socket.on("state", (argument) => {
    setCurrentVote(argument)
  })

  return (
    <div>
      {currentPoll.map(x => (
        <div>
          {x} : {currentVote[x]}
        </div>
      ))}
    </div>
  )
}

export default Home