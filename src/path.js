export function getNeigbours(pos, rows, cols, visited, wallSet) {
  let neighbors = [];
  let x = [-1, 1, 0, 0];
  let y = [0, 0, -1, 1];
  for (let i = 0; i < 4; i++) {
    let a = pos[0] + x[i];
    let b = pos[1] + y[i];
    if (
      rows > a &&
      a >= 0 &&
      cols > b &&
      b >= 0 &&
      !wallSet.has(a * cols + b) &&
      !visited.has(a * cols + b)
    ) {
      neighbors.push([a, b]);
    }
  }
  return neighbors;
}

function getPath(state, r, c) {
  let visited = new Set();
  let start = state.start;
  let end = state.end;
  let wall = state.wall;
  let parent = new Array(r * c).fill(-1);
  let path = new Set();
  let q = [[start.x, start.y]];
  visited.add(start.x * c + start.y);
  while (q.length > 0) {
    let current_pos = q.shift();
    if (current_pos[0] === end.x && current_pos[1] === end.y) {
      break;
    }
    let validNeigbour = getNeigbours(current_pos, r, c, visited, wall);
    validNeigbour.forEach((v) => {
      visited.add(v[0] * c + v[1]);
      parent[v[0] * c + v[1]] = current_pos[0] * c + current_pos[1];
      q.push(v);
    });
    let i = parent[end.x * c + end.y];
    while (i !== -1 && i !== start.x * c + start.y) {
      path.add(i);
      i = parent[i];
    }
  }
  return path;
}

export default getPath;
