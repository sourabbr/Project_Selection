var xlsx2json = require('xlsx2json');
const import_xlsx = (response, db) => {
  xlsx2json(
    'exports/registrations.xlsx',
    {
        dataStartingRow: 4,
        mapping: {
            'col_1': 'A',
            'col_2': 'B',
            'col_3': 'C'
        }
    })
    .then(jsonArray => {
      response.send(jsonArray);
  });
}

module.exports = (app, db) => {
    app.get("/import", function (request, response) {
        import_xlsx(response, db);
    });
};