BA Gestion
==========

```node server.js```: Ejecuta la aplicación
```node saveUser.js {username} {password} {permission1} {permission2} {permission3}```: Crea o actualiza un usuario con password

BAG2
==========

> BA Gestión es un conjunto de aplicaciones destinadas a mejorar la gestión del Gobierno de la Ciudad de Buenos Aires

Tecnologías
-----------

+ [Angular.JS](http://www.angularjs.org/)
+ [Node.JS](http://www.nodejs.org) >= 0.8
+ [MongoDB](http://www.mongodb.org) >= 2.4
+ [Express.js](http://expressjs.com/)

Organización
------------

La aplicación está organizada por módulos que residen bajo la subcarpeta app-modules.

```
bagestion-shell
bagestion-shell/app-modules
bagestion-shell/app-modules/login
bagestion-shell/app-modules/login/login.js
```

Los módulos que contengan una subcarpeta ```public``` publicarán el contendido de esta carpeta como contenido estático.

```
bagestion-shell/app-modules/ui/public
bagestion-shell/app-modules/ui/public/index.html
```

En el ejemplo anterior, el archivo ```index.html``` podrá accederse bajo la ruta ```/index.html```

Implementación de un módulo
---------------------------

Este archivo pertenece a ```app-modules/constituyentes/constituyentes.js```

```javascript
exports.enabled = true;
exports.uiRoutes = [{
    'url': '/constituyentes',
    "controller": "ConstituyentesCtrl",
    "templateUrl": "/constituyentes/index.html",
    "permissions": ['verConstituyentes']
}];
exports.appsMenu = {
    'Constituyentes': '/constituyentes'
};
exports.scripts = ['/constituyentes/constituyentes.js'];
exports.permissions = {
    'verConstituyentes': {
        'name': 'Ver constituyentes',
        'implies': ['verConstituyentes'],
        'category': 'Constituyentes'
    },
    'actualizarConstituyentes': {
        'name': 'Actualizar constituyentes',
        'implies': ['verConstituyentes', 'actualizarConstituyentes'],
        'category': 'Constituyentes'
    }
};
exports.entities = [{
    'collectionName': 'constituyentes',
    'name': 'Constituyentes',
    'methods': {
        'GET': ['verConstituyentes'],
        'POST': ['actualizarConstituyentes']
    }
}];
```

### ```exports.uiRoutes```

```uiRoutes``` es una lista de las URLs que el módulo manejará. Cada una posee cuatro propiedades:

#### ```url```

La URL en sí misma, algunos ejemplos:

- ```/constituyentes```
- ```/usuarios/nuevo```
- ```/obras/:obraId```

#### ```controller```

Nombre del controller de [Angular.JS](http://www.angularjs.org/)

#### ```templateUrl```

URL del template de [Angular.JS](http://www.angularjs.org/). Este archivo debería ser un archivo estático.

#### ```permissions```

```permissions``` es una lista de los identificadores de los permisos. Estos permisos deberían estar definidos en ```exports.permissions```.

### Configuración

#### 1. Revisar config.json
Ver el archivo `config.json`.
Es necesario:

- Una instancia de MongoDB:
  - Autenticada (recomendado):
```
"mongo": {
    "database": "nombredelabasededatos",
    "hostname": "nombre-del-servidor",
    "auth": true,
    "username": "usuario",
    "password": "clave",
    "autoreconnect": true,
    "port": 27017
}
```
  - No autenticada (desarrollo):  
```
"mongo": {
    "database": "bag2",
    "hostname": "localhost",
    "auth": false,
    "username": "",
    "password": "",
    "autoreconnect": true,
    "port": 27017
}
```
- Clave para cookies y sesión:
```
    "cookies": {
        "secret": "1234567890"
    },
    "session": {
        "secret": "1234567890",
        "key": "express.sid"
    }
```
- Puerto en el que se va a ejecutar:
```
"http": {
        "port": 80
    }
```

#### 2. Agregar tiles para mapa

Existe un módulo que sirve los tiles para el mapa de la ciudad, que por su tamaño se encuentra en otro repositorio. Se sugiere descargar aparte y hacer un enlaze simbólico. La ruta recomendada (`modules/tiles`) está incluída en el archivo `.gitignore`.

El repositorio es [http://git-asi.buenosaires.gob.ar/bag2/tiles.git](http://git-asi.buenosaires.gob.ar/bag2/tiles)

#### 3. Para desarrollo

Agregar una excepción a la verificación de contraseñas con el LDAP usando en el archivo `config.json`:

```
"bypassLdap": true
```

Crear un usuario para desarrollo con el permiso `admin.users`, por ejemplo, `dev` con contraseña `test`:

```
node saveUser.js dev test admin.users
```

Instalar las dependencias usando `npm install`

> Uso: `node saveUser.js {usuario} {clave} [permiso1 [permiso2 ... permisoN]]

### Despliegue en producción

1. Descargar el repositorio [http://git-asi.buenosaires.gob.ar/bag2/deploy-scripts.git](http://git-asi.buenosaires.gob.ar/bag2/deploy-scripts).

