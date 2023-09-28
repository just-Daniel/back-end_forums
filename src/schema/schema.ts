import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    picture: String!
    forums: [Forum]!
  }
  type Forum {
    id: ID!
    name: String!
    users: [User!]!
    messages: [Message]!
  }
  type Message {
    id: ID!
    forumId: ID!
    user: User!
    text: String!
    createdAt: String!
  }
  type ForumAndUser {
    forum: Forum!
    user: User!
  }

  type Query {
    getUsers: [User!]!
    getForums: [Forum!]!
    getForum(forumId: ID!): Forum!
    getUserJoinedForums(userId: ID!): [Forum!]!
    getMessages(forumId: ID!): [Message!]!
  }

  type Mutation {
    createForum(name: String!, userId: ID!): Forum!
    joinForum(userId: ID!, forumId: ID!): ForumAndUser!
    postMessage(userId: ID!, forumId: ID!, text: String!): Message!
  }
`;

export default typeDefs;
