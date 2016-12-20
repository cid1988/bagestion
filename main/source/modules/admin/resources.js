exports = module.exports = [{
    name: 'User',
    collectionName: 'users',
    url: '/users/:username',
    params: {
        username: '@username'
    },
    actions: {
        list: {
            urls: ['/users'],
            allowed: ['admin.users'],
            kind: 'find'
        },
        findByName: {
            kind: 'findOne'
        },
        save: {
            kind: 'findAndModify',
            allowed: ['admin.users']
        },
        delete: {
            kind: 'remove',
            allowed: ['admin.users']
        }
    }
}, {
    name: 'UserTick',
    collectionName: 'userTicks',
    url: '/userTicks/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/userTicks'],
            allowed: ['admin.users'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/userTicks','/userTicks/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}, {
    name: 'Permission',
    collectionName: 'permissions',
    url: '/permissions/:key',
    params: {
        key: '@key'
    },
    actions: {
        list: {
            urls: ['/permissions'],
            allowed: ['admin.users'],
            kind: 'find'
        },
        findByName: {
            kind: 'findOne'
        },
        save: {
            kind: 'findAndModify',
            allowed: ['admin.users']
        },
        delete: {
            kind: 'remove',
            allowed: ['admin.users']
        }
    }
}, {
    name: 'UserPermission',
    collectionName: 'users.permissions',
    url: '/users.permissions/:username',
    params: {
        username: '@username'
    },
    actions: {
        list: {
            urls: ['/users.permissions'],
            allowed: ['admin.users'],
            kind: 'find'
        },
        findByName: {
            kind: 'findOne'
        },
        save: {
            kind: 'findAndModify',
            allowed: ['admin.users']
        },
        delete: {
            kind: 'remove',
            allowed: ['admin.users']
        }
    }
}, {
    name: 'PageTracking',
    collectionName: 'pageTracking',
    url: '/pageTracking/:_id',
    params: {
        _id: '@_id'
    },
    actions: {
        list: {
            urls: ['/pageTracking'],
            allowed: ['admin.users'],
            kind: 'find'
        },
        findById: {
            kind: 'findOne'
        },
        save: {
            urls: ['/pageTracking','/pageTracking/:_id'],
            kind: 'findAndModify'
        },
        delete: {
            kind: 'remove'
        }
    }
}];