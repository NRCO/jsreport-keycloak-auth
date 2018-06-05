import Studio from 'jsreport-studio'
import Keycloak from 'keycloak-js'

const checkAuth = (keycloak) => {
  return new Promise((resolve, reject) => {
    if (!keycloak.token) {
      keycloak.init({ onLoad: 'login-required' }).success(() => {
        resolve(keycloak.token)
      })
    } else {
      keycloak.updateToken(5).success(() => {
        resolve(keycloak.token)
      })
    }
  })
}

Studio.initializeListeners.unshift(async () => {
  let keycloakConfig = await Studio.API.get('/auth/config')
  let keycloak = new Keycloak(keycloakConfig)
  let token = await checkAuth(keycloak)
  Studio.setRequestHeader('Authorization', 'Bearer ' + token)
  for (let name in Studio.API) {
    const ex = Studio.API[name]
    Studio.API[name] = async (...args) => {
      let token = await checkAuth(keycloak)
      Studio.setRequestHeader('Authorization', 'Bearer ' + token)
      return ex(...args)
    }
  }
})
