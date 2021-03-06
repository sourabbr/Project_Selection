var xlsx2json = require('xlsx2json');
const import_xlsx = (response, db) => {
  xlsx2json(
    'imports/projects.xlsx',{
        sheet:0
    })
    .then(jsonArray => {
      response.json(
        {
          projects:jsonArray,
        }
      );
  });
}

module.exports = (app,io, db) => {
    app.get("/import", function (request, response) {
        import_xlsx(response, db);
    });
};