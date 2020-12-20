CREATE SCHEMA `test` ;

Antes de crear la tabla, se debe seleccionar "test" as default schema 
CREATE TABLE users (
	id INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL);

para levantar el servidor de bases de datos en windos hay que abrir la terminal de windos de comandos con permisos de administrdor y hacer cd .. cd .. luego entrar en Program Files blabla (ruta:  C:\Program Files\MySQL\MySQL Server 8.0\bin>) y ejecutar el comando:
   mysqld.exe --init-file=C:\\mysql-init.txt