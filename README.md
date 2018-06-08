# jsreport-keycloak-auth

# install

```sh
npm i jsreport-keycloak-auth
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
        "session": {
            "secret": "wgdkçà+&é*ù:djgixc_"
        },
        "api-config": {
            "role": "myclient-api:manage",
            "realm": "master",
            "bearer-only": true,
            "auth-server-url": "http://kc/auth",
            "ssl-required": "external",
            "resource": "myclient-api"
        },
        "client-config": {
            "role": "myclient-api:manage",
            "url": "http://kc/auth/",
            "clientId": "myclient",
            "realm": "master"
        },
        "allowedRoutes": []
    }
}
```

## default values

### routes bypass

```js
[
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
```
### extensions bypass

```js
[
  'woff',
  'ttf',
  'js',
  'css',
  'png',
  'jpg',
  'gif'
]
```
