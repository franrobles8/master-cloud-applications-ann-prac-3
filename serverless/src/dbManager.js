const uuid = require("uuid");
const AWS = require("aws-sdk");
const { HTTPError } = require("./http-error");

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
const commentsTable = "comments";
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
  await getBookById(id);

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

const deleteBook = async (id) => {
  await getBookById(id);

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

const getAllUsers = async () => {
  const params = {
    TableName: usersTable,
  };

  const users = await docClient.scan(params).promise();
  return users.Items;
};

const getUserById = async (id) => {
  const params = {
    TableName: usersTable,
    Key: {
      id,
    },
  };
  const user = await docClient.get(params).promise();

  if (!user.Item) {
    throw new HTTPError(404, "User not found");
  }

  return user.Item;
};

const createUser = async (payload) => {
  const params = {
    TableName: usersTable,
    Item: {
      id: uuid.v1(),
      nick: payload.nick,
      email: payload.email
      
    },
  };

  await docClient.put(params).promise();
  return params.Item;
};

const updateUser = async (id, payload) => {
  getUserById(id);

  const params = {
      TableName: usersTable,
      Item: {
        id: id,
        nick: payload.nick,
        email: payload.email
        
      },
    };

  await docClient.put(params).promise();
  return params.Item;
};

const deleteUser = async (id, payload) => {
  const params = {
    TableName: usersTable,
    Key: {
        id
    },
    ReturnValues: 'ALL_OLD'
  };

  const user = await docClient.delete(params).promise();
  return user.Attributes;
}

const getAllComments = async () => {
  const params = {
    TableName: commentsTable,
  };

  const comments = await docClient.scan(params).promise();

  return comments.Items;
};

const getCommentById = async (bookId, commentId) => {
  await getBookById(bookId);

  const params = {
    TableName: commentsTable,
    Key: {
      id: commentId,
    },
  };
  const comment = await docClient.get(params).promise();

  if (!comment.Item) {
    throw new HTTPError(404, "Comment not found");
  }

  return comment.Item;
};

const createComment = async (bookId, payload) => {
  
  await getBookById(bookId);
  // const user = await getUserByUserNick(payload.userNick);

  const params = {
    TableName: commentsTable,
    Item: {
      id: uuid.v1(),
      bookId,
      // userId: user.id,
      ...payload,
    },
  };
  await docClient.put(params).promise();
  return params.Item;
};

const updateComment = async (bookId, commentId, payload) => {
  await getCommentById(bookId, commentId);

  const params = {
    TableName: commentsTable,
    Item: {
      id: commentId,
      comment: payload.comment,
      userNick: payload.userNick,
      score: payload.score
    },
  };

  await docClient.put(params).promise();
  return params.Item;
};

const deleteComment = async (bookId, commentId) => {
  await getCommentById(bookId, commentId);

  const params = {
    TableName: commentsTable,
    Key: {
        id: commentId
    },
    ReturnValues: 'ALL_OLD'
  };

  const comment = await docClient.delete(params).promise();
  return comment.Attributes;
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
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
};
