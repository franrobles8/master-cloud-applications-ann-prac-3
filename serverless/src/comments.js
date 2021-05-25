const dbManager = require("./dbManager");

exports.lambdaGetAllComments = async (event, context) => {
  try {
    return await getAllComments();
  } catch (error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
};

exports.lambdaGetCommentById = async (event, context) => {
  try {
    return await getCommentById(
      event.pathParameters.id,
      event.pathParameters.commentId
    );
  } catch (error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
};

exports.lambdaCreateComment = async (event, context) => {
  try {
    return await createComment(event.pathParameters.id, event.body);
  } catch (error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
};

exports.lambdaUpdateComment = async (event, context) => {
  try {
    return await updateComment(
      event.pathParameters.id,
      event.pathParameters.commentId,
      event.body
    );
  } catch (error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
};

exports.lambdaDeleteComment = async (event, context) => {
  try {
    return await deleteComment(
      event.pathParameters.id,
      event.pathParameters.commentId
    );
  } catch (error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
};

const createResponse = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify(message),
});

const getAllComments = async () => {
  const comments = await dbManager.getAllComments();

  return createResponse(200, comments);
};

const getCommentById = async (id, commentId) => {
  const comment = await dbManager.getCommentById(id, commentId);

  return createResponse(200, comment);
};

const createComment = async (id, payload) => {
  payload = JSON.parse(payload);

  const comment = await dbManager.createComment(id, payload);

  return createResponse(201, comment);
};

const updateComment = async (bookId, commentId, payload) => {
  payload = JSON.parse(payload);
  const comment = await dbManager.updateComment(bookId, commentId, payload);

  return createResponse(200, comment);
};

const deleteComment = async (id, commentId) => {
  const comment = await dbManager.deleteComment(id, commentId);

  return createResponse(200, comment);
};
