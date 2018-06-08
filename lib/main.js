const Keycloak = require('keycloak-connect')
const session = require('express-session')
const ejs = require('ejs')
const url = require('url')

class KeycloakCredentials {

  constructor () {
    this.publicExtension = [
      'woff',
      'ttf',
      'js',
      'css',
      'png',
      'jpg',
      'gif'
    ]

    this.allowedRoutes = [
      '/?studio=embed',
      '/css',
      '/img',
      '/js',
      '/lib',
      '/html-templates',
      '/api/recipe',
      '/api/engine',
      '/api/settings',
      '/favicon.ico',
      '/api/extensions',
      '/odata/settings',
      '/auth/config',
      '/api/report'
    ]
    this.memoryStore = new session.MemoryStore()
  }

  checkKeycloakCredentials (req, res, next) {
    const pathname = url.parse(req.url).pathname
    const isPublic = this.allowedRoutes.find((r) => {
      return (req.url.startsWith(r) || req.url === '/')
    })
    const isValidExtension = this.publicExtension.reduce((acc, extension) => {
      return pathname.endsWith(`.${extension}`) || acc
    })
    // si on cosidère l'url comme publique on passe aux middleware suivant
    if (isPublic || isValidExtension) {
      return next()
    } else {
      if (this.role) {
        return this.keycloak.protect(this.role)(req, res, next)
      } else {
        return this.keycloak.protect()(req, res, next)
      }
    }
  }

  onExportPublicRoute (route) {
    this.allowedRoutes.push(route)
  }

  afterExpressStaticConfigure (app) {
    this.reporter.emit('before-authentication-express-routes', app)

    app.engine('html', ejs.renderFile)
    app.use(session({ secret: this.definition.options.session.secret }))
    app.use(this.keycloak.middleware())
    app.use(this.checkKeycloakCredentials.bind(this))
    app.get('/auth/config', (req, res) => {
      res.json(this.publicAuthConfig)
    })
    this.definition.options = {}

    this.reporter.emit('after-authentication-express-routes', app)
  }

  install (reporter, definition) {
    this.reporter = reporter
    this.definition = definition
    this.allowedRoutes.concat(definition.options.allowedRoutes || [])
    this.role = definition.options['api-config'].role || false
    this.publicAuthConfig = Object.assign({}, definition.options['client-config'])
    this.keycloak = new Keycloak({ store: this.memoryStore }, definition.options['api-config'])
    reporter.on('export-public-route', this.onExportPublicRoute.bind(this))
    reporter.on('after-express-static-configure', this.afterExpressStaticConfigure.bind(this))
  }
}

const credentials = new KeycloakCredentials()
module.exports = credentials.install.bind(credentials)
