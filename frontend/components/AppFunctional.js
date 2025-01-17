import React, { useState } from 'react';
import axios from 'axios';

const initialMessage = '(2,2)';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunction(props) {
  const [state, setState] = useState({
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
    response: '',
  });

  const getXY = () => {
    const { index } = state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };

  const getXYMessage = () => {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  };

  const reset = () => {
    setState({
      ...state,
      message: '',
      email: '',
      index: initialIndex,
      steps: initialSteps,
      response: '',
    });
  };

  const getNextIndex = (direction) => {
    const { index } = state;
    const currentX = index % 3;
    const currentY = Math.floor(index / 3);
    let newX = currentX;
    let newY = currentY;

    if (direction === "left") {
      newX = Math.max(currentX - 1, 0);
    } else if (direction === "up") {
      newY = Math.max(currentY - 1, 0);
    } else if (direction === "right") {
      newX = Math.min(currentX + 1, 2);
    } else if (direction === "down") {
      newY = Math.min(currentY + 1, 2);
    }

    const newIndex = newY * 3 + newX;
    return newIndex;
  };

  const move = (direction) => {
    const newIndex = getNextIndex(direction);

    if (newIndex !== state.index) {
      setState(prevState => ({
        ...prevState,
        index: newIndex,
        steps: prevState.steps + 1,
        response: '',
      }));
    } else {
      let response = '';
      if (direction === "up") {
        response = "You can't go up";
      } else if (direction === "down") {
        response = "You can't go down";
      } else if (direction === "left") {
        response = "You can't go left";
      } else if (direction === "right") {
        response = "You can't go right";
      }
      setState({ ...state, response });
    }
  };

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setState({ ...state, [id]: value });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    const { x, y } = getXY()
    axios.post('http://localhost:9000/api/result', {...state, x, y})
      .then((res) => {
        setState(prevState => ({
          ...prevState,
          response: res.data.message,
          email: initialEmail,
        }));
      })
      .catch((err) => {
        setState({ ...state, email: '', response: err.response.data.message });
      });
  };

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXYMessage()}</h3>
        <h3 id="steps">You moved {state.steps} {state.steps !== 1 ? 'times' : 'time'}</h3>
      </div>
      <div id="grid">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            className={`square${idx === state.index ? ' active' : ''}`}
          >
            {idx === state.index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{state.response}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>LEFT</button>
        <button id="up" onClick={() => move('up')}>UP</button>
        <button id="down" onClick={() => move('down')}>DOWN</button>
        <button id="right" onClick={() => move('right')}>RIGHT</button>
        <button id="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={state.email}
          onChange={onChange}
        />
        <input
          id="submit"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
}
