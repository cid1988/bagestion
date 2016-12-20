exports = module.exports = [{
    name: 'Ingresos',
    collectionName: 'ingresos',
    url: '/ingresos/:_id',
    params: 
    {
        _id: '@_id'
    },
    actions: 
    {
        list: 
        {
            urls: ['/ingresos'],
            kind: 'find'
        },
        findById: 
        {
            kind: 'findOne'
        },
        save: 
        {
            urls: ['/ingresos','/ingresos/:_id'],
            kind: 'findAndModify'
        },
        delete: 
        {
            kind: 'remove'
        }
    }
},
{
    name: 'Visitantes',
    collectionName: 'visitantes',
    url: '/visitantes/:_id',
    params: 
    {
        _id: '@_id'
    },
    actions: 
    {
        list: 
        {
            urls: ['/visitantes'],
            kind: 'find'
        },
        findById: 
        {
            kind: 'findOne'
        },
        save: 
        {
            urls: ['/visitantes','/visitantes/:_id'],
            kind: 'findAndModify'
        },
        delete: 
        {
            kind: 'remove'
        }
    }
}];