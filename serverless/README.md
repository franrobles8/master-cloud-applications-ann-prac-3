# serverless

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- src - Code for the application's Lambda function.
- template.yaml - A template that defines the application's AWS resources.
- package.json 
- postman.json - A postman collection for lambda resources

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Deploy the application

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 10](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
serverless$ sam build
```

The SAM CLI installs dependencies defined in `serverless/package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

The SAM CLI can also emulate your application's API. Use the `sam local start-api --env-vars env.json` to run the API locally on port 3000.

```bash
serverless$ sam local start-api
serverless$ curl http://localhost:3000/
```
## Resources

There are 3 dynamodb tables that are generated from the SAM template:

- books
- users
- comments

Next the table with all **lambdas** created (they have associated a policy to allow the access to dynamodb):

| lambda                         | endpoint                                | method |
|--------------------------------|-----------------------------------------|--------|
| booksGetAllBooksFunction       | /api/v1/books/                          | GET    |
| booksGetBookByIdFunction       | /api/v1/books/{id}                      | GET    |
| booksCreateBookFunction        | /api/v1/books/                          | POST   |
| booksUpdateBookFunction        | /api/v1/books/{id}                      | PATCH  |
| booksDeleteBookFunction        | /api/v1/books/{id}                      | DELETE |
| usersGetAllUsersFunction       | /api/v1/users/                          | GET    |
| usersGetUserByIdFunction       | /api/v1/users/{id}                      | GET    |
| usersCreateUserFunction        | /api/v1/users/                          | POST   |
| usersUpdateUserFunction        | /api/v1/users/{id}                      | PATCH  |
| usersDeleteUserFunction        | /api/v1/users/{id}                      | DELETE |
| commentsGetAllCommentsFunction | /api/v1/books/{id}/comments             | GET    |
| commentsGetCommentByIdFunction | /api/v1/books/{id}/comments/{commentId} | GET    |
| commentsCreateCommentFunction  | /api/v1/books/{id}/comments             | POST   |
| commentsUpdateCommentFunction  | /api/v1/books/{id}/comments/{commentId} | PATCH  |
| commentsDeleteCommentFunction  | /api/v1/books/{id}/comments/{commentId} | DELETE |

For each "resource" type, we have created different handler files:

- Books handlers are in `books.js` file.
- Comments handlers are in `comments.js` file.
- Users handlers are in `users.js` file.

In each handler, we control the exceptions when calling to the dbManager functions to fetch the information from the tables we defined in the SAM template and throw custom HTTP errors. DTOs are being controlled in the response of the dbManager functions.

When the serverless app is deployed, it automatically creates all the needed resources that are abstracted from the SAM template, such as the API Gateway, S3 Buckets...