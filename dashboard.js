
const checkVar = (varName, jsonObj) => {
    if (jsonObj === undefined) {
        return varName + ' not found!';
    }
    return jsonObj;
}

const secondsToTime = (seconds) => {
    let minute = Math.floor(seconds / 60);
    let second = seconds - (minute * 60);
    return minute + ':' + second;
}

const progressBar = (progress) => {
    let prog = Math.floor(progress);
    let left = 100 - prog;

    const x = `
        <div class="progressBar">
            <table class="progbar">
                <tr>
                    <td style="width:${prog}%; background-color:blue;"></td>
                    <td style="width:${left}%;"></td>
                </tr>
            </table>
        </div>
    `
    return x;

}

const loadWebCam = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/webcamoption", false);
    xhttp.send();
    const webcamjson = JSON.parse(xhttp.responseText);
    let webcampoption = 'screenshot';
    try {
        webcampoption = webcamjson.webcam;
    } catch (ex) {};

    if (webcampoption == 'stream') {
        document.getElementById('webcaminfo').innerHTML = '<img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 25%); height: 480px;" src="/webcamstream"></img>';    
    } else {
        xhttp.open("GET", "/webcamafter", false);
        xhttp.send();
        document.getElementById('webcaminfo').innerHTML = xhttp.responseText;
    }
}

const loadJobInfo = () => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/job", false);
    xhttp.send();

    const jobInfo = JSON.parse(xhttp.responseText);

    let fileName = 'file name not found!';
    let fileSize = 'file size not found!';
    let fileDate = 'file date not found!';
    let progComplete = 'progress completion not found!';
    let progPrintTime = 'progress printTime not found!';
    let progPrintTimeLeft = 'progress printTimeLeft not found!';



    try {
        fileName = jobInfo.job.file.name;
    } catch (ex) {};
    try {
        fileSize = jobInfo.job.file.size;
    } catch (ex) {};
    try {
        fileDate = new Date(jobInfo.job.file.date * 1000);
    } catch (ex) {};
    try {
        progComplete = jobInfo.progress.completion;
    } catch (ex) {};
    try {
        progPrintTime = secondsToTime(jobInfo.progress.printTime);
    } catch (ex) {};
    try {
        progPrintTimeLeft = secondsToTime(jobInfo.progress.printTimeLeft);
    } catch (ex) {};


    const x = `
        <div class="jobbody">
            <div id="fileName">Filename: ${fileName}</div>
            <div id="fileSize">File size: ${fileSize}</div>
            <div id="fileDate">File date: ${fileDate}</div>
            <div>${progressBar(progComplete)}</div>
            <div id="progComplete">Progress Complete: ${progComplete}</div>
            <div id="printTime">Print Time: ${progPrintTime}</div>
            <div id="printTimrLeft">Print Time Left: ${progPrintTimeLeft}</div>
        </div>
    `

    document.getElementById('jobinfo').innerHTML = x;

}

const loadPrinterInfo = () => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/printer", false);
    xhttp.send();

    const printInfo = JSON.parse(xhttp.responseText);

    let bedAct = 'bed actual not found!';
    let bedTar = 'bed target not found!';
    let tool0Act = 'tool0 actual not found!';
    let tool0Tar = 'tool0 target not found!';

    try {
        bedAct = printInfo.temperature.bed.actual;
    } catch (ex) {};
    try {
        bedTar = printInfo.temperature.bed.target;
    } catch (ex) {};
    try {
        tool0Act = printInfo.temperature.tool0.actual;
    } catch (ex) {};
    try {
        tool0Tar = printInfo.temperature.tool0.target;
    } catch (ex) {};

    const x = `
        <div class="temps">
            <table class="temps">
                <tr>
                    <td></td>
                    <td>Actual</td>
                    <td>Target</td>
                    <td></td>
                    <td>Actual</td>
                    <td>Target</td>
                </tr>
                <tr>
                    <td>Bed</td>
                    <td class="bedact">${bedAct}</td>
                    <td class="bedtar">${bedTar}</td>
                    <td>Tool0</td>
                    <td class="t0act">${tool0Act}</td>
                    <td class="t0tar">${tool0Tar}</td>
                </tr>
            </table>
        </div>
    `

    document.getElementById('tempinfo').innerHTML = x;

    updateGraph(tempToolData,tool0Act,tempBedData,bedAct);

}

let tempToolData = new Array();
let tempBedData = new Array();


const updateGraph = (currToolData, newToolTemp, currBedData, newBedTemp) => {
    if (currToolData.length > 25) {
        currToolData.shift()
    }
    currToolData.push(newToolTemp);

    if (currBedData.length > 25) {
        currBedData.shift()
    }
    currBedData.push(newBedTemp);

    let retVal = "<svg width=\"325\" height=\"225\">";
    retVal += "<rect width=\"270\" height=\"225\" style=\"fill:rgb(200,200,200);stroke-width:3;stroke:rgb(0,0,0)\" />";
    retVal += "<text x=\"275\" y=\"15\" fill=\"White\">225 C</text>";
    retVal += "<text x=\"275\" y=\"220\" fill=\"White\">0 C</text>";
    for (let i = 0; i < currToolData.length; i++) {
        retVal += buildToolLine(currToolData[i], currToolData[i-1], i);
        retVal += buildBedLine(currBedData[i], currBedData[i-1], i);
    }

    retVal += "</svg>";
    document.getElementById("graph").innerHTML = retVal;
}

const buildToolLine = (next, previous, index) => {
    return buildLine(next, previous, index, "rgb(255, 0, 0)")
}

const buildBedLine = (next, previous, index) => {
    return buildLine(next, previous, index, "rgb(75, 75, 255)")
}

const buildLine = (next, previous, index, color) => {
    if (next == null) return "Sorry, your browser does not support inline SVG.";
    if (previous == null) return "";
    var x1Val = index * 10;
    var x2Val = (index+1) * 10;
    var y1Val = 225 - previous;
    var y2Val = 225 - next;
    return "<line x1=\""+x1Val+"\" y1=\""+y1Val+"\" x2=\""+x2Val+"\" y2=\""+y2Val+"\" style=\"stroke:"+color+";stroke-width:2\" />";
}

//Uncomment to have it load as soon as page loads. Else wait on the timers below.
//loadWebCam();
//loadJobInfo();
//loadPrinterInfo();

let jobID = setInterval(loadJobInfo, 5000);
let printerID = setInterval(loadPrinterInfo, 5000);
let webcamID = setInterval(loadWebCam, 10000);
