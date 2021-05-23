const dbManager = require('./dbManager');

exports.handler = async (event, context) => {
    try {
        switch (event.httpMethod) {
          case "GET":
            if (event.requestContext.path.includes("/{id}")) {
              return await getUserById(event.pathParameters.id);
            } else {
              return await getAllUsers();
            }
          case "POST":
              return await createUser(event.body);
          case "DELETE":
              return await deleteUser(event.pathParameters.id);
          case "PATCH":
              return await updateUser(event.pathParameters.id, event.body);
            
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
  
const getAllUsers = async () => {
    
    const dbBooks = await dbManager.getAllUsers();
  
    // TO-DO: Transform response from db to dtoResponse
  
    return createResponse(200, dbBooks);
};
  
const getUserById = async (id) => {

    const user = await dbManager.getUser(id);
    return createResponse(user ? 200 : 404, user);
};  
  
const createUser = async (payload) => {
    payload = JSON.parse(payload);
  
    const createdUser = dbManager.createUser(payload);
  
    // TO-DO: Transform response from db to dtoResponse
  
    return createResponse(201, createdUser);
};
  
const deleteUser = async (id) => {
    const user = dbManager.deleteUser(id);
  
    return createResponse(user ? 200 : 404, user);
};

const updateUser = async (id,body) => {
    body = JSON.parse(body);
    const email = body.email;

    const user = dbManager.updateUser(id, email);
  
    return createResponse(user ? 200: 404, user);
};