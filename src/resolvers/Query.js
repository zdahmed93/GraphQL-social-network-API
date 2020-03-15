const Query = {
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
}

export default Query;