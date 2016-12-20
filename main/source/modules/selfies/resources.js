exports = module.exports = [{
    name: 'Selfies',
    collectionName: 'selfies',
    url: '/selfies/:_id',
    params: 
    {
        _id: '@_id'
    },
    actions: 
    {
        list: 
        {
            urls: ['/selfies'],
            kind: 'find'
        },
        findById: 
        {
            kind: 'findOne'
        },
        save: 
        {
            urls: ['/selfies','/selfies/:_id'],
            kind: 'findAndModify'
        },
        delete: 
        {
            kind: 'remove'
        }
    }
}];