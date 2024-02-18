export default {
    name: 'station',
    title: 'Station',
    type: 'document',
    fields : [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'note',
            title: 'Note',
            type: 'string'
        },
        {
            name: 'address',
            title: 'Address',
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
            name: 'isCompleted',
            title: 'IsCompleted',
            type: 'boolean'
        },
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy'
        },
        {
            name: 'analyzers',
            type: 'array',
            title: 'Analyzers',
            of: [
                {
                    type: 'object',
                    name: 'analyzer',
                    title: 'Analyzer',
                    fields: [
                        {name: 'id', type: 'string', title: 'Id'},
                        {name: 'model', type: 'string', title: 'Model'},
                        {name: 'sin', type: 'string', title: 'Sin'},
                        {name: 'analyzerParameter', type: 'string',  title: 'AnalyzerParameter',},
                        {name: 'isCompleted', type: 'boolean',  title: 'IsCompleted'},
                        {name: 'underRepair', type: 'boolean',  title: 'UnderRepair'}
                    ]
                }
            ]
       },
       {
            name: 'officeType',
            title: 'OfficeType',
            type: 'string'
       },
       {
        name: 'networkType',
        title: 'NetworkType',
        type: 'string'
   },
       {
        name: 'comments',
        title: 'Comments',
        type: 'array',
        of: [{type: 'comment'}]
        }
    ]
}