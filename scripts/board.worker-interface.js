jewel.board = (function() {
    var worker,
        messageCount,
        callbacks;

    function messageHandler(event) {
        console.log(event.data);

        var message = event.data;
        jewels = message.jewels;

        if (callbacks[message.id]) {
            callbacks[message.id](message.data);
            delete callbacks[message.id];
        }
        
    }

    function initialize(callback) {
        rows = jewel.settings.rows;
        cols = jewel.settings.cols;
        messageCount = 0;
        callbacks = [];
        worker = new Worker("scripts/board.worker.js");
        jewel.dom.bind(worker, "message", messageHandler);
        post("initialize", jewel.settings.callback);
    }

    function post(command, data, callback) {
        callbacks[messageCount] = callback;
        worker.postMesage({
            id : mesageCount,
            command : command,
            data : data
        });
        messageCount++;
    }

    function swap(x1,y1,x2, y2, callback) {
        post("swap", {
            x1 : x1,
            y1 : y1,
            x2 : x2,
            y2 : y2,            
        }, callback);
    };
    
    // create a copy of the jewel board
    function getBoard() {
        var copy = [], x;
        for (x = 0; x < cols; x++) {
            copy[x] = jewels[x].slice(0);
        }
        return copy;
       }

    return {
        initialize : initialize,
        swap : swap,
        getBoard : getBoard
    };

})();
