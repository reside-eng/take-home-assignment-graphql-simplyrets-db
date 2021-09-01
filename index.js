const express = require('express');
const typeDefs = require('./types/index');
const resolvers = require('./types/resolvers');
const LocalDb = require('./datasources/localDb');
const SimplyRets = require('./datasources/simplyRets');

// Hard-coding uri and db name. In production code, I would pull these from a config value.
const localDb = new LocalDb('mongodb://127.0.0.1:27017/', 'properties');
const simplyRets = new SimplyRets('https://api.simplyrets.com');

const { ApolloServer } = require('apollo-server-express');
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            localDb: localDb,
            simplyRets: simplyRets
        };
    },
    context: async ({req}) => {
        // A more robust authorization would be needed for production.
        const token = req.headers.authorization || '';
        const user = await localDb.getUser(token);
        return {user};
    }
});

server.start().then(async () => {
    // putting this code here to easily allow for async/await
    await localDb.init();
    const app = express();
    server.applyMiddleware({ app, path:"/graphql" });

    app.listen({ port: 4000 }, () =>
    console.log(`Listening on http://localhost:4000/graphql`)
);

}, (e) => {
    console.log(e);
});

