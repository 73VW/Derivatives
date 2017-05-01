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


var data = [];
var interval = [-50, 50];

var workerFunction;
var workerPrime;
var workerSecond;

/*******************************************************/
/*  Web Worker                                         */
/*******************************************************/


function initWorkers(){
    if(typeof(Worker) === "undefined") {
        console.log("Sorry, your browser does not support Web Workers...");
    }
    else {
        console.log("Browser supported");

        if(typeof(workerFunction) == "undefined")
            workerFunction = new Worker("AN_Labo4_EquipeB1_Worker.js");
        if(typeof(workerPrime) == "undefined")
            workerPrime = new Worker("AN_Labo4_EquipeB1_Worker.js");
        if(typeof(workerSecond) == "undefined")
            workerSecond = new Worker("AN_Labo4_EquipeB1_Worker.js");

        workerFunction.onmessage = function(event) {
            data[0] = event.data;
            plot(data);
        };

        workerPrime.onmessage = function(event) {
            data[1] = event.data;
            plot(data);
        };

        workerSecond.onmessage = function(event) {
            data[2] = event.data;
            plot(data);
        };

        let errorFct = function(event) {
                            console.log(event.message);
                        };

        workerFunction.onerror = workerPrime.onerror = workerSecond.onerror = errorFct;
    }
}

/**************************************/
/*  Plotly.js : Plot, show axis, ...  */
/**************************************/

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
/*  HTML/User interactions                             */
/*******************************************************/

// Solve the function and ask plotly to plot it
function solve() {
    initWorkers();

    //Cosinus
    workerFunction.postMessage(['cos',interval]);

    //First derivative
    workerPrime.postMessage(['fPrime', interval]);

    //Second derivative
    workerSecond.postMessage(['fSecond', interval]);
}
