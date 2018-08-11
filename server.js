const express = require('express')

const http = require('http')
const express_force_ssl = require('express-force-ssl');
const controller = require("./controllers/controller");


const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.enable('trust proxy');
 
app.use(express_force_ssl);
controller(app,io);
const listener = server.listen(process.env.PORT, function () {
  console.log('Listening on port ' + listener.address().port);
});

