import Studio from 'jsreport-studio'
import Keycloak from 'keycloak-js'

const init = (keycloak) => {
  keycloak.onAuthSuccess = () => {
    Studio.setRequestHeader('Authorization', 'Bearer ' + keycloak.token)
  }

  keycloak.init({ onLoad: 'login-required' }).success(() => {
    if (keycloak.authenticated) {
      Studio.setRequestHeader('Authorization', 'Bearer ' + keycloak.token)
      setInterval(() => {
        keycloak.updateToken(10).error(() => keycloak.logout())
      }, 1000)
    } else {
      keycloak.login()
    }
  })
}

Studio.API.get('/auth/config').then((keycloakConfig) => {
  init(new Keycloak(keycloakConfig))
})
