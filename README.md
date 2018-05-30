# jsreport-keycloak-auth

# install

```
npm install https://github.com/NRCO/jsreport-keycloak-auth.git
```

# configuration

```json
"extensions": {
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
  "/"
]
```
