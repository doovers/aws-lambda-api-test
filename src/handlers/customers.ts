import Address from '../models/address.model';
import Customer from '../models/customer.model';
import Phone from '../models/phone.model';
import { Sequelize } from 'sequelize-typescript';

const db = new Sequelize({
  database: process.env.DB,
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  modelPaths: [__dirname + '/../models']
});

export function customer(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  // Parse request body for lambda (not required for local invocation)
  var requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    requestBody = event.body;
  }

  db.authenticate()
    .then(() => {
      switch (event.httpMethod || event.method) {
        case 'GET':
          if ((event.pathParameters && event.pathParameters.id)) {
            Customer.findById(event.pathParameters.id)
              .then(customer => {
                callback(undefined, response(200, customer));
              })
              .catch(err => {
                console.error('Sequelize:', err);
                callback(undefined, response(500, { error: err.message }));
              });
          } else {
            Customer.findAll()
              .then(customers => {
                callback(undefined, response(200, customers));
              })
              .catch(err => {
                console.error('Sequelize:', err);
                callback(undefined, response(500, { error: err.message }));
              });
          }
          break;
        case 'DELETE':
          if ((event.pathParameters && event.pathParameters.id)) {
            Customer.findById(event.pathParameters.id)
              .then(customer => {
                customer.destroy({ force: true });
                callback(undefined, response(200, customer));
              })
              .catch(err => {
                console.error('Sequelize:', err);
                callback(undefined, response(500, { error: err.message }));
              });
          } else {
            console.error('No ID parameter supplied');
            callback(undefined, response(400, { error: 'No ID parameter supplied' }));
          }
          break;
        case 'POST':
          Customer.create(requestBody)
            .then(customer => {
              customer.set('phone', Phone.create(requestBody.phone));
              customer.set('fax', Phone.create(requestBody.fax));
              customer.set('address', Address.create(requestBody.address));
              callback(undefined, response(200, customer));
            })
            .catch(err => {
              console.error('Sequelize:', err);
              callback(undefined, response(500, { error: err.message }));
            });
          break;
        case 'PATCH':
          if ((event.pathParameters && event.pathParameters.id)) {
            Customer.findById(event.pathParameters.id)
              .then(customer => {
                customer.update(requestBody)
                callback(undefined, response(200, customer));
              })
              .catch(err => {
                console.error('Sequelize:', err);
                callback(undefined, response(500, { error: err.message }));
              });
          } else {
            console.error('No ID parameter supplied');
            callback(undefined, response(400, { error: 'No ID parameter supplied' }));
          }
          break;
        default:
          console.error(`Unsupported http method ${event.httpMethod}`);
          callback(undefined, response(501, { error: `Unsupported http method ${event.httpMethod}` }));
          break;
      }
    })
    .catch(err => {
      console.error('Unknown Error:', err);
      callback(undefined, response(500, { error: err.message }));
    });
}

function response(statusCode: number, body: any) {
  return {
    headers: { 'Content-Type': 'application/json' },
    statusCode: statusCode,
    body: JSON.stringify(body)
  }
}
