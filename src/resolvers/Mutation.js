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
    updatePost(parent, {id, data}, {db}, info) {
        let post = db.posts.find(post => post.id === id)
        if (!post) {
            throw new Error('Post not found')
        }
        post = {
            ...post,
            ...data
        }
        db.posts = db.posts.map(item => item.id === id ? post : item) 
        return post
    },
    updateComment(parent, args, { db }, info) {
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
        return comment
    }
}

export default Mutation;