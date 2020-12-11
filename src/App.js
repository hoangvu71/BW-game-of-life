import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {speed: 0, start: true, random : false, generation: 0, blank : false, nextStep: false}
  }

  drawGrid(){
    let everything = this
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d');

    const resolution = 40
    canvas.width = 1000
    canvas.height = 1000

    const COLS = canvas.width / resolution
    const ROWS = canvas.height / resolution

    function buildGrid(){
      return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(0)
          .map(() => Math.floor(Math.random() * 1.3)))
    }

    function buildGridBlank(){
      return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(0))
    }

    let grid = buildGrid();
    console.log("This is grid", grid)

    requestAnimationFrame(update)
    

    function update() {
      if (everything.state.blank) {
        grid = buildGridBlank()
        renderGrid(grid)
        requestAnimationFrame(update)
        everything.setState({start: true})
      }
      if (everything.state.random){
        grid = buildGrid()
        everything.setState({start: true})
        everything.setState({random: false})
      }
      if (everything.state.start){
        if (everything.state.blank) {
          everything.setState({start: false})
          everything.setState({blank: false})
        }
        everything.setState({generation: everything.state.generation + 1})
        grid = nextGen(grid);
        

        everything.setState({random: false})
        renderGrid(grid)
        setTimeout(() => {
          requestAnimationFrame(update)
        }, everything.state.speed)
      }
      else if ( !everything.state.start && everything.state.nextStep) {
        console.log("Is it running?")
        everything.setState({nextStep: false})
        grid = nextGen(grid);

        renderGrid(grid)
        requestAnimationFrame(update)
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
          // for (let i = -1; i < 2; i++) {
          //   for (let j = -1; j < 2; j++){
          //     if (i === 0 && j === 0) {
          //       continue;
          //     }
          //     const x_cell = col + i;
          //     const y_cell = row + j;

          //     if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
          //       const currentNeighbor = grid[col + i][row + j];
          //       numNeighbors += currentNeighbor;
          //     } 
          //   }
          // }

          // Check for neighbors
          if ( col - 1 >= 0 && row -1 >= 0 && col + 1 < COLS && row + 1 < ROWS) {
              if (grid[col - 1][row - 1]){
                numNeighbors = numNeighbors + 1
              }
              if (grid[col][row - 1]){
                numNeighbors = numNeighbors + 1
              }
              if (grid[col + 1][row - 1]){
                numNeighbors = numNeighbors + 1
              }
              if (grid[col - 1][row]){
                numNeighbors = numNeighbors + 1
              }
              if (grid[col + 1][row]){
                numNeighbors = numNeighbors + 1
              }
              if (grid[col - 1][row + 1]){
                numNeighbors = numNeighbors + 1
              }
              if (grid[col][row + 1]){
                numNeighbors = numNeighbors + 1
              }
              if (grid[col + 1][row + 1]){
                numNeighbors = numNeighbors + 1
              }
          }
          

          // rules            

          if (cell === 1 && numNeighbors < 2) {
            nextGen[col][row] = 0;
          }
          else if (cell === 1 && numNeighbors > 3) {
            nextGen[col][row] = 0;
          }
          else if (cell === 0 && numNeighbors == 3) {
            nextGen[col][row] = 1;
          }
          
        }
      }
    return nextGen;
    }

    function renderGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const cell = grid[col][row];
          ctx.beginPath();
          // ctx.rect(col * resolution, row * resolution, resolution - resolution * 0.2, resolution - resolution * 0.2)
          ctx.arc(col * resolution, row * resolution, resolution / 3, 0, 2 * Math.PI)
          ctx.fillStyle = cell ? 'black' : 'white';
          ctx.fill()
          ctx.stroke()
        }
      }
    }

    canvas.addEventListener('click', function(event) {
      const rect = canvas.getBoundingClientRect()
      let cellX = Math.floor((event.clientX - rect.left - resolution) / (resolution))
      let cellY = Math.floor((event.clientY - rect.top - resolution) / (resolution))
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
          <h1>Game Of Life</h1>
          <canvas id="canvas" ></canvas>
          <button onClick={() => {
            this.setState({random: true})
          }}>Change</button>
          <button onClick={() => {
            this.setState({blank: true})
          }}>Blank</button>
          <button onClick={() => {
            this.setState({nextStep: true})
          }}>Next Step</button>
          <input type="range" min="1" max="500" class="slider" id="myRange"></input>
          <p>Speed: <span id="valueSlider"></span> milliseconds</p>
          <button value = "start" onClick={(event) => this.startStop(event)}>Start</button>
          <button value = "stop" onClick={(event) => this.startStop(event)}>Stop</button>
          <div>Generation: {this.state.generation}</div>
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