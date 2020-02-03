import {GraphQLServer} from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

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
        published: false,
        authorId: '2'
    },
    {
        id: 'b',
        title: 'MongoDB',
        body: 'MongoDB is a NoSQL Database',
        published: true,
        authorId: '1'
    },
    {
        id: 'c',
        title: 'NodeJS',
        body: 'NodeJS is a Javascript runtime environment',
        published: false,
        authorId: '2'
    } 

]

const comments = [
    {
        id: 'c001',
        text: 'the first comment',
        authorId: '2',
        postId: 'c'
    },
    {
        id: 'c002',
        text: 'this second comment',
        authorId: '3',
        postId: 'c'

    },
    {
        id: 'c003',
        text: 'this third comment',
        authorId: '2',
        postId: 'b'
    },
    {
        id: 'c004',
        text: 'this fourth comment',
        authorId: '3',
        postId: 'b'
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
        comments: [Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, authorId: ID!): Post!
        createComment(text: String!, authorId: ID!, postId: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers ..   
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
        },
        comments() {
            return comments
        }
    },
    Mutation: {
        createUser(parent, args, context, info) {
            const emailAlreadyTaken = users.some((user) => (user.email === args.email));
            if (emailAlreadyTaken) {
                throw new Error('Email is already taken.')
            }
            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            }
            users.push(user);
            return user;
        },
        createPost(parent, args, context, info) {
            const userExists = users.some((user) => user.id === args.authorId);
            if (!userExists) {
                throw new Error('User not Found')
            }
            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                authorId: args.authorId
            }
            posts.push(post);
            return post;
        },
        createComment(parent, args, context, info) {
            const userExists = users.some((user) => user.id === args.authorId);
            if (!userExists) {
                throw new Error('User not Found');
            }
            const postExistsAndPublished = posts.some((post) => post.id === args.postId && post.published)
            if (!postExistsAndPublished) {
                throw new Error('Post not found');
            }
            const comment = {
                id: uuidv4(),
                text: args.text,
                authorId: args.authorId,
                postId: args.postId
            }
            comments.push(comment);
            return comment;
        }
    },
    Post: {
        author(parent, args, context, info) {
            return users.find((user) => user.id === parent.authorId)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.postId === parent.id)
        }
    },
    User: {
        posts(parent, args, context, info) {
            return posts.filter((post) => post.authorId === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.authorId === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.authorId)
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.postId)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

const port = 7000;

server.start({port}, () => console.log(`Server is running on port ${port}`));