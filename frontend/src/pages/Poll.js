import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import axios from 'axios';
import Vote from '../components/Vote';

function Home({match}) {
  
  const [currentVote, setCurrentVote] = useState({});
  const [currentPoll, setCurrentPoll] = useState([]);
  
  const pollId = match.params.poll
  
  const fetchData = () => {
    axios.get(`http://localhost:5000/api/${pollId}`).then(data => setCurrentPoll(data.data["types"]))
  }

  useEffect(() => {
    const socket = io("http://localhost:5000/");

    fetchData();

    socket.emit("pollId", pollId);
    
    socket.on("status", (argument) => {
      console.log(argument)
    })
  
    socket.on("state", (argument) => {
      console.log(argument)
      setCurrentVote(argument)
    })
    
    
    // eslint-disable-next-line
  }, [])
  
  const submitVote = async (x) => {
    const object = {
      "pollId": pollId,
      "title": x
    }
    await axios.put('http://localhost:5000/api/poll', object);
    fetchData();
  }

  return (
    <div className="w-full lg:min-h-screen h-auto grid lg:grid-cols-2">
      <div className="flex justify-center items-center flex-col">
        <div className="flex">
          {currentPoll.map(x => (
            <Vote submitVote={submitVote} title={x} count={currentVote[x]} />
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-blue-700">
        here goes z chart
      </div>
    </div>
  )
}

export default Home