import uuidv4 from 'uuid/v4';

const Mutation = {
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
    createPost(parent, args, {db, pubsub}, info) {
        const userExists = db.users.some((user) => user.id === args.data.authorId);
        if (!userExists) {
            throw new Error('User not Found')
        }
        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post);
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }
        return post;
    },
    createComment(parent, args, {db, pubsub}, info) {
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
        pubsub.publish(`comment ${args.data.postId}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
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
    deletePost(parent, args, {db, pubsub}, info) {
        const post = db.posts.find(post => post.id === args.id);
        if (!post) {
            throw new Error('Post not found')
        }
        db.posts = db.posts.filter(post => post.id !== args.id);
        db.comments = db.comments.filter(comment => comment.postId !== args.id);
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        return post;
    },
    deleteComment(parent, args, {db, pubsub}, info) {
        const comment = db.comments.find(comment => comment.id === args.id);
        if (!comment) {
            throw new Error('Comment not found')
        }
        db.comments = db.comments.filter(comment => comment.id !== args.id);
        pubsub.publish(`comment ${comment.postId}`, {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        })
        return comment;
    },
    updateUser(parent, args, { db }, info) {
        const {id, data} = args
        const user = db.users.find(user => user.id === id)
        if (!user) {
            throw new Error('User not found')
        }
        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email)
            if (emailTaken) {
                throw new Error('Email already taken')
            }
            user.email = data.email
        }
        if (typeof data.name === 'string') {
            user.name = data.name
        }
        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }
        return user
    },
    updatePost(parent, {id, data}, {db, pubsub}, info) {
        let post = db.posts.find(post => post.id === id)
        const originalPost = { ...post }
        if (!post) {
            throw new Error('Post not found')
        }
        post = {
            ...post,
            ...data
        }
        db.posts = db.posts.map(item => item.id === id ? post : item)
        if (originalPost.published && !post.published) {
            // deleted
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: originalPost
                }
            })
        } else if (!originalPost.published && post.published) {
            // created
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        } else if (post.published) {
            // updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }
        return post
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const {id, data} = args;
        let comment = db.comments.find(comment => comment.id === id)
        if (!comment) {
            throw new Error('Comment not found')
        }
        comment = {
            ...comment,
            ...data
        }
        db.comments = db.comments.map(item => item.id === id ? comment : item)
        pubsub.publish(`comment ${comment.postId}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })
        return comment
    }
}

export default Mutation;