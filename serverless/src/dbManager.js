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
const usersTable = 'users';

const getAllBooks = () => {
    const params = {
        TableName: booksTable
    };

    return docClient.scan(params).promise();
};

const getBookById = async (id) => {
    const params = {
      TableName: booksTable,
      Key: {
        id
      }
    };
    const user = await docClient.get(params).promise();
    return user.Item;
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

const getAllUsers = () => {
    const params = {
        TableName: usersTable
    };

    return docClient.scan(params).promise();
};

const createUser = (payload) => {

    const params = {
        TableName: usersTable,
        Item: {
            id: uuid.v1(),
            ...payload,
        }
    };

    return docClient.put(params).promise();
};


const getUserById = async (id) => {
    const params = {
      TableName: usersTable,
      Key: {
        id
      }
    };
    const user = await docClient.get(params).promise();
    return user.Item;
  };

const deleteUser = async (id) => {
    const params = {
        TableName: usersTable,
        Key: {
          id
        },
        ReturnValues: 'ALL_OLD'
      };
    
      const user = await docClient.delete(params).promise();
      return user.Attributes;
};

const updateUser = async (id, mail) => {
    const params = {
        TableName: usersTable,
        Key: {
            id
        },
        UpdateExpression: 'set email = :e',
        ExpressionAttributeValues: {
            ':e': email
        },
        ReturnValues: 'ALL_NEW'
    };

    const user = await docClient.update(params).promise();
    return user.Attributes;
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    getAllUsers,
    createUser,
    getUserById,
    deleteUser,
    updateUser
};