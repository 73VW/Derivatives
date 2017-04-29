/***********************************************************/
/*  Authors : Axel Rieben, Maël Pedretti, Quentin Vaucher  */
/*  Date : 29 April 2017                                   */
/***********************************************************/

/*******************************************************/
/*  Tools                                              */
/*******************************************************/

function $(id) {
  return document.getElementById(id);
}

function $name(name) {
  return document.getElementsByName(name);
}

var h = 0.99; // TOOD: optimise h value!!

/**************************************/
/*  Plotly.js : Plot, show axis, ...  */
/**************************************/

// Generate the points between start and stop, according to f.
// Intup: function, xStart, xStop
// Output: two values array containing two arrays, respectively for x and y values
function generatePointsToDraw(f, start, stop) {
  var xValues = [];
  var yValues = [];
  var index = 0;
  for (let i = start; i <= stop; i+= 0.02) {
    xValues[index] = i;
    yValues[index] = f(i);
    index++;
  }
  return [xValues, yValues];
}

// Create readable data for Plotly and style them a little.
// Input: The list of x values and y values [x, y] and the name of the line
function creatingData(listPoints, name) {
  var data = {
    x: listPoints[0],
    y: listPoints[1],
    mode: 'lines',
    type: 'scattergl',
    name: name,
    marker: {
      color: 'rgb(41, 128, 185)'
    },
    line: {
      width: 2
    }
  };
  return data;
}

// Plot the graph according to the given points
// Input: list of points that plotly can read
function plot(data) {
  // Everything which is related to style
  var layout = {
    font: {
      family: 'Arial, sans-serif',
      size: 20
    },
    xaxis: {
      range: [-10,10],
      title: 'x',
      zeroline: true,
      zerolinewidth: 2
    },
    yaxis: {
      range: [-2,2],
      title: 'f(x)',
      zeroline: true,
      zerolinewidth: 2
    },
    title: "Cosine without trigonometric functions"
  };

  Plotly.newPlot($('plotly'), data, layout);

  window.addEventListener('resize',
  () =>    { Plotly.newPlot($('plotly'), data, layout); });

}

/*******************************************************/
/*  Functions                                          */
/*******************************************************/

// Recursive function which return the factorial of his input
function factorial(x){
  if (x == 0) {
    return 1;
  }

  return x * (factorial(x-1));
}

// Taylor serie which approximate cos(x)
function cos(x) {
  var result = 0;
  for (var i = 0; i < 100; i++) {
    result += (Math.pow(-1, i) * Math.pow(x, 2*i) / factorial(2*i));
  }

  return result;
}

// Approximate the derivative of cos(x)
function fPrime(x) {
  return (8 * (cos(x + h/2) - cos(x - h/2)) - cos(x+h) + cos(x-h)) / 6*h;
}


/*******************************************************/
/*  HTML/User interactions                             */
/*******************************************************/

// Solve the function and ask plotly to plot it
function solve() {
  var data = [];

  var listPoints = generatePointsToDraw(fPrime, -10, 10);

  data[0] = creatingData(listPoints, "f1");

  plot(data);
}
