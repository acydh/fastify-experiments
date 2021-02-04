const schemas = {
    
    signupSchema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
                repeatPassword: { type: 'string' },
            },
            required: ['username', 'password', 'repeatPassword']
          },
        response: {
            "2xx": {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                }
            },
            "4xx": {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                }
            },
            "5xx": {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                }
            }
        }
    }
}

module.exports = schemas 