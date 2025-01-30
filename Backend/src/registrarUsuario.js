const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");

exports.registrarUsuario = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { nombreUsuario, email, contraseña } = JSON.parse(event.body);
  const userId = v4();

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(contraseña, 10);

  const newUser = {
    userId,
    nombreUsuario,
    email,
    contraseña: hashedPassword, // Guardamos la contraseña encriptada
  };

  await dynamodb
    .put({
      TableName: "Usuarios",
      Item: newUser,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ mensaje: "Usuario registrado correctamente" }),
  };
};
