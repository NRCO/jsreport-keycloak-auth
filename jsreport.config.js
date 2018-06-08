module.exports = {
  'name': 'keycloak-auth',
  'dependencies': [
    'templates'
  ],
  'optionsSchema': {
    'extensions': {
      'keycloak-auth': {
        'type': 'object',
        'properties': {
          'session': {
            'type': 'object',
            'secret': {
              'type': 'string'
            }
          },
          'api-config': {
            'type': 'object',
            'properties': {
              'role': { 'type': 'string' },
              'realm': { 'type': 'string' },
              'bearer-only': { 'type': 'boolean' },
              'auth-server-url': { 'type': 'string' },
              'ssl-required': { 'type': 'string' },
              'resource': { 'type': 'string' }
            }
          },
          'client-config': {
            'type': 'object',
            'properties': {
              'role': { 'type': 'string' },
              'url': { 'type': 'string' },
              'clientId': { 'type': 'string' },
              'realm': { 'type': 'string' }
            }
          },
          'allowedRoutes': {
            'type': 'array'
          }
        }
      }
    }
  },
  'main': 'lib/main.js'
}
