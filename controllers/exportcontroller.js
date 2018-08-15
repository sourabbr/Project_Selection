const fs = require('fs');
const xlsx = require('better-xlsx');
const path = require("path");

const export_xlsx = (response,db) => {
  
  let registrations=db.get("registrations").value();
  for(let registration in registrations){
    
  }
    
  const file = new xlsx.File();
  const sheet = file.addSheet('Sheet1');
  const row = sheet.addRow();
  const cell = row.addCell();

  cell.value = 'I am a cell!';
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