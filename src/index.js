import {GraphQLServer} from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import db from './db'


// Scalar types : String / Int / Float / Boolean / ID


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
            const db = context.db;
            const {query} = args
            if (!query) {
                return db.users
            } else {
                return db.users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
            }
        },
        posts(parent, args, {db}, info) {
            const {query} = args
            if (!query) {
                return db.posts
            } else {
                return db.posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase()))
            }
        },
        comments(parent, args, {db}, info) {
            return db.comments
        }
    },
    Mutation: {
        createUser(parent, args, {db}, info) {
            const emailAlreadyTaken = db.users.some((user) => (user.email === args.data.email));
            if (emailAlreadyTaken) {
                throw new Error('Email is already taken.')
            }
            const user = {
                id: uuidv4(),
                ...args.data
            }
            db.users.push(user);
            return user;
        },
        createPost(parent, args, {db}, info) {
            const userExists = db.users.some((user) => user.id === args.data.authorId);
            if (!userExists) {
                throw new Error('User not Found')
            }
            const post = {
                id: uuidv4(),
                ...args.data
            }
            db.posts.push(post);
            return post;
        },
        createComment(parent, args, {db}, info) {
            const userExists = db.users.some((user) => user.id === args.data.authorId);
            if (!userExists) {
                throw new Error('User not Found');
            }
            const postExistsAndPublished = db.posts.some((post) => post.id === args.data.postId && post.published)
            if (!postExistsAndPublished) {
                throw new Error('Post not found');
            }
            const comment = {
                id: uuidv4(),
                ...args.data
            }
            db.comments.push(comment);
            return comment;
        },
        deleteUser(parent, args, {db}, info) {
            const userIndex = db.users.findIndex(user => user.id === args.id);
            if (userIndex === -1) {
                throw new Error('User not found')
            }
            const deletedUsers = db.users.splice(userIndex, 1);

            db.posts = db.posts.filter(post => {
                const match = post.authorId === args.id;

                if (match) {
                    db.comments = db.comments.filter(comment => comment.postId !== post.id)
                }
                return !match;
            })
            db.comments = db.comments.filter(comment => comment.authorId !== args.id);
            return deletedUsers[0]
        },
        deletePost(parent, args, {db}, info) {
            const post = db.posts.find(post => post.id === args.id);
            if (!post) {
                throw new Error('Post not found')
            }
            db.posts = db.posts.filter(post => post.id !== args.id);
            db.comments = db.comments.filter(comment => comment.postId !== args.id);
            return post;
        },
        deleteComment(parent, args, {db}, info) {
            const comment = db.comments.find(comment => comment.id === args.id);
            if (!comment) {
                throw new Error('Comment not found')
            }
            db.comments = db.comments.filter(comment => comment.id !== args.id);
            return comment;
        }
    },
    Post: {
        author(parent, args, {db}, info) {
            return db.users.find((user) => user.id === parent.authorId)
        },
        comments(parent, args, {db}, info) {
            return db.comments.filter(comment => comment.postId === parent.id)
        }
    },
    User: {
        posts(parent, args, {db}, info) {
            return db.posts.filter((post) => post.authorId === parent.id)
        },
        comments(parent, args, {db}, info) {
            return db.comments.filter(comment => comment.authorId === parent.id)
        }
    },
    Comment: {
        author(parent, args, {db}, info) {
            return db.users.find(user => user.id === parent.authorId)
        },
        post(parent, args, {db}, info) {
            return db.posts.find(post => post.id === parent.postId)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

const port = 7000;

server.start({port}, () => console.log(`Server is running on port ${port}`));