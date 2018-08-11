const shortId = require('shortid');
class Project{
  constructor(title){
    this.id=shortId.generate();
    this.title=title;
  }
}
module.exports=Project;