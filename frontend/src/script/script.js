
const socket = io.connect('http://localhost:4000', { transports : ['websocket'] });


socket.on('message', (data) => {
    console.log('Recived message from server');
    document.getElementById('status').innerHTML = data;
});
