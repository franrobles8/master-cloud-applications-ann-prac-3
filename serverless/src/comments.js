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
      event.pathParameters.commentId
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

const createComment = async (id, payload) => {
  payload = JSON.parse(payload);
  const comment = {
    comment: payload.comment,
    score: payload.score,
    user: {
      nick: payload.userNick,
      email: "user1@email.es",
    },
    id,
  };

  // TO-DO: Use real db & transform response from db to dtoResponse

  return createResponse(201, comment);
};

const deleteComment = async (id, commentId) => {
  const comment = await dbManager.deleteComment(id, commentId);

  return createResponse(comment ? 200 : 404, comment);
};

const updateComment = async (id, commentId) => {
  const comment = await dbManager.deleteComment(id, commentId);

  return createResponse(comment ? 200 : 404, comment);
};

const getAllComments = async () => {
  const comments = await dbManager.getAllComments();

  return createResponse(comments ? 200 : 404, comments);
};

const getCommentById = async (id, commentId) => {
  const comment = await dbManager.getCommentById(id, commentId);

  return createResponse(comment ? 200 : 404, comment);
};
