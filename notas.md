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


TO DO
- no tomar user id que pasa en el body, recordar tomar el de la sesión
- Hacer favoritos
- cambiar el script de sql para crear la tabla orders