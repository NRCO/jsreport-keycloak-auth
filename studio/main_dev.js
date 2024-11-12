import Studio from "jsreport-studio";
import Keycloak from "keycloak-js";

const hasRole = (keycloak) => {
  let resource;
  let role = keycloak._config.role;

  if (role.indexOf(":") >= 0) {
    [resource, role] = role.split(":");
  }

  if (resource) {
    return keycloak.hasResourceRole(role, resource);
  } else {
    return keycloak.hasResourceRole(role);
  }
};

const checkAuth = (keycloak) => {
  return new Promise((resolve, reject) => {
    if (!keycloak.token) {
      keycloak.init({ onLoad: "login-required" }).then(() => {
        if (!hasRole(keycloak)) {
          window.location = keycloak.createLogoutUrl();
        } else {
          resolve(keycloak.token);
        }
      });
    } else {
      keycloak.updateToken(5).then(() => {
        if (!hasRole(keycloak)) {
          window.location = keycloak.createLogoutUrl();
        } else {
          resolve(keycloak.token);
        }
      });
    }
  });
};

Studio.initializeListeners.unshift(async () => {
  let keycloakConfig = await Studio.API.get("/auth/config");
  let keycloak = new Keycloak(keycloakConfig);
  keycloak._config = keycloakConfig;
  let token = await checkAuth(keycloak);
  Studio.setRequestHeader("Authorization", "Bearer " + token);
  for (let name in Studio.API) {
    const ex = Studio.API[name];
    Studio.API[name] = async (...args) => {
      let token = await checkAuth(keycloak, keycloakConfig.role);
      Studio.setRequestHeader("Authorization", "Bearer " + token);
      return ex(...args);
    };
  }
});
