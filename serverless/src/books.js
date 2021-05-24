const dbManager = require("./dbManager");

// Books
exports.lambdaGetAllBooks = async (event, context) => {
  try {
    const books = await getAllBooks();
    return books;
  } catch(error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
};
exports.lambdaGetBookById = async (event, context) => {
  try {
    return await getBookById(event.pathParameters.id);
  } catch(error) {
    console.log(error);
    if(error.status !== 500) {
      return createResponse(error.status, error.message);
    }
    return createResponse(500, `Something went wrong`);
  }
}
exports.lambdaCreateBook = async (event, context) => 
{
  try {
    const book = await createBook(event.body);
    return book;
  } catch(error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
}

exports.lambdaUpdateBook = async (event, context) => 
{
  try {
    const book = await updateBook(event.pathParameters.id,event.body);
    return book;
  } catch(error) {
    console.log(error);
    if(error.status !== 500) {
      return createResponse(error.status, error.message);
    }
    return createResponse(500, `Something went wrong`);
  }
}

exports.lambdaDeleteBook = async (event, context) => 
{
  try {
    const book = await deleteBook(event.pathParameters.id);
    return book;
  } catch(error) {
    console.log(error);
    if(error.status !== 500) {
      return createResponse(error.status, error.message);
    }
    return createResponse(500, `Something went wrong`);
  }
}

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
  return createResponse(200, book);
};

const createBook = async (payload) => {
  payload = JSON.parse(payload);

  const book = await dbManager.createBook(payload);

  // TO-DO: Transform response from db to dtoResponse

  return createResponse(201, book);
};

const updateBook = async (id, payload) => {
  payload = JSON.parse(payload);
  const book = await dbManager.updateBook(id, payload);
  return createResponse(200, book);
};

const deleteBook = async (id) => {

  const deletedBook = await dbManager.deleteBook(id);

  // TO-DO: Transform response from db to dtoResponse

  return createResponse(200, deletedBook);
};
