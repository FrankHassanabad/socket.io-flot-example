socket.io Flot Chart Example
======================

This is an example of pushing data to a [flot charts](http://www.flotcharts.org/) through
[socket.io](http://socket.io/).  This mimics the real time updates
[example](http://www.flotcharts.org/flot/examples/realtime/index.html) from flot charts with the difference being
that instead of ajax calls it utilizes web sockets if your browser supports them.

<p align="center">
  <img src="readme-media/images/flot-chart-screen.png?raw=true" alt="Sign In"/>
</p>

# Installation
```
git clone https://github.com/FrankHassanabad/socket.io-flot-example.git
npm install
node app.js
```

Then open up a web browser to
```
http://localhost:5000/
```
