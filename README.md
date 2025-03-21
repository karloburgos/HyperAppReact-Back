# HyperAppReact-Back

## Descripción
HyperAppReact-Back es la parte backend del proyecto **HyperAppReact**, desarrollado por **Karlo Antonio Gómez** y **Hugo Aguirre**. Este repositorio contiene la configuración y el código necesario para soportar la funcionalidad del backend utilizando servidor vite para el front-end y Laravel 11(PHP) como backend.

## Tecnologías utilizadas
- **TypeScript**
- **Node.js**
- **Vite** (para configuración y desarrollo)
- **ESNext** (para modularidad y compatibilidad con ES2022+)
- **Laravel 11**
- **PHP 8.2**
- **MySQL 8.0 o SQLite**

## Configuración de TypeScript
Este proyecto usa la siguiente configuración en `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

## Instalación (TypeScript Front-end)
Para ejecutar este front-end localmente, sigue estos pasos:

1. Clona el repositorio:
   ```sh
   git clone https://github.com/karloburgos/HyperAppReact-Back.git
   cd HyperAppReact-Back
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Configura las variables de entorno si es necesario.

4. Inicia el servidor:
   ```sh
   npm run dev
   ```

## Instalación (Laravel Backend)
Para ejecutar el backend en Laravel 11, sigue estos pasos:

1. Accede a la carpeta `backend`:
   ```sh
   cd backend
   ```

2. Instala las dependencias de PHP con Composer:
   ```sh
   composer install
   ```

3. Copia el archivo de entorno y configura la base de datos:
   ```sh
   cp .env.example .env
   ```
   Luego edita el archivo `.env` y configura la conexión a la base de datos. Se recomienda la siguiente configuración para MySQL 8.0:

   ```sh
   DB_CONNECTION=mysql
   # DB_HOST=127.0.0.1
   # DB_PORT=3306
   # DB_DATABASE=apphyperreact
   # DB_USERNAME=root
   # DB_PASSWORD=
   ```

4. Genera la clave de la aplicación:
   ```sh
   php artisan key:generate
   ```

5. Ejecuta las migraciones para crear las tablas:
   ```sh
   php artisan migrate
   ```

6. Instala las dependencias de Node.js:
   ```sh
   npm install
   ```

7. Inicia el servidor de Laravel:
   ```sh
   php artisan serve
   ```

8. Para compilar los assets de frontend en Laravel, ejecuta:
   ```sh
   npm run dev
   ```

### Nota sobre la carga de datos en la tabla `clientes`
Actualmente, debido a un problema con el **CSRF Token**, la tabla `clientes` debe llenarse manualmente desde la terminal o mediante herramientas como MySQL Workbench. 

El problema de **CSRF (Cross-Site Request Forgery)** impide que se realicen peticiones para agregar, actualizar o eliminar datos a través de la API. Para solucionar esto, se está trabajando en la implementación de **Sanctum**, una herramienta de Laravel que permite la autenticación basada en tokens y protege las solicitudes contra ataques de CSRF. Se espera que, una vez integrado correctamente, sea posible manipular los datos de la base de datos directamente desde la API.

## Contribución
Si deseas contribuir al desarrollo de **HyperAppReact-Back**, por favor sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (`feature/nueva-funcionalidad`).
3. Realiza tus cambios y confirma los commits.
4. Envía un pull request para revisión.

## Licencia
Este proyecto es de desarrollo privado y no está autorizado para su distribución, copia o modificación sin permiso expreso de los desarrolladores.  
Este software es propiedad de sus desarrolladores originales y no está disponible para distribución pública ni uso sin autorización previa. Todos los derechos reservados.
Este proyecto está bajo la licencia **Privada**.

---

*Desarrollado por Karlo Antonio Gómez y Hugo Aguirre*

