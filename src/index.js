import {GraphQLServer} from 'graphql-yoga';

// Scalar types : String / Int / Float / Boolean / ID


// Types definitions
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        id() {
            return 'xyz123';
        },
        name() {
            return 'MacBook Pro';
        },
        price() {
            return 3699.99;
        },
        releaseYear() {
            return 2015;
        },
        rating() {
            return 8.5;
        },
        inStock() {
            return false;
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start({port: 2000}, () => console.log('Server is running'));