import { Meteor } from 'meteor/meteor';
import bodyParser from "body-parser"
import table from './articles.js';

Picker.middleware(bodyParser.urlencoded({ extended: true }));

function getNumberOfConnectedClients() {
  return Meteor.default_server.stream_server.all_sockets().length.toString();
}

Picker.route('/clients', function(params, req, res, next) {
  const numberOfConnectedClients = getNumberOfConnectedClients();
  res.end(numberOfConnectedClients);
});

Picker.route('/total', function(params, req, res, next) {
  res.end(table.length);
});


Picker.route('/articles/:n', function(params, req, res, next) {
  const end = (params.n > table.length) ? table.length : params.n;
  let result = table.slice(0,end);
  result = JSON.stringify([result, table.length]);
  res.end(result);
});

Picker.route("/send", function(params, req, res, next) {

  const content = req.body;
  const objectToInsert = JSON.parse(content.data);
  table.unshift(objectToInsert);
  res.end();
})
