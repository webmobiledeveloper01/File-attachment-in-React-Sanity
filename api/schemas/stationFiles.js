const fileAsset = {
    name: 'file', // Name of the field in Sanity Studio
    title: 'File', // Title displayed in Sanity Studio
    type: 'file', // Type of the field
    options: {
        accept: '.pdf,.xls,.xlsx,.doc,.docx' // File types to accept
    }
};

export default {
    name: 'stationFile',
    title: 'StationFile',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {
            name: 'userName',
            title: 'UserName',
            type: 'string' 
        },
        {
            name: 'stationID',
            title: 'StationID',
            type: 'string' 
        },
        {
            name: 'userId',
            title: 'UserId',
            type: 'string'
        },
        fileAsset,
    ]
}