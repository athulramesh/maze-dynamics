import React, { useState } from "react";
import "./Canvas.css";
import findPath from "./path.js";

function Canvas() {
  const row = 30;
  const column = 60;
  const initState = {
    start: { x: 10, y: 20 },
    end: { x: 20, y: 40 },
    startOnhold: false,
    endOnhold: false,
    wallOnhold: false,
    wall: new Set(),
    path: new Set(),
  };
  const [state, setState] = useState(initState);
  const grid = new Array(row).fill(0).map(() => new Array(column).fill(0));

  function startClicked(cords) {
    if (
      cords.x === state.start.x &&
      cords.y === state.start.y &&
      !state.wallOnhold
    ) {
      setState({ ...state, start: { x: -1, y: -1 }, startOnhold: true });
      if (state.path.size > 0) {
        setState({ ...state, path: new Set() });
      }
    } else if (
      cords.x === state.end.x &&
      cords.y === state.end.y &&
      !state.wallOnhold
    ) {
      setState({ ...state, end: { x: -1, y: -1 }, endOnhold: true });
      if (state.path.size > 0) {
        setState({ ...state, path: new Set() });
      }
    } else if (state.startOnhold) {
      setState({ ...state, start: cords, startOnhold: false });
    } else if (state.endOnhold) {
      setState({ ...state, end: cords, endOnhold: false });
    } else if (state.wallOnhold) {
      setState({ ...state, wallOnhold: false });
    } else {
      let b = new Set();
      b = state.wall;
      b.add(cords.x * column + cords.y);
      setState({
        ...state,
        wallOnhold: true,
        wall: b,
        path: new Set(),
      });
    }
  }
  function drawWall(cords) {
    if (
      !(cords.x === state.start.x && cords.y === state.start.y) &&
      !(cords.x === state.end.x && cords.y === state.end.y) &&
      state.wallOnhold
    ) {
      let b = new Set();
      b = state.wall;
      b.add(cords.x * column + cords.y);
      setState({
        ...state,
        wall: b,
      });
    }
  }
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      grid[i][j] = {
        cord: { x: i, y: j },
        block: (
          <div
            className={
              "block " +
              (state.start.x === i && state.start.y === j ? "start " : "") +
              (state.end.x === i && state.end.y === j ? "end " : "") +
              (state.startOnhold ? "hovs " : "") +
              (state.endOnhold ? "hove " : "") +
              (state.wall.has(i * column + j) ? "wall " : "") +
              (state.path.has(i * column + j) ? "path " : "")
            }
            key={i * column + j}
            onClick={() => startClicked({ x: i, y: j })}
            onMouseEnter={() => drawWall({ x: i, y: j })}
          ></div>
        ),
      };
    }
  }
  return (
    <div className="canvas">
      <div className="plot">
        <div className="grid">
          {grid.map((gridRow) => (
            <div className="row" key={gridRow[0].cord.x}>
              {gridRow.map((b) => b.block)}
            </div>
          ))}
        </div>
      </div>
      <div className="buttons">
        <button
          onClick={() =>
            setState({ ...state, path: findPath(state, row, column) })
          }
        >
          Show path
        </button>
        <button
          onClick={() =>
            setState({
              ...state,
              wall: new Set(),
              wallOnhold: false,
              path: new Set(),
            })
          }
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default Canvas;
