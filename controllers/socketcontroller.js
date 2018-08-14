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
      .then(err=>{
        if (err){
          io.to(`${socket.id}`).emit('projectAlreadyTaken');
        }
        else{
          db.get("projects")
          .find({title:project.title})
          .assign({available:false})
          .write()
          .then(()=>{
            io.emit('takenProject', project);
            io.to(`${socket.id}`).emit('successfullyRegistered');
          })
          .catch(err=>{
            console.error(err);
          });
        }
      })
      .catch(err=>{
        console.error(err);
      });
    });
    
    
    
    socket.on('disconnect', () => {
      console.log("User disconnected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);
    });

  });
  
}
module.exports=socketcontroller;