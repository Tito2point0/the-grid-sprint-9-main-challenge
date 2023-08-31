import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  
    state = initialState
  
  
  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };


}
 
 
  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
   
      const { x, y } = this.getXY();
      return `Coordinates (${x}, ${y})`;
    
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: '',
      email: '',
      index: initialIndex,
      steps: initialSteps,
    })
  }

  getNextIndex = (direction) => {
    const { index } = this.state;
    const currentX = index % 3;
    const currentY = Math.floor(index / 3);
  
    let newX = currentX;
    let newY = currentY;
  
    // Update coordinates based on direction
    if (direction === "left") {
      newX = Math.max(currentX - 1, 0);
    } else if (direction === "up") {
      newY = Math.max(currentY - 1, 0);
    } else if (direction === "right") {
      newX = Math.min(currentX + 1, 2);
    } else if (direction === "down") {
      newY = Math.min(currentY + 1, 2);
    }
  
    // Calculate new index
    const newIndex = newY * 3 + newX;
  
    return newIndex;
  };
  
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.



    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    move = (direction) => {
      this.setState(prevState => ({
        index: this.getNextIndex(direction),
        steps: prevState.steps + 1,
      }));
    };
    
  
  
  onChange = (evt) => {
    evt.preventDefault();
    // You will need this to update the value of the input.
    const { id, value } = evt.target;
    this.setState({ ...this.state, [id]: value });
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const { email, message, index, steps } = this.state;

    axios.post("http://localhost:9000/api/result", { message, email, index, steps })
      .then(({ data }) => {
        this.setState({
          message: data.message,
          email: data.newEmail,
          index: 1 ,
          steps: 0
        })
        console.log(index, steps)
    })
      .catch(err => {
        console.error("you messed something up again ", err);
        })
.finally(() => {
  this.setState({
    message: '',
    email: '',
})
})
  }

  render()

  {
   console.log(this.getXYMessage())
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
        <h3 id="coordinates">Coordinates {this.getXYMessage()}</h3>
        <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
                {idx === 4 ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left"onClick={() => this.move('left')}>LEFT</button>
          <button id="up" onClick={() => this.move('up')}>UP</button>
          <button id="right"onClick={() => this.move('right')}>RIGHT</button>
          <button id="down" onClick={() => this.move('down')}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          >
           </input>
          <input
            id="submit"
            type="submit"
            value='Submit'
          >
          </input>
        </form>
      </div>
    )
  }
}
