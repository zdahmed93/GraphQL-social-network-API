const User = {
    posts(parent, args, {db}, info) {
        return db.posts.filter((post) => post.authorId === parent.id)
    },
    comments(parent, args, {db}, info) {
        return db.comments.filter(comment => comment.authorId === parent.id)
    }
}

export default User;