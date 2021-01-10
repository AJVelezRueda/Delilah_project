DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `password_hash`  varchar(2056) NOT NULL,
  `username`  varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);
