const uuid = require("uuid");
const AWS = require("aws-sdk");
const HTTPError = require("./http-error");

const createClient = () => {
  let options = {};
  options.region = process.env.AWS_REGION || "eu-west-2";
  options.endpoint = process.env.ENDPOINT_OVERRIDE
    ? process.env.ENDPOINT_OVERRIDE
    : "https://dynamodb.eu-west-2.amazonaws.com";
  return new AWS.DynamoDB.DocumentClient(options);
};

const docClient = createClient();
const booksTable = "books";
const usersTable = "users";

const getAllBooks = async () => {
  const params = {
    TableName: booksTable,
  };

  const response = await docClient.scan(params).promise();

  return response.Items;
};

const getBookById = async (id) => {
  const params = {
    TableName: booksTable,
    Key: {
      id,
    },
  };
  const book = await docClient.getItem(params).promise();

  if (!book) {
    throw new HTTPError(404, "Book not found");
  }

  return book.Item;
};

const createBook = (payload) => {
  const params = {
    TableName: booksTable,
    Item: {
      id: uuid.v1(),
      ...payload,
    },
  };

  return docClient.put(params).promise();
};

const updateBook = (id, payload) => {
  getBookById(id);

  const params = {
    TableName: booksTable,
    Item: {
      id,
      ...payload,
    },
  };

  return docClient.put(params).promise();
};

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
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
};
