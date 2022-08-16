"use strict";
//para crear las tablas de la base de datos en el caso de que no existan
require("dotenv").config();
const bcrypt = require("bcrypt");
const { getConnection } = require("./db");

//Creo variable que contiene la conexion a la base de datos
async function main() {
  let connection;
  try {
    connection = await getConnection();

    //Borro tablas si ya existen
    console.log("Borrado de tablas existentes");

    await connection.query("DROP TABLE IF EXISTS likes");
    await connection.query("DROP TABLE IF EXISTS ejercicios_tipos");
    await connection.query("DROP TABLE IF EXISTS ejercicios_gruposMusculares");

    await connection.query("DROP TABLE IF EXISTS users");
    await connection.query("DROP TABLE IF EXISTS ejercicios");
    await connection.query("DROP TABLE IF EXISTS gruposMusculares");
    await connection.query("DROP TABLE IF EXISTS tipologia");

    console.log("Creando tablas...");
    //-------------------------------------------Creo la tabla de los usuarios------------------
    await connection.query(`
    CREATE TABLE users (
      id_user INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(150) NOT NULL,
      rol ENUM("admin", "normal") DEFAULT "normal" NOT NULL
      );
        `);
    console.log("Table users created");

    //-------------------------------------------Creo la tabla de los ejercicios------------------
    await connection.query(`
    CREATE TABLE ejercicios (
      id_ejercicio INT AUTO_INCREMENT PRIMARY KEY,
      id_user INT,
      nombre VARCHAR(200) NOT NULL,
      descripcion VARCHAR(500),
      imagen VARCHAR(200),
      FOREIGN KEY (id_user) REFERENCES users(id_user)
       );
        `);
    console.log("Table ejercicios created");

    //-------------------------------------------Creo la tabla de los likes------------------
    await connection.query(`
    CREATE TABLE likes (
      id_likes INT AUTO_INCREMENT PRIMARY KEY,
      id_user INT NOT NULL,
      id_ejercicio  INT NOT NULL,
      FOREIGN KEY (id_ejercicio) REFERENCES ejercicios(id_ejercicio),
      FOREIGN KEY (id_user) REFERENCES users(id_user)
      );
    `);
    console.log("Table likes created");

    //-------------------------------------------Creo la tabla de los gruposMusculares------------------
    await connection.query(`
    CREATE TABLE gruposMusculares(
      id_grupoMuscular INT AUTO_INCREMENT PRIMARY	KEY,
      grupoMuscular VARCHAR (100)
      );
    `);
    console.log("Table gruposMusculares created");

    //-------------------------------------------Creo la tabla de los tipologia------------------
    await connection.query(`
    CREATE TABLE tipologia(
      id_tipologia INT AUTO_INCREMENT PRIMARY KEY,
              tipo VARCHAR (100)
          );
    `);
    console.log("Table tipologia created");

    //-------------------------------------------Creo la tabla de los ejercicios_tipos------------------
    await connection.query(`
  CREATE TABLE ejercicios_tipos(
    id_ejercicios_tipo INT AUTO_INCREMENT PRIMARY KEY,
    id_ejercicio INT NOT NULL,
    id_tipologia INT NOT NULL,
    FOREIGN KEY (id_ejercicio) REFERENCES ejercicios(id_ejercicio),
    FOREIGN KEY (id_tipologia) REFERENCES tipologia(id_tipologia)
    );
  `);
    console.log("Table ejercicios_tipos created");

    //-------------------------------------------Creo la tabla de los ejercicios_gruposMusculares------------------
    await connection.query(`
  CREATE TABLE ejercicios_gruposMusculares(
    id_ejercicios_gruposMusculares INT AUTO_INCREMENT PRIMARY KEY,
    id_ejercicio INT NOT NULL,
id_grupoMuscular INT NOT NULL,
    FOREIGN KEY (id_ejercicio) REFERENCES ejercicios(id_ejercicio),
    FOREIGN KEY (id_grupoMuscular) REFERENCES gruposMusculares(id_grupoMuscular)
    );
  `);
    console.log("Table gruposMusculares created");
    const passwordHash = await bcrypt.hash(process.env.ADMIN2_PASSWORD, 10);
    console.log("Creo usuario admin...");
    await connection.query(`
     INSERT INTO users(nombre, email, password, rol)
     VALUES (
      "alejandro",
      "alejandro.bichillo@email.com",
      "${passwordHash}",
      "admin"
     );
     `);

    console.log("Creo grupos musculares...");
    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Pectorales"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Trapecios"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Espalda"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Abdominales"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Deltoides"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Biceps"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Triceps"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Antebrazos"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Quadricpes"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Biceps femorales"
      );
    `);

    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Aductores"
      );
    `);
    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Abductores"
      );
    `);
    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Gemelos"
      );
    `);
    await connection.query(`
      INSERT INTO gruposMusculares(grupoMuscular)
      VALUES (
       "Gluteos"
      );
    `);

    console.log("Creo tipologia...");
    await connection.query(`
      INSERT INTO tipologia(tipo)
      VALUES (
        "Aerobico"
      );
    `);
    await connection.query(`
      INSERT INTO tipologia(tipo)
      VALUES (
        "Resistencia"
      );
    `);
    await connection.query(`
      INSERT INTO tipologia(tipo)
      VALUES (
       "Fuerza"
      );
    `);
    await connection.query(`
      INSERT INTO tipologia(tipo) 
      VALUES (
        "Flexibilidad"
      );
    `);
    //-------------------------------------------Fin de tablas------------------
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
