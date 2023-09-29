import { ApolloServerExpressConfig } from 'apollo-server-express';
import { Forum } from '../interfaces/forum.interface';
import { User } from '../interfaces/user.interface';
import { Message } from '../interfaces/message.interface';
import { Context } from '../interfaces/context.interface';

const getUserById = (userId: string, context: Context): User | undefined => {
  const user = context.users.find((user) => user.id === userId);

  if (user) {
    return user;
  } else {
    throw new Error(`The User with ID "${userId}" does not exist.`);
  }
};

const getForumById = (forumId: string, context: Context): Forum | undefined => {
  const forum = context.forums.find((forum) => forum.id === forumId);

  if (forum) {
    return forum;
  } else {
    throw new Error(`The Forum with ID "${forumId}" does not exist.`);
  }
};

type ForumAndUser = {
  forum: Forum;
  user: User;
};

const resolvers: ApolloServerExpressConfig['resolvers'] = {
  Query: {
    getUsers: (_parent, _args, context: Context): User[] => context.users,
    getForums: (_parent, _args, context: Context): Forum[] => context.forums,
    getForum: (_parent, { forumId }: { forumId: string }, context: Context) =>
      getForumById(forumId, context),
    getUserJoinedForums: (
      _parent,
      { userId }: { userId: string },
      context: Context
    ): Forum[] | undefined => getUserById(userId, context)?.forums,
    getMessages: (
      _parent,
      { forumId }: { forumId: string },
      context: Context
    ): Message[] => {
      getForumById(forumId, context);

      return context.messages
        .filter((message) => message.forumId === forumId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  },

  Mutation: {
    createForum: (
      _parent,
      { name, userId }: { name: string; userId: string },
      context: Context
    ): Forum | undefined => {
      const user = getUserById(userId, context);

      if (name.trim().length <= 0) {
        throw new Error(`Field "name" cannot be empty.`);
      }

      if (user) {
        const newForum = {
          id: `${context.forums.length + 1}`,
          name,
          users: [user],
          messages: [],
        };

        context.forums.push(newForum);

        return newForum;
      }
    },

    joinForum: (
      _parent,
      { userId, forumId }: { userId: string; forumId: string },
      context: Context
    ): ForumAndUser | undefined => {
      const user = getUserById(userId, context);
      const forum = getForumById(forumId, context);

      if (user && forum) {
        if (user.forums.some((joinedForum) => joinedForum.id === forumId)) {
          throw new Error(
            `User with ID ${userId} is already a member of the forum with ID ${forumId}.`
          );
        }

        if (forum.users.some((forumUser) => forumUser.id === userId)) {
          throw new Error(
            `Forum with ID ${forumId} already contains the user with ID ${userId}.`
          );
        }

        user.forums.push(forum);
        forum.users.push(user);

        return {
          forum,
          user,
        };
      }
    },

    postMessage: (
      _parent,
      args: { userId: string; forumId: string; text: string },
      context: Context
    ): Message | undefined => {
      const { userId, forumId, text } = args;
      const user = getUserById(userId, context);
      const forum = getForumById(forumId, context);

      if (text.trim().length <= 0) {
        throw new Error(`Field "text" cannot be empty.`);
      }

      if (user && forum) {
        if (!user.forums.some((forum) => forum.id === args.forumId)) {
          throw new Error(
            `User with ID "${userId}" is not a member of the forum.`
          );
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
      } 
    },
  },
};

export default resolvers;
