const fs = require('fs');
const xlsx = require('better-xlsx');
const path = require("path");

const export_xlsx = (response, db) => {

    let registrations = db.get('registrations').value();
    let file = new xlsx.File();
    let sheet = file.addSheet('Sheet1');

    let header = sheet.addRow(); //headers for the columns
    for (let column of ['Timestamp','Email','Allotted Project Title','Guide','Choice 1','Guide 1','Choice 2','Guide 2','Choice 3','Guide 3','USN1','USN2','USN3','USN4']) {
        let heading = header.addCell();
        heading.value = column;
    }

    for (let registration of registrations) {
        let row = sheet.addRow();
        for (let item in registration) {
            if (typeof registration[item] === "string"){  //if it is a string
              let cell = row.addCell();
              cell.value = registration[item];
            }
            else if (typeof registration[item] === "object"){ //if it is a list
              for (let USN of registration[item]){
                let cell = row.addCell();
                cell.value = USN;
              }
            }
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
        .pipe(fs.createWriteStream(path.join(__dirname, '../exports/registrations.xlsx')))
        .on('finish', () => {
            console.log('Done.');
            response.redirect('/exports/registrations.xlsx');
        });

};

module.exports = (app, db) => {
    app.get("/export01110011", function (request, response) {
        export_xlsx(response, db);
    });
};