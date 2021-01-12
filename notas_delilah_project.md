CREATE SCHEMA `test` ;

- Antes de crear la tabla, se debe seleccionar "test" as default schema
CREATE TABLE users (
	id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL);

- Recordar hacer las tablas users, productos, favoritos segun esquema


- Para levantar el servidor de bases de datos en windos hay que abrir la terminal de windos de comandos con permisos de administrdor y hacer cd .. cd .. luego entrar en Program Files blabla (ruta:  C:\Program Files\MySQL\MySQL Server 8.0\bin>) y ejecutar el comando:
   mysqld.exe --init-file=C:\\mysql-init.txt

- En linux el servidor del SQL debería arrancar solo, de lo contrario hacer en la consola:
     sudo service mysql start

- Los tests se corren parados en la carpeta haciendo:
    npm run test

Caso de uso signup:
    - POST /user
        -> internamente crea un usuario en la base de datos, persiste su hash de contraseña para despues poder validarla [y crea un token JWT conformado por su user_id]
        -> retorna un 201 y el token JWT creado (header)
        -> el cliente debería almacenar este token JWT en su local storage y pasarlo de ahora en más en toda comunicación (a través del header Authorization: Bearer XXX)
    -> POST /login (POST /session)
        ->  valida la clave usando el hash de la contraseña almacenada en la base
        -> [crea un token JWT conformado por el user_id; por las propiedad de JWT y el hecho de que estamos incluyendo sólamente un valor estable (el user_id), este token será identico al anterior]
        -> el cliente se guarda el token al igual que en el paso anterior
    -> {POST /logout (DELETE /session); ojo que bajo este esquema no es necesario realente hacer una operacion a nivel servidor, basta con borrar el local storage en el cliente}

TO DO
-----
- agregar
    - rateLimit

