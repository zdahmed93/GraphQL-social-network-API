import {GraphQLServer} from 'graphql-yoga';

// Scalar types : String / Int / Float / Boolean / ID


// Types definitions
const typeDefs = `
    type Query {
        me: User!
        post: Post!
        greeting(name: String): String!
        add(a: Float!, b: Float!): Float!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        me() {
            return {
                id: '123xyz',
                name: 'Ahmed ZRIBI',
                email: 'ahmed@test.com'
            }
        },
        post() {
            return {
                id: '010203',
                title: 'GraphQL',
                body: 'GrapgQL is awesome',
                published: false
            }
        },
        greeting(parent, args, context, info) {
            if (args.name) {
                return `Hello, ${args.name} !`
            } else {
                return 'Hello !'
            }
        },
        add(parent, args, context, info) {
            const {a, b} = args
            return a+b
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

const port = 9000;

server.start({port}, () => console.log(`Server is running on port ${port}`));