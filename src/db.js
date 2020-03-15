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
        published: true,
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

const db = {
    users,
    posts,
    comments
}
export default db;