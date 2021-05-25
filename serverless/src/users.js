const dbManager = require('./dbManager');


exports.lambdaGetAllUsers = async (event, context) => {
  try {
    const users = await getAllUsers();
    return users;
  } catch(error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
};
exports.lambdaGetUserById = async (event, context) => {
  try {
    return await getUserById(event.pathParameters.id);
  } catch(error) {
    console.log(error);
    if(error.status !== 500) {
      return createResponse(error.status, error.message);
    }
    return createResponse(500, `Something went wrong`);
  }
}
exports.lambdaCreateUser = async (event, context) => 
{
  try {
    const user = await createUser(event.body);
    return user;
  } catch(error) {
    console.log(error);
    return createResponse(500, `Something went wrong`);
  }
}

exports.lambdaUpdateUser = async (event, context) => 
{
  try {
    const user = await updateUser(event.pathParameters.id,event.body);
    return user;
  } catch(error) {
    console.log(error);
    if(error.status !== 500) {
      return createResponse(error.status, error.message);
    }
    return createResponse(500, `Something went wrong`);
  }
}

exports.lambdaDeleteUser = async (event, context) => 
{
  try {
    const user = await deleteUser(event.pathParameters.id);
    return user;
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
  
  const getAllUsers = async () => {
    const dbUsers = await dbManager.getAllUsers();
  
    // TO-DO: Transform response from db to dtoResponse
  
    return createResponse(200, dbUsers);
  };
  
  const getUserById = async (id) => {
    const user = await dbManager.getUserById(id);
    return createResponse(200, user);
  };
  
  const createUser = async (payload) => {
    payload = JSON.parse(payload);
  
    const user = await dbManager.createUser(payload);
  
    // TO-DO: Transform response from db to dtoResponse
  
    return createResponse(201, user);
  };
  
  const updateUser = async (id, payload) => {
    payload = JSON.parse(payload);
    const user = await dbManager.updateUser(id, payload);
    return createResponse(200, user);
  };
  
  const deleteUser = async (id) => {
  
    const deletedUser = await dbManager.deleteUser(id);
  
    // TO-DO: Transform response from db to dtoResponse
  
    return createResponse(200, deletedUser);
  };