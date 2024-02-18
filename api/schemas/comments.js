export default {
    name: 'comment',
    title: 'Comments',
    type: 'document',
    fields: [
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy'
        },
        {
            name: 'commentTitle',
            title: 'CommentTitle',
            type: 'string'
        },
        {
            name: 'comment',
            title: 'Comment',
            type: 'string'
        }
    ]
}