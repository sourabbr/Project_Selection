var xlsx2json = require('xlsx2json');
const import_xlsx = (response, db) => {
  xlsx2json(
    'exports/registrations.xlsx',{
        dataStartingRow: 2,
        mapping: {
            'title': 'C',
            'guide': 'D',
            'available':1
        }
    })
    .then(jsonArray => {
      response.json(
        {
          projects:jsonArray[0]
        }
      );
  });
}

module.exports = (app, db) => {
    app.get("/import", function (request, response) {
        import_xlsx(response, db);
    });
};