/**
 * Starts the client and server pushing functionality
 */
var startClientServer = function() {

    //Get the URL to hand into the connect call
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);

    //Socket IO communications
    var socket = io.connect(host);

    var buffer = [];
    var minBufferSize = 50;
    var maxBufferSize = 300;
    var clientInterval = null;
    var rebuffer = true;
    var serverUpdates = 1;
    var clientUpdates = 30;

    /**
     * Repaint graph function.  This repaints the graph
     * at a timed interval
     */
    function repaintGraph() {
        $("#buffer").text(Math.floor(buffer.length / maxBufferSize * 100));
        if (!repaintGraph.init && buffer.length > 0) {
            repaintGraph.init = true;

            repaintGraph.plot = $.plot("#placeholder", [ buffer.shift() ], {
                series: {
                    shadowSize: 0	// Drawing is faster without shadows
                },
                yaxis: {
                    min: 0,
                    max: 100
                },
                xaxis: {
                    show: false
                }
            });
        } else if (!rebuffer && buffer.length > 0) {
            //If we don't have data, then we have to re-buffer
            //so there's nothing new to draw.
            repaintGraph.plot.setData([buffer.shift()]);
            repaintGraph.plot.draw();
        }
    }

    /*
     * Receiving data from the server
     */
    socket.on('dataSet', function (data) {
        if(buffer.length == 0) {
            rebuffer = true;
        } else if(buffer.length > minBufferSize){
            rebuffer = false;
        }
        if(buffer.length <= maxBufferSize) {
            buffer.push(data);
        }
    });

    //Add text to the controls
    $("#updateInterval").val(clientUpdates);
    $("#serverInterval").val(serverUpdates);

    //Client side, wake up an _independent_ amount of time
    //from the server and try to repaint.  This gives us a smooth
    //animation and nothing jerky.  You really don't want to put
    //it within the socket call.  Let that "buffer" the data
    //instead.
    clientInterval = setInterval(function () {
        repaintGraph();
    },clientUpdates);

    /*
     * The browser throttle button was clicked
     */
    $("#clientThrottleButton").click(function(){
        var v = $("#updateInterval").val();
        if (v && !isNaN(+v)) {
            clientUpdates = +v;
            if (clientUpdates < 1) {
                clientUpdates = 1;
                $("#updateInterval").val(clientUpdates);
            }
            $(this).val("" + clientUpdates);
            if(clientInterval) {
                clearInterval(clientInterval);
            }
            clientInterval = setInterval(function () {
                repaintGraph();
            },clientUpdates);
        }
    });

    /*
     * The server throttle button was clicked
     */
    $("#serverThrottleButton").click(function(){
        var v =  $("#serverInterval").val();
        if (v && !isNaN(+v)) {
            serverUpdates = +v;
            if (serverUpdates < 1) {
                serverUpdates = 1;
                $("#serverInterval").val(serverUpdates);
            }
            $(this).val("" + serverUpdates);
            //Send to the server side that we need data within
            //this interval
            socket.emit('updateInterval', serverUpdates);
        }
    });
};