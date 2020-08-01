import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {speed: 0, start: true, random : false}
  }

  drawGrid(){
    let everything = this
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d');

    const resolution = 10
    canvas.width = 800
    canvas.height = 800

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
        if (everything.state.random){
          grid = buildGrid()
        }
        everything.setState({random: false})
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

    function renderGrid() {
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const cell = grid[col][row];

          ctx.beginPath();
          ctx.rect(col * resolution, row * resolution, resolution, resolution)
          ctx.fillStyle = cell ? 'darkgray' : 'white';
          ctx.fill()
        }
      }
    }

    canvas.addEventListener('click', function(event) {
      var cellX = Math.floor((event.clientX) / resolution);
      var cellY = Math.floor((event.clientY + resolution *2) / resolution);
      grid[cellX][cellY] = !grid[cellX][cellY];
      renderGrid();
    });

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

  startStop(event) {
    console.log(event.target.value)
    if (event.target.value === "start") {
      this.setState({start: true})
    }
    else if (event.target.value === "stop") {
      this.setState({start: false})
    }
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
          <button onClick={() => {
            this.setState({random: true})
          }}>Change</button>
          <input type="range" min="1" max="500" class="slider" id="myRange"></input>
          <p>Speed: <span id="valueSlider"></span> milliseconds</p>
          <button value = "start" onClick={(event) => this.startStop(event)}>Start</button>
          <button value = "stop" onClick={(event) => this.startStop(event)}>Stop</button>
          <div>The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
                <div>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</div>
                <div>Any live cell with two or three live neighbours lives on to the next generation.</div>
                <div>Any live cell with more than three live neighbours dies, as if by overpopulation.</div>
                <div>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</div></div>
        </div>
      );
      }
}

export default App