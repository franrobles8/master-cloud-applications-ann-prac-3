const dbManager = require('./dbManager');

exports.handler = async (event, context) => {
  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.requestContext.path.includes("/{id}")) {
          return await getBookById(event.pathParameters.id);
        } else {
          return await getAllBooks();
        }
      case "POST":
        if (event.requestContext.path.includes("/{id}/comments")) {
          return await createComment(event.pathParameters.id, event.body);
        } else {
          return await createBook(event.body);
        }
      case "DELETE":
          return await deleteComment(event.pathParameters.id, event.pathParameters.commentId);
        
      default:
        return createResponse(400, `Unsupported method ${event.httpMethod}`);
    }
  } catch (err) {
    console.log(err);
    return createResponse(500, `Something went wrong`);
  }
};

const createResponse = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify(message),
});

const getAllBooks = async () => {
  
  const dbBooks = await dbManager.getAllBooks();

  // TO-DO: Transform response from db to dtoResponse

  return createResponse(200, dbBooks);
};

const getBookById = async (id) => {
  const book = await dbManager.getBookById(id);
  return createResponse(book ? 200 : 404, book);
};

const createBook = async (payload) => {
  payload = JSON.parse(payload);

  const createdBook = dbManager.createBook(payload);

  // TO-DO: Transform response from db to dtoResponse

  return createResponse(201, createdBook);
};

const createComment = async (id, payload) => {
  payload = JSON.parse(payload);
  const comment = {
    "comment": payload.comment,
    "score": payload.score,
    "user": {
        "nick": payload.userNick,
        "email": "user1@email.es"
    },
    id
  };

  // TO-DO: Use real db & transform response from db to dtoResponse

  return createResponse(201, comment);
};

const deleteComment = async (id, commentId) => {
  const comment = dbManager.deleteComment(id, commentId);
  
    return createResponse(comment ? 200 : 404, comment);
};