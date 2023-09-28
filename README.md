# Forum App

This is a simple GraphQL chat app built using Apollo Server, Node.js, and TypeScript. The app allows users to create and join forums, view messages, and post messages within a forum.

## Getting Started

Follow these instructions to set up and run the GraphQL server:

### Prerequisites

- [Node.js](https://nodejs.org/en/download) : Ensure you have Node.js installed on your system.
- npm or [yarn](https://classic.yarnpkg.com/lang/en/docs/install/): You'll need npm or yarn for package management.

### Installation

1. Clone the repository:

```bash
    git clone https://github.com/just-Daniel/back-end_forums.git
```

2. Go to the project directory:

```bash
    cd back-end_forums
```

3. Install project dependencies:

```bash
    npm install
    # or
    yarn install
```

### Running the Server

To start the GraphQL server, run the following command:

```bash
    npm start
    # or
    yarn start
```

The server will be accessible at
`http://localhost:4000/`

The GraphQL API is accessible at
`http://localhost:4000/graphql`

## GraphQL Schema (schema.ts)

The `schema.ts` file defines the GraphQL schema for your application. It outlines the types, queries, and mutations that your GraphQL API supports. Below is an overview of the schema and example queries/mutations:

### Types

- **User**: Represents a user with an ID, name, picture, and the forums they are a part of.
- **Forum**: Represents a chat forum with an ID, name, a list of users, and messages.
- **Message**: Represents a message with an ID, the ID of the forum it belongs to, user details, text, and the creation timestamp.
- **ForumAndUser**: A custom type combining a forum and user for specific queries.

### Queries

- **getUsers**: Get the list of all users.
- **getForums**: Get the list of all forums.
- **getForum**: Get detailed information about a specific forum.
- **getUserJoinedForums**: Get the list of forums a user has joined.
- **getMessages**: Get the list of messages in a specific forum.

### Mutations

- **createForum**: Create a new forum, specifying its name and the user creating it.
- **joinForum**: Allow a user to join a forum by providing their ID and the forum's ID.
- **postMessage**: Post a message in a forum, providing the user ID, forum ID, and message text.

## Example GraphQL Queries/Mutations

Here are some example GraphQL queries/mutations that you can use to interact with your GraphQL API:

### Create a New Forum

```bash
mutation {
  createForum(name: "New Forum", userId: "1") {
    id
    name
  }
}
```

### Join a Forum

```bash
mutation {
  joinForum(userId: "2", forumId: "1") {
    forum {
      id
      name
    }
    user {
      id
      name
    }
  }
}
```

### Post a Message in a Forum
```bash
mutation {
  postMessage(userId: "1", forumId: "1", text: "Hello, World!") {
    id
    text
    createdAt
    user {
      id
      name
    }
  }
}
```

<hr >

### Get All Users
```bash
query {
  getUsers {
    id
    name
  }
}
```

### Get Messages in a Forum
```bash
query {
  getMessages(forumId: "1") {
    id
    text
    createdAt
    user {
      id
      name
    }
  }
}

```

### Get All Forums
```bash
query {
  getForums {
    id
    name
  }
}

```

### Get Forum Info
```bash
query{
  getForum(forumId: "1") {
    id
    name
    users {
      name
    }
    messages {
      user {
        name
        picture
      }
      text
      createdAt
    }
  }
}
```



### Get the Forums to which the User is joined
```bash
query {
  getUserJoinedForums(userId: "1") {
    name
    users {
      name
      picture
    }
    messages {
      text
      createdAt
      user {
        name
      }
    }
  }
}
```

## GraphQL Resolvers (resolvers.ts)
The resolvers.ts file contains the resolver functions that define how GraphQL queries and mutations should be resolved. Resolvers specify how to fetch and manipulate data based on the schema defined in schema.ts. The resolvers ensure that your GraphQL API performs the intended actions and returns the expected data.

The resolver functions are organized into the Query and Mutation sections, corresponding to the queries and mutations in your schema. Each resolver function handles a specific GraphQL field and its behavior.




## Project Modules and Dependencies

#### Scripts - A set of scripts that can be executed using npm or yarn.

- **start**: Compiles the TypeScript code and runs the server using `node`.

```
npm start
```

- **build**: Removes the `build` directory and transpiles TypeScript using `tsc`.

```
npm run build
```

- **dev**: Uses `nodemon` to run the server for development with TypeScript source files.

```
npm run dev
```

### Dependencies

Dependencies has two types:

- **devDependencies**: Dependencies used during development and not required in production.
  - **nodemon**: Automatically restarts the server when code changes are detected.
  - **rimraf**: Removes files and directories, used for cleaning the `build` directory.
  - **ts-node**: Allows running TypeScript files directly for development.
  - **typescript**: The TypeScript compiler.
- **dependencies**: Production dependencies required to run the application in a production environment.
  - **apollo-server-express**: Integrates Apollo Server with Express.js for GraphQL API.
  - **dotenv**: Loads environment variables from a `.env` file.
  - **express**: Web server framework.
  - **graphql**: Implements the GraphQL query language.

## Project Directory Structure

This document outlines the structure of the project's `src` directory, where the primary source code is organized and stored.

#### `src/`

- **index.ts**: This serves as the main entry point for the application. It's where the Apollo Server is set up and started, the server's context is defined, and other essential configurations are initialized.

- **fixtures/**: This directory contains pre-populated data for testing and development.

- **interfaces/**: In this directory, TypeScript interface definitions are stored. Interfaces are essential for defining the shape of data objects within the application, improving type safety and code readability.

- **resolvers/**: GraphQL resolver functions are located in this directory. Resolvers are responsible for determining how GraphQL queries and mutations should be resolved, including how data is fetched and manipulated based on the schema.

- **schema/**: This directory houses the GraphQL schema definitions. The schema outlines the types, queries, and mutations that the GraphQL API supports, serving as the contract that clients use to interact with the API.
