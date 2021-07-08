import React, {useRef, useState} from 'react';
import axios from 'axios';
import { v4 } from 'uuid';
import {useHistory} from 'react-router-dom';
import Box from './Box';
import Fade from 'react-reveal/Fade';

function Form() {

  const [currentPollValues, setCurrentPollValues] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const history = useHistory();
  const valuesInput = useRef(null);

  const makePoll = () => {
    const theUUID = v4();
    const types = currentPollValues.join();
    const object = {
      "pollId": theUUID,
      "types": types
    };
    if(currentPollValues.length >= 2){
      axios.post("https://pollify-backend.herokuapp.com/api/poll", object).then(() => {
        history.push(`/poll/${theUUID}`)
      })
    }else{
      setWarningMessage("You have to set 2 or more polls.");      
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let currentInputValue = valuesInput.current.value;
    setCurrentPollValues([...currentPollValues, currentInputValue]);
    valuesInput.current.value = "";
  }

  return (
    <Fade duration={500}>
      <div className="flex justify-center items-center flex-col">
        <h3 className="font-bold text-lg">What would you like to poll?</h3>
        {warningMessage.length > 0 
        ? 
        <Fade><span className="uppercase text-md text-red-600">{warningMessage}</span></Fade>
        :
        ""
        }
        <div className="p-4 flex-wrap w-96 bg-gray-100 rounded-lg shadow my-2 flex justify-center items-center">
          {currentPollValues.length > 0 
          ? currentPollValues.map(x => (<Box setCurrentPollValues={setCurrentPollValues} currentPollValues={currentPollValues} text={x} />))
          : ""}
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="w-96 flex items-center justify-center">
          <input className="w-72 outline-none border-b focus:border-black px-4 py-2 m-1" ref={valuesInput} required></input>
          <button className="px-4 py-2 m-1 bg-red-400 rounded-lg font-bold shadow text-white uppercase" type="submit">add</button>
        </form>
        <button className="font-bold text-white px-4 py-2 bg-red-400 rounded-lg shadow-lg my-2 uppercase" onClick={() => makePoll()}>make a poll</button>
      </div>
    </Fade>
  )
}

export default Form
