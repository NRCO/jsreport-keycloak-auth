const Keycloak = require('keycloak-connect')
const session = require('express-session')
const ejs = require('ejs')

module.exports = function (reporter, definition) {
  let allowedRoutes = [
    '/css',
    '/img',
    '/js',
    '/lib',
    '/?studio=embed',
    '/html-templates',
    '/favicon.ico',
    '/studio/assets',
    '/studio/templates',
    '/auth/config',
    '/api/extensions',
    '/api/recipe',
    '/api/engine',
    '/api/settings'
  ].concat(definition.options.allowedRoutes || [])

  const memoryStore = new session.MemoryStore()
  const keycloak = new Keycloak({ store: memoryStore }, definition.options['api-config'])

  // on agglomère les routes publiques aux routes autorisées
  reporter.on('export-public-route', (route) => allowedRoutes.push(route))

  // lors de la configuration du serveur express
  reporter.on('after-express-static-configure', (app) => {
    reporter.emit('before-authentication-express-routes', app)

    app.engine('html', ejs.renderFile)
    app.use(session({ secret: definition.options.session.secret }))
    app.use(keycloak.middleware())
    app.use((req, res, next) => {
      const isPublic = allowedRoutes.find((r) => {
        console.log(r)
        console.log(req.url)
        return (req.url.startsWith(r) || req.url === '/')
      })
      // si on cosidère l'url comme publique on passe aux middleware suivant
      if (isPublic) {
        return next()
      } else {
        // dans le cas d'une url devant être sécurisée
        // on fait appel au middleware keycloak
        return keycloak.protect()(req, res, next)
      }
    })

    const publicAuthConfig = Object.assign({}, definition.options['client-config'])
    app.get('/auth/config', (req, res) => {
      res.json(publicAuthConfig)
    })

    definition.options = {}
    reporter.emit('after-authentication-express-routes', app)
  })
}
