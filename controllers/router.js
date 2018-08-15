const path = require("path");
module.exports = function (app) {

    app.get("/", function (request, response) {
        response.sendFile(path.join(__dirname, '../views/index.html'));
    });

    app.get("/admin", function (request, response) {
        response.sendFile(path.join(__dirname, '../views/admin.html'));
    });

};