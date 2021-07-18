import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import axios from 'axios';
import Vote from '../components/Vote';
import Slide from 'react-reveal/Slide';
import SVGHome from '../assets/undraw.svg'
import KobiBottom from '../components/KobiBottom';

function Home({match}) {
  
  const [currentVote, setCurrentVote] = useState({});
  const [currentPoll, setCurrentPoll] = useState([]);
  const [clicked, setClicked] = useState(false);

  const pollId = match.params.poll;
  
  const fetchData = () => {
    axios.get(`https://pollify-backend.herokuapp.com/api/${pollId}`).then(data => setCurrentPoll(data.data["types"])).then(() => setClicked(false))
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
      setCurrentVote(argument)
    })
    
    // eslint-disable-next-line
  }, [])
  
  const submitVote = async (x) => {
    setClicked(true)
    const object = {
      "pollId": pollId,
      "title": x
    }
    await axios.put('https://pollify-backend.herokuapp.com/api/poll', object);
    fetchData();
  }

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      <Slide bottom duration={1000}>
        <div className="flex justify-center items-center flex-col p-10">
          <div className="flex">
            {clicked ? 
            <svg class="animate-spin -ml-1 mr-3 h-20 w-20 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            :
            currentPoll.map(x => (
              <Vote submitVote={submitVote} title={x} count={currentVote[x] || 0} />
              ))
            }
          </div>
          <div className="p-4">
            <input className="outline-none border-b focus:border-black px-4 py-2 duration-300" value={window.location.href} />
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg shadow-lg text-white font-bold duration-300 mx-1 uppercase" onClick={() => copyShare()}>Share</button>
          </div>
          <KobiBottom />
        </div>
      </Slide>
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 h-full lg:h-auto flex items-center justify-center p-10">
        <Slide top duration={1000}>
          <div className="w-3/4">
            <img src={SVGHome} alt="SVG ImageO" />
          </div>
        </Slide>
      </div>
    </div>
  )
}

export default Home