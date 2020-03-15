const Post = {
    author(parent, args, {db}, info) {
        return db.users.find((user) => user.id === parent.authorId)
    },
    comments(parent, args, {db}, info) {
        return db.comments.filter(comment => comment.postId === parent.id)
    }
}

export default Post;