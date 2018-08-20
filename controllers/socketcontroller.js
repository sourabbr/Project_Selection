const MAX_REGISTRATION_COUNT = 2;
let socketcontroller = (io, db) => {

    io.on('connection', socket => {

        const headers = socket.handshake.headers;
        console.log("User connected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);

        io.to(`${socket.id}`).emit('loadState', db.getState());

        socket.on('message', message => {
            message = message.trim();
            if (message === '')
                return;
            message = message.substring(0, 150);
            console.log('Message: "%s" from [%s]', message, headers['x-forwarded-for']);
            io.emit('message', message);
        });

        socket.on('newProject', project => {
            project={...project,available: 1};
            db.get("projects")
                .upsert(project)
                .write()
                .then(() => {
                    io.emit('addProject', project);
                });
            let guide = db.get('guides')
              .find({name:project.guide})
              .value();
            if(guide===undefined){
              db.get("guides")
                .push({name:project.guide,registeredCount:0})
                .write();
            }
            
        });

        socket.on('registerProject', project => {
          
            let usnList = db.get("registeredUSNs").value();
            for (let usn of project.teamMembers) {
                if (usnList.includes(usn)) {
                    io.to(`${socket.id}`).emit('displayAlert', `${usn} already registered`, 'warning');
                    return;
                }
            }


            db.get("registrations")
                .insertIfNotExists({Timestamp: new Date().toLocaleString(),IP:headers['x-forwarded-for'],...project})
                .write()
                .then(err => {
                    if (err) {
                        io.to(`${socket.id}`).emit('displayAlert', "Project already taken", 'warning');
                        return;
                    }
                    db.get("projects")
                        .find({title: project.title})
                        .assign({available: 0})
                        .write()
                        .then(() => {
                            db.get("registeredUSNs")
                              .push(...project.teamMembers)
                              .write()
                              .then(() => {
                                  io.emit('takenProject', project);
                                  io.to(`${socket.id}`).emit('successfullyRegistered');
                                  let guide = db.get('guides')
                                    .find({name:project.guide})
                                    .value();
                                  guide.registeredCount++;
                                  if (guide.registeredCount == MAX_REGISTRATION_COUNT){
                                    db.get("projects")
                                      .filter({guide:guide.name})
                                      .each(proj=>{
                                        proj.available=0;
                                        io.emit('removeProject',proj);
                                      })
                                      .write()                                  
                                      .then(()=>console.log(guide.name+" done"))
                                      .catch(err=>console.error(err));
                                  }
                              })
                              .catch(err=>console.error(err));
                        })
                        .catch(err=>console.error(err));
                })
                .catch(err=>console.error(err));
        });

        socket.on('disconnect', () => {
            console.log("User disconnected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);
        });

    });

};
module.exports = socketcontroller;