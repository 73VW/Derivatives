var h = 0.007; // TOOD: optimise h value!!
var n = 100; //n for the cos approximation with Taylor


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
    return (8 * (cos(x + h / 2) - cos(x - h / 2)) - cos(x + h) + cos(x - h)) / (6 * h);
}

// Approximate the second derivative of cos(x) with the centered difference
function fSecond(x) {
    return (cos(x + h) + cos(x - h) - 2 * cos(x)) / Math.pow(h, 2);
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
        line: {
            width: 2
        }
    };
    return data;
}

console.log("thread started");

//thread work
self.onmessage = function(e) {
    console.log("begin work");
    // Generate the points between start and stop, according to f.
    // Inupt: function, xStart, xStop
    // Output: two values array containing two arrays, respectively for x and y values
    let f;
    let fname;
    switch (e.data[0]) {
        case 'cos':
            f = cos;
            fname = 'cos(x)';
            break;
        case 'fPrime':
            f = fPrime;
            fname = 'cos\'(x)';
            break;
        case 'fSecond':
            f = fSecond;
            fname = 'cos\'\'(x)';
            break;
        default:
            break;
    }
    let interval = e.data[1];
    let xValues = [];
    let yValues = [];
    let index = 0;
    for (let i = interval[0]; i <= interval[1]; i += 0.02) {
        xValues[index] = i;
        yValues[index] = f(i);
        index++;
    }
    self.postMessage(creatingData([xValues, yValues], fname));
    console.log("finishing");
    close();
};
