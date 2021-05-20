const uuid = require('uuid');
const AWS = require('aws-sdk');

const createClient = () => {
  let options = {};
  options.region = process.env.AWS_REGION || 'eu-west-2';
  options.endpoint = process.env.AWS_SAM_LOCAL ? 'http://localhost:8000' : 'https://dynamodb.eu-west-2.amazonaws.com';
  return new AWS.DynamoDB.DocumentClient(options);
}

const docClient = createClient();
const booksTable = 'books';

const getAllBooks = () => {
    const params = {
        TableName: booksTable
    };

    return docClient.scan(params).promise();
};

const createBook = (payload) => {

    const params = {
        TableName: booksTable,
        Item: {
            id: uuid.v1(),
            ...payload,
        }
    };

    return docClient.put(params).promise();
};

module.exports = {
    getAllBooks,
    createBook
};