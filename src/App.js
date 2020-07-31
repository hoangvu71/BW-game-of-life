import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {speed: 0, start: true}
  }

  drawGrid(){
    let everything = this
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d');

    const resolution = 4
    canvas.width = 400
    canvas.height = 400

    const COLS = canvas.width / resolution
    const ROWS = canvas.height / resolution

    function buildGrid(){
      return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(0)
          .map(() => Math.floor(Math.random() * 1.3)))
    }

    let grid = buildGrid();
    console.log("This is grid", grid)

    requestAnimationFrame(update)
    

    function update() {
      if (everything.state.start){
        grid = nextGen(grid);
        renderGrid(grid)
        setTimeout(() => {
          requestAnimationFrame(update)
        }, everything.state.speed)
      }
      else {
        requestAnimationFrame(update)
      }
    }

    function nextGen(grid) {
      const nextGen = grid.map(arr => [...arr]);

      for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
          const cell = grid[col][row];
          let numNeighbors = 0;
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++){
              if (i === 0 && j === 0) {
                continue;
              }
              const x_cell = col + i;
              const y_cell = row + j;

              if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
                const currentNeighbor = grid[col + i][row + j];
                numNeighbors += currentNeighbor;
              } 
            }
          }
          // rules            

          if (cell === 1 && numNeighbors < 2) {
            nextGen[col][row] = 0;
          }
          else if (cell === 1 && numNeighbors > 3) {
            nextGen[col][row] = 0;
          }
          else if (cell === 0 && numNeighbors ===3) {
            nextGen[col][row] = 1;
          }
        }
      }
    return nextGen;
    }

    function renderGrid(grid) {
      for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
          const cell = grid[col][row];

          ctx.beginPath();
          ctx.rect(col * resolution, row * resolution, resolution, resolution)
          ctx.fillStyle = cell ? 'black' : 'white';
          ctx.fill()
        }
      }
    }

    function slider_speed() {
    
      let slider = document.getElementById("myRange")
      let output = document.getElementById("valueSlider")
      output.innerHTML = slider.value
  
      function showing() {
        output.innerHTML = this.value
        console.log(everything.state.speed)
        everything.setState({speed: this.value})
      }
  
      slider.oninput = showing
    }

    slider_speed()

  } 

  startStop() {
    this.setState({start: !this.state.start})
    console.log(this.state)
  }
  
  componentDidMount() {
    this.drawGrid()
  }



  render() {
    return (
        <div className="App">
          <h1>Hello CodeSandbox</h1>
          <h2>Start editing to see some magic happen!</h2>
          <canvas></canvas>
          <button onClick={this.drawGrid}>Change</button>
          <input type="range" min="1" max="500" class="slider" id="myRange"></input>
          <p>Value: <span id="valueSlider"></span></p>
          <button onClick={() => this.startStop()}>Start</button>
          <button onClick={() => this.startStop()}>Stop</button>
        </div>
      );
      }
}

export default App