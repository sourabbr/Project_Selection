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
  
        socket.on('registerProject', (projects,teamMembers)=>{
            tryRegisterProject(projects,teamMembers,db,io,socket,headers);
        });
        
        socket.on('disconnect', () => {
            console.log("User disconnected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);
        });

    });
  
};
const tryRegisterProject = async(projects,teamMembers,db,io,socket,headers) => { 
          
  let usnList = db.get("registeredUSNs").value();
  for (let usn of teamMembers) {
      if (usnList.includes(usn)) {
          io.to(`${socket.id}`).emit('displayAlert', `${usn} already registered`, 'danger');
          return;
      }
  }
  var choices={
    choice1:projects[0].title,guide1:projects[0].guide,
    choice2:projects[1].title,guide2:projects[1].guide,
    choice3:projects[2].title,guide3:projects[2].guide
  }
  var success=false;
  for(var i=0;i<projects.length;i++)
  {
    var project=projects[i];
    
    if(success)
      return;
    
    let existingRegistration = await db.get("registrations")
                                      .find({title:project.title})
                                      .value();
    if(existingRegistration)
      continue;
    
    let guide = await db.get("guides")
                        .find({name:project.guide})
                        .value();
    
    if(guide.registeredCount >= MAX_REGISTRATION_COUNT)
      continue;

    
    await db.get("registrations")
      .push({Timestamp: new Date().toLocaleString(),IP:headers['x-forwarded-for'],...project,...choices,teamMembers})
      .write();
     
    await db.get("projects")
      .find({title: project.title})
      .assign({available: 0})
      .write();
    
    await db.get("registeredUSNs")
      .push(...teamMembers) 
      .write();

    guide.registeredCount+=1;
    
    await db.get('guides')
      .find({name:project.guide})
      .assign({registeredCount:guide.registeredCount})
      .write();
    
    console.log(guide);
    
    if (guide.registeredCount == MAX_REGISTRATION_COUNT){
      await db.get("projects")
      .filter({guide:guide.name})
      .each(proj=>{
        proj.available=0;
        io.emit('removeProject',proj);
      })
      .write();
      console.log(guide.name+" done");
    }
    io.emit('takenProject', {...project,teamMembers});
    io.to(`${socket.id}`).emit('successfullyRegistered',project.title);
    success=true;
    return;
   
 
  }
  
            
}
module.exports = socketcontroller;