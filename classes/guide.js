const shortId = require('shortid');
class Guide{
  constructor(name){
    this.id=shortId.generate();
    this.name=name;
  }
}
module.exports=Guide;