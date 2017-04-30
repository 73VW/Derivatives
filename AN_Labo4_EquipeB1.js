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

var h = 1; // TOOD: optimise h value!!
var n = 100; //n for the cos approximation with Taylor
var interval = [-50, 50];

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
    for (let i = start; i <= stop; i += 0.02) {
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
        // marker: {
        //     color: 'rgb(41, 128, 185)'
        // },
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
            family: 'Gill Sans, Verdana, Arial',
            color: 'rgb(4, 147, 114)',
            //   family: 'Arial, sans-serif',
            size: 14
        },
        xaxis: {
            range: [interval[0], interval[1]],
            title: 'x',
            zeroline: true,
            zerolinewidth: 2
        },
        yaxis: {
            range: [-2, 2],
            title: 'f(x)',
            zeroline: true,
            zerolinewidth: 2
        },
        title: "Cosine without trigonometric functions"
    };

    Plotly.newPlot($('plotly'), data, layout);

    window.addEventListener('resize',
        () => {
            Plotly.newPlot($('plotly'), data, layout);
        });
}

/*******************************************************/
/*  Functions                                          */
/*******************************************************/

// Recursive function which return the factorial of his input
function factorial(x) {
    if (x == 0) {
        return 1;
    }

    return x * (factorial(x - 1));
}

// Taylor serie which approximate cos(x)
function cos(x) {
    var result = 0;
    for (let i = 0; i < n; i++) {
        result += (Math.pow(-1, i) * Math.pow(x, 2 * i) / factorial(2 * i));
    }

    return result;
}

// Approximate the derivative of cos(x) with the 4th degree polynomial
function fPrime(x) {
    return (8 * (cos(x + h / 2) - cos(x - h / 2)) - cos(x + h) + cos(x - h)) / 6 * h;
}

// Approximate the second derivative of cos(x) with the centered difference
function fSecond(x) {
    return (cos(x + h) + cos(x - h) - 2 * cos(x)) / Math.pow(h, 2);
}

// Approximate the second derivative of cos(x) with the first derivative
// function fSecond(x) {
//     return (8 * (fPrime(x + h / 2) - fPrime(x - h / 2)) - fPrime(x + h) + fPrime(x - h)) / 6 * h;
// }

/*******************************************************/
/*  HTML/User interactions                             */
/*******************************************************/

// Solve the function and ask plotly to plot it
function solve() {
    var data = [];

    //Cosinus
    let pointsCos = generatePointsToDraw(cos, interval[0], interval[1]);
    data[0] = creatingData(pointsCos, "cos(x)");

    //First derivative
    let pointsFirst = generatePointsToDraw(fPrime, interval[0], interval[1]);
    data[1] = creatingData(pointsFirst, "cos'(x)");

    //Second derivative
    let pointsSecond = generatePointsToDraw(fSecond, interval[0], interval[1]);
    data[2] = creatingData(pointsSecond, "cos''(x)");

    plot(data);
}
