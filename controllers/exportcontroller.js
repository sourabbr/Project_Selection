const fs = require('fs');
const xlsx = require('better-xlsx');
const path = require("path");

const export_xlsx = (response,db) => {
  
  let registrations=db.get('registrations');
  let file = new xlsx.File();
  let sheet = file.addSheet('Sheet1');
  
  
  for(let registration of registrations){
    // console.log(registration);
    let row = sheet.addRow();
    // let cell1 = row.addCell();
    // cell1.value=registration.title;
    // let cell2 = row.addCell();
    // cell2.value=registration.guide;
    // let cell3 = row.addCell();
    // cell3.value=registration.teamMembers.join(',');
    for (let item in registration){
      console.log(item);
      let cell = row.addCell();
      if(typeof registration.item === "object")
        cell.value = registration.item.join("\n");
      else
        cell.value = registration.item;
    }
  }
    
 
  
  // cell.hMerge = 2;
  // cell.vMerge = 1;

//   const style = new xlsx.Style();

//   style.fill.patternType = 'solid';
//   style.fill.fgColor = '00FF0000';
//   style.fill.bgColor = 'FF000000';
//   style.align.h = 'center';
//   style.align.v = 'center';

//   cell.style = style;

  file
    .saveAs()
    .pipe(fs.createWriteStream(path.join(__dirname,'../exports/registrations.xlsx')))
    .on('finish', () => {
      console.log('Done.');
      response.redirect('/exports/registrations.xlsx');  
    });
  
}

module.exports=(app,db)=>{
  app.get("/export", function (request, response) {
    export_xlsx(response,db);
  });
}