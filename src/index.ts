import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import resolvers from './resolvers/resolvers';
import typeDefs from './schema/schema';
import 'dotenv/config';
import fixtures from './fixtures/fixtures.json';

const app = express();
const PORT = process.env.PORT || 4000;

const context = () => {
  const default_user_id = '1';

  return {
    ...fixtures,
    default_user_id,
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const startServer = async () => {
  await server.start();

  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
