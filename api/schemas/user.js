export default { //schema for user
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
           name: 'userName',
           title: 'UserName',
           type: 'string' 
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
               hotspot: true //it allows rosponsively adapt the images to different aspect ratios at display time
            }
         },
         {
            name: 'email',
            title: 'Email',
            type: 'email'
         },
         {
            name: 'password',
            title: 'Password',
            type: 'string'
         },
         {
            name: 'status',
            title: 'Status',
            type: 'string'
         }
    ]
}