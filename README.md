# jsreport-keycloak-auth

# install

```
npm install jsreport-keycloak-auth
```

# configuration

```json
"extensions": {
    "authentication":{
        "enabled": false
    },
    "authorization": {
        "enabled": false
    },
    "keycloak-auth" : {
        "api-config": {
            "realm": "master",
            "bearer-only": true,
            "auth-server-url": "http://kc/auth",
            "ssl-required": "external",
            "resource": "myclient-api"
        },
        "client-config": {
            "url": "http://kc/auth/",
            "clientId": "myclient",
            "realm": "master"
        },
        "allowedRoutes": []
    }
}
```

## default values

### allowed routes

```json
[
  "/?studio=embed",
  "/api/recipe",
  "/css",
  "/img",
  "/js",
  "/lib",
  "/html-templates",
  "/api/engine",
  "/api/settings",
  "/favicon.ico",
  "/api/extensions",
  "/odata/settings",
  "/",
  "auth/config"
]
```
