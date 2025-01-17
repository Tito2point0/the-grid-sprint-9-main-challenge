import React from 'react';
import axios from 'axios';

const initialMessage = '(2,2)';
const initialResponse = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default class AppClass extends React.Component {
  state = {
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
    response: initialResponse,
  };

  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };

  reset = () => {
    this.setState({
      message: '',
      email: '',
      index: initialIndex,
      steps: initialSteps,
      response: initialResponse,
    });
  };

  getNextIndex = (direction) => {
    const { index } = this.state;
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

  move = (direction) => {
    const newIndex = this.getNextIndex(direction);
    let response = '';
  
    if (newIndex !== this.state.index) {
      this.setState(prevState => ({
        index: newIndex,
        steps: prevState.steps + 1,
        response,
      }));
    } else {
      if (direction === "up") {
        response = "You can't go up";
      } else if (direction === "down") {
        response = "You can't go down";
      } else if (direction === "left") {
        response = "You can't go left";
      } else if (direction === "right") {
        response = "You can't go right";
      }
      this.setState({ ...this.state, response });
    }
  };

  onChange = (evt) => {
    const { id, value } = evt.target;
    this.setState({ ...this.state, [id]: value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    const { x, y } = this.getXY()
    axios.post('http://localhost:9000/api/result', { ...this.state, x, y } )
      .then((res) => {
        this.setState({ ...this.state, email: initialEmail, response: res.data.message });
      })
      .catch((err) => {
        this.setState({ email: '', response: err.response.data.message });
      });
  };

  render() {
    const { response } = this.state;
    const { className } = this.props;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps !== 1 ? 'times' : 'time'}</h3>
        </div>
        <div id="grid">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? ' active' : ''}`}
            >
              {idx === this.state.index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{response}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>LEFT</button>
          <button id="up" onClick={() => this.move('up')}>UP</button>
          <button id="down" onClick={() => this.move('down')}>DOWN</button>
          <button id="right" onClick={() => this.move('right')}>RIGHT</button>
          <button id="reset" onClick={() => { this.reset() }}>reset</button>

        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
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
}
