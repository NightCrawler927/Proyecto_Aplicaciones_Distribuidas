const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("./utils/jwt.js");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Configurar AWS DynamoDB
AWS.config.update({ region: "us-east-1" });

const registrarUsuario = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    console.log("Evento recibido:", event.body);

    const { nombreUsuario, email, pass } = JSON.parse(event.body);
    console.log("Datos recibidos:", { nombreUsuario, email });

    const userId = v4();
    console.log("UUID generado:", userId);

    // Encriptar la contraseña con bcryptjs
    const hashedPassword = await bcryptjs.hash(pass, 10);
    console.log("Contraseña encriptada:", hashedPassword);

    // Generar el token
    const token = await generarJWT(userId);
    console.log("Token generado:", token);

    const newUser = {
      userId,
      nombreUsuario,
      email,
      pass: hashedPassword,
      token,
    };

    console.log("Guardando en DynamoDB:", newUser);

    await dynamodb
      .put({
        TableName: "Usuarios", // ⚠️ Asegúrate de que esta tabla exista en AWS
        Item: newUser,
      })
      .promise();

    console.log("Usuario guardado correctamente en DynamoDB");

    return {
      statusCode: 201,
      body: JSON.stringify({
        mensaje: "Usuario registrado correctamente",
        token,
      }),
    };
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor", detalles: error.message }),
    };
  }
};

// Exportación en CommonJS
module.exports = { registrarUsuario };
