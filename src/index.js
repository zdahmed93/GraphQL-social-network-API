import {GraphQLServer} from 'graphql-yoga';

// Types definitions
const typeDefs = `
    type Query {
        test: String!
        fullName: String!
    }
`

// Resolvers
const resolvers = {
    Query: {
        test() {
            return ('testing first query')
        },
        fullName() {
            return 'Ahmed ZRIBI'
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start({port: 2000}, () => console.log('Server is running'));