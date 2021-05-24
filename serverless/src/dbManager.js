const uuid = require("uuid");
const AWS = require("aws-sdk");
const HTTPErrors = require("./http-error");

const HTTPError = HTTPErrors.HTTPError

const createClient = () => {
  let options = {};
  options.region = process.env.AWS_REGION || "eu-west-2";
  options.endpoint = process.env.ENDPOINT_OVERRIDE
    ? process.env.ENDPOINT_OVERRIDE
    : 'http://172.17.0.1:8000/'; //"https://dynamodb.eu-west-2.amazonaws.com";
  return new AWS.DynamoDB.DocumentClient(options);
};

const docClient = createClient();
const booksTable = "books";
const usersTable = "users";

const getAllBooks = async () => {
  const params = {
    TableName: booksTable,
  };

  const books = await docClient.scan(params).promise();
  return books.Items;
};

const getBookById = async (id) => {
  const params = {
    TableName: booksTable,
    Key: {
      id,
    },
  };
  const book = await docClient.get(params).promise();

  if (!book.Item) {
    throw new HTTPError(404, "Book not found");
  }

  return book.Item;
};

const createBook = async (payload) => {
  const params = {
    TableName: booksTable,
    Item: {
      id: uuid.v1(),
      title: payload.title,
      summary: payload.summary,
      author: payload.author,
      publisher: payload.publisher,
      publicationYear: payload.publicationYear
    },
  };

  await docClient.put(params).promise();
  return params.Item;
};

const updateBook = async (id, payload) => {
  getBookById(id);

  const params = {
    TableName: booksTable,
    Item: {
      id: id,
      title: payload.title,
      summary: payload.summary,
      author: payload.author,
      publisher: payload.publisher,
      publicationYear: payload.publicationYear
    },
  };

  await docClient.put(params).promise();
  return params.Item;
};

const deleteBook = async (id, payload) => {
  const params = {
    TableName: booksTable,
    Key: {
        id
    },
    ReturnValues: 'ALL_OLD'
  };

  const book = await docClient.delete(params).promise();
  return book.Attributes;
}

const getAllUsers = () => {
  const params = {
    TableName: usersTable,
  };

  return docClient.scan(params).promise();
};

const createUser = (payload) => {
  const params = {
    TableName: usersTable,
    Item: {
      id: uuid.v1(),
      ...payload,
    },
  };

  return docClient.put(params).promise();
};

const getUserById = async (id) => {
  const params = {
    TableName: usersTable,
    Key: {
      id,
    },
  };
  const user = await docClient.get(params).promise();
  return user.Item;
};

const deleteUser = async (id) => {
  const params = {
    TableName: usersTable,
    Key: {
      id,
    },
    ReturnValues: "ALL_OLD",
  };

  const user = await docClient.delete(params).promise();
  return user.Attributes;
};

const updateUser = async (id, mail) => {
  const params = {
    TableName: usersTable,
    Key: {
      id,
    },
    UpdateExpression: "set email = :e",
    ExpressionAttributeValues: {
      ":e": email,
    },
    ReturnValues: "ALL_NEW",
  };

  const user = await docClient.update(params).promise();
  return user.Attributes;
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
};
