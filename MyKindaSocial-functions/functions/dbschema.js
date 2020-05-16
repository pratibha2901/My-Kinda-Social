let db={
    users=[
    {
        _userId:'EHmYoTZAVehOTAZKudvVH6aBfyA2',
        email :'aushirocks.mishra@gmail.com',
        handle:'aushi',
        createdOn:'2020-05-01T06:21:56.113Z',
        imageURL:'https://firebasestorage.googleapis.com/v0/b/socialmedia-learning.appspot.com/o/1616.jpeg?alt=media',
        bio:'Hey There',
        website:'https://mywebsite.com',
        location :'india'
    }
],
    Screams:[
        {
            userHanndle:'user',
            body:'this is scream body',
            createdOn:'2020-05-01T06:21:56.113Z',
            likeCount:5,
            commentCount:2

        }
    ],
    comments:[
        {
            userHanndle:'user',
            screamId:'q2fVlHzPYq8JqYyUAf9I',
            body:'nice one',
            createdOn:'2020-05-01T06:21:56.113Z',
           

        }
    ],
    notifications:[
        {
            recipient:'user',
            sender:'pratibha',
            read:'true|false',
            screamId:'q2fVlHzPYq8JqYyUAf9I',
            type:'like|comment',
            createdOn:'2020-05-01T06:21:56.113Z'
        }
    ]

}
const userDetails={
    //Redux data
    credentials:
    {
        _userId:'EHmYoTZAVehOTAZKudvVH6aBfyA2',
        email :'aushirocks.mishra@gmail.com',
        handle:'aushi',
        createdOn:'2020-05-01T06:21:56.113Z',
        imageURL:'https://firebasestorage.googleapis.com/v0/b/socialmedia-learning.appspot.com/o/1616.jpeg?alt=media',
        bio:'Hey There',
        website:'https://mywebsite.com',
        location :'india'
    },
    likes:[
        {
           userHanndle:'aushi',
           screamId:'q2fVlHzPYq8JqYyUAf9I'
        },
        {
            userHanndle:'user',
            screamId:'9dDlbv6DpPuL8ee1qSoH'
        }
    ]
}