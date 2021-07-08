import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import axios from 'axios';
import Vote from '../components/Vote';
import { Pie } from 'react-chartjs-2';
import Slide from 'react-reveal/Slide';

function Home({match}) {
  
  const [currentVote, setCurrentVote] = useState({});
  const [currentPoll, setCurrentPoll] = useState([]);
  
  const getArrayOfVotes = () => {
    let output = [];
    currentPoll.forEach(x => {
      output.push(currentVote[x])
    })
    return output;
  }

  const dataPie = {
    labels: currentPoll,
    datasets: [
      {
        label: '# of Votes',
        data: getArrayOfVotes(),
        backgroundColor: [
          'rgba(255, 255, 255, 1)',
        ],
        borderColor: [
          'rgba(0, 0, 0, 1)',
        ],
        borderWidth: 0.5,
      },
    ],
  };
  
  const pollId = match.params.poll;
  
  const fetchData = () => {
    axios.get(`https://pollify-backend.herokuapp.com/api/${pollId}`).then(data => setCurrentPoll(data.data["types"]))
  }

  const copyShare =() => {
    const textArea = document.createElement("textarea");
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert("Copied!")
  }  

  useEffect(() => {
    const socket = io("https://pollify-backend.herokuapp.com/");

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
    await axios.put('https://pollify-backend.herokuapp.com/api/poll', object);
    fetchData();
  }

  return (
    <div className="w-full lg:min-h-screen h-auto grid lg:grid-cols-2">
      <Slide bottom duration={1000}>
        <div className="flex justify-center items-center flex-col p-10">
          <div className="flex">
            {currentPoll.map(x => (
              <Vote submitVote={submitVote} title={x} count={currentVote[x] || 0} />
            ))}
          </div>
          <div className="p-4">
            <input className="outline-none border-b focus:border-black px-4 py-2 duration-300" value={window.location.href} />
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg shadow-lg text-white font-bold duration-300 mx-1 uppercase" onClick={() => copyShare()}>Share</button>
          </div>
        </div>
      </Slide>
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 lg:h-auto flex items-center justify-center">
        <Slide top duration={1000}>
          <div className="w-2/4">
            <Pie data={dataPie} options={{animation: false, plugins: {legend: {display: false}}}} />
          </div>
        </Slide>
      </div>
    </div>
  )
}

export default Home