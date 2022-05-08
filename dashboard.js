
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
            <table style="width:100%;border: 1px solid;">
                <tr style="height:50px;">
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

    xhttp.open("GET", "/webcam", false);
    xhttp.send();
    //<img id="webcam" src="http://octopi/webcam/?action=stream" />
    document.getElementById('webcaminfo').innerHTML = xhttp.responseText;
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
            Tempreture:<br />
            <table class="temps">
                <tr>
                    <td></td>
                    <td>Actual</td>
                    <td>Target</td>
                </tr>
                <tr>
                    <td>Bed</td>
                    <td>${bedAct}</td>
                    <td>${bedTar}</td>
                </tr>
                <tr>
                    <td>Tool0</td>
                    <td>${tool0Act}</td>
                    <td>${tool0Tar}</td>
                </tr>
            </table>
        </div>
    `

    document.getElementById('tempinfo').innerHTML = x;

}


loadWebCam();

let jobID = setInterval(loadJobInfo, 1000);
let printerID = setInterval(loadPrinterInfo, 1000);

