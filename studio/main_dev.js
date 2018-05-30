import Studio from 'jsreport-studio'
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak(window.Studio.extensions['custom-extension']['client-config'])

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
