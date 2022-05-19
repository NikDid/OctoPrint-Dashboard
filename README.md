# OctoPrint-Dashboard
Dashboard for octoprint with some basic information and webcam view

To get dependencies run:
npm install

Configure in octoprint-dashboard.js 
* port - Port that node will run the webserver on
* X-Api-Key - generate your key in the octoprint under settings API/Application Keys
* optionsGet.host - the IP address for your octoprint
* optionsGet.port - is probably 80, but if you change it then update here

To run the application:
node .\octoprint-dashboard.js

Access it in the browser @ http://localhost:3000/