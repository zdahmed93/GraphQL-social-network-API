import {GraphQLServer} from 'graphql-yoga';

const users = [
    {
        id: '1',
        name: 'Ahmed',
        email: 'ahmed@test.com',
        age: 26
    }, 
    {
        id: '2',
        name: 'yassine',
        email: 'yassine@test.com'
    },
    {
        id: '3',
        name: 'taylor',
        email: 'taylor@test.com'
    }
]

const posts = [
    {
        id: 'a',
        title: 'React',
        body: 'React is a front end library',
        published: false
    },
    {
        id: 'b',
        title: 'MongoDB',
        body: 'MongoDB is a NoSQL Database',
        published: false
    },
    {
        id: 'c',
        title: 'NodeJS',
        body: 'NodeJS is a Javascript runtime environment',
        published: false
    } 

]
// Scalar types : String / Int / Float / Boolean / ID


// Types definitions
const typeDefs = `
    type Query {
        me: User!
        post: Post!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
        users(parent, args, context, info) {
            const {query} = args
            if (!query) {
                return users
            } else {
                return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
            }
        },
        posts(parent, args, context, info) {
            const {query} = args
            if (!query) {
                return posts
            } else {
                return posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase()))
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

const port = 9000;

server.start({port}, () => console.log(`Server is running on port ${port}`));