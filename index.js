const { ApolloServer } = require('apollo-server');
const { readFileSync } = require('fs')

const resolvers = require('./resolvers')
const typeDefs = readFileSync('./schema.graphql').toString('utf-8')

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 4000 }, () =>
  console.log(`Listening on http://localhost:4000/graphql`)
);
