import { ApolloServerExpressConfig } from 'apollo-server-express';
import { Forum } from '../interfaces/forum.interface';
import { User } from '../interfaces/user.interface';
import { Message } from '../interfaces/message.interface';
import { Context } from '../interfaces/context.interface';

const getUserById = (userId: string, context: Context): User | undefined => {
  return context.users.find((user) => user.id === userId);
};

const getForumById = (forumId: string, context: Context): Forum | undefined => {
  return context.forums.find((forum) => forum.id === forumId);
};

type ForumAndUser = {
  forum: Forum;
  user: User;
};

const resolvers: ApolloServerExpressConfig['resolvers'] = {
  Query: {
    getUsers: (_parent, _args, context: Context): User[] => context.users,
    getForums: (_parent, _args, context: Context): Forum[] => context.forums,
    getForum: (_parent, args: { forumId: string }, context: Context) =>
      context.forums.find((i) => i.id === args.forumId),
    getUserJoinedForums: (
      _parent,
      args: { userId: string },
      context: Context
    ): Forum[] | undefined =>
      context.users.find((user) => user.id === args.userId)?.forums,
    getMessages: (
      _parent,
      args: { forumId: string },
      context: Context
    ): Message[] =>
      context.messages
        .filter((message) => message.forumId === args.forumId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  },

  Mutation: {
    createForum: (
      _parent,
      args: { name: string; userId: string },
      context: Context
    ): Forum | Error => {
      const { name, userId } = args;
      const user = getUserById(userId, context);

      if (name.trim().length <= 0) {
        throw new Error(`Field name cannot be empty`);
      }

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const newForum = {
        id: `${context.forums.length + 1}`,
        name,
        users: [user],
        messages: [],
      };

      context.forums.push(newForum);

      return newForum;
    },

    joinForum: (
      _parent,
      args: { userId: string; forumId: string },
      context: Context
    ): ForumAndUser | Error=> {
      const { userId, forumId } = args;
      const user = getUserById(userId, context);
      const forum = getForumById(forumId, context);

      if (user && forum) {
        if (!user.forums.some((forum) => forum.id === forumId)) {
          user.forums.push(forum);
        }
        if (!forum.users.some((user) => user.id === userId)) {
          forum.users.push(user);
        }
        return {
          forum,
          user,
        };
      } else {
        const errorMessage = !forum
          ? `The Forum with ID "${forumId}" does not exist.`
          : `The User with ID "${userId}" does not exist.`;

        throw new Error(errorMessage);
      }
    },

    postMessage: (
      _parent,
      args: { userId: string; forumId: string; text: string },
      context: Context
    ): Message | Error => {
      const { userId, forumId, text } = args;
      const user = getUserById(userId, context);
      const forum = getForumById(forumId, context);

      if (text.trim().length <= 0) {
        throw new Error(`Field "text" cannot be empty`);
      }

      if (user && forum) {
        if (!user.forums.some((forum) => forum.id === args.forumId)) {
          throw new Error(`User with ID "${userId}" is not a member of the forum!`);
        }

        const newMessage = {
          id: `${context.messages.length + 1}`,
          forumId,
          user,
          text,
          createdAt: new Date().toISOString(),
        };

        forum.messages.push(newMessage);
        context.messages.push(newMessage);

        return newMessage;
      } else {
        const errorMessage = !forum
          ? `The Forum with ID "${forumId}" does not exist.`
          : `The User with ID "${userId}" does not exist.`;

        throw new Error(errorMessage);
      }
    },
  },
};

export default resolvers;
