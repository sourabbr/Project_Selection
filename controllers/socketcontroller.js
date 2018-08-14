const shortId = require('shortid');
let socketcontroller = (io,db) => {

  io.on('connection', socket => {

    const headers = socket.handshake.headers;
    console.log("User connected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);
    
    io.to(`${socket.id}`).emit('loadState',db.getState());
              
    socket.on('message', message => {
      message = message.trim();
      if (message === '') 
        return;
      message = message.substring(0, 150);
      console.log('Message: "%s" from [%s]', message, headers['x-forwarded-for']);
      io.emit('message', message);
    });
    
    socket.on('newProject', project => {
      db.get("projects")
      .upsert(project)
      .write()
      .then(()=>{
        io.emit('addProject',project);
      });
    });
    
    socket.on('registerProject', project => {
      db.get("registrations")
      .insertIfNotExists(project)
      .write()
      .then(collection=>{
        if (collection.includes(project)){
          io.emit('takenProject', project);
        }
        else{
          io.to(`${socket.id}`).emit('projectAlreadyTaken');
        }
      })
      .catch(error=>{
        console.err(error);
      });
    });
    
    
    
    socket.on('disconnect', () => {
      console.log("User disconnected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);
    });

  });
  
}
module.exports=socketcontroller;