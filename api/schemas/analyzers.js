const fileAsset = {
    name: 'file', // Name of the field in Sanity Studio
    title: 'File', // Title displayed in Sanity Studio
    type: 'file', // Type of the field
    options: {
        accept: '.pdf,.xls,.xlsx,.doc,.docx' // File types to accept
    }
};

export default {
    name: 'analyzers',
    title: 'Analyzers',
    type: 'document',
    fields: [
        {
            name: 'analyzerParameter',
            title: 'AnalyzerParameter',
            type: 'string'
        },
        {
            name: 'analyzerMake',
            title: 'AnalyzerMake',
            type: 'string'
        },
        {
            name: 'model',
            title: 'Model',
            type: 'string'
        },
        {
            name: 'sin',
            title: 'Sin',
            type: 'string'
        },
        {
            name: 'note',
            title: 'Note',
            type: 'string'
        },
        {
            name: 'manual',
            title: 'Manual',
            type: 'string'
        },
        {
            name: 'stationBelong',
            title: 'StationBelong',
            type: 'string'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true //it allows rosponsively adapt the images to different aspect ratios at display time
            },
            
        },
        {
            name: 'attachments',
            title: 'Attachments',
            type: 'document',
            fields: [
                        {
                            name: 'name',
                            title: 'Name',
                            type: 'string'
                        },
                        {
                            name: 'type',
                            title: 'Type',
                            type: 'string' 
                        },
                        {
                            name: 'itemId',
                            title: 'ItemId',
                            type: 'string'
                        },
                        {
                            name: 'userId',
                            title: 'UserId',
                            type: 'string'
                        },
                    fileAsset,
                    ]

        },
        {
            name: 'addedBy',
            title: 'AddedBy',
            type: 'postedBy'
        },
        {
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of: [{type: 'comment'}]
        }
    ]
}