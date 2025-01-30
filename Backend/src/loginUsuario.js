const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("./utils/jwt.js");

const loginUsuario = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { email, pass } = JSON.parse(event.body);

  // Mensaje de depuración - verificar los datos de entrada
  console.log("Datos de entrada recibidos:", { email, pass });

  // Buscar usuario en la base de datos
  const params = {
    TableName: "Usuarios",
    IndexName: "email-index", // Es necesario tener un índice secundario para buscar por email
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    console.log(
      "Realizando consulta a DynamoDB con el siguiente parámetro:",
      params
    );
    const result = await dynamodb.query(params).promise();

    console.log("Resultado de la consulta DynamoDB:", result);

    if (result.Items.length === 0) {
      console.log("Usuario no encontrado");
      return {
        statusCode: 401,
        body: JSON.stringify({ mensaje: "Usuario no encontrado" }),
      };
    }

    const usuario = result.Items[0];
    console.log("Usuario encontrado:", usuario);

    // Verificar la contraseña
    const passwordValid = await bcrypt.compare(pass, usuario.pass);
    console.log("Contraseña válida:", passwordValid);

    if (!passwordValid) {
      console.log("Contraseña incorrecta");
      return {
        statusCode: 401,
        body: JSON.stringify({ mensaje: "Contraseña incorrecta" }),
      };
    }

    // Generar un nuevo token
    const token = await generarJWT(usuario.userId);
    console.log("Token generado:", token);

    // Guardar el nuevo token en la base de datos
    await dynamodb
      .update({
        TableName: "Usuarios",
        Key: { userId: usuario.userId },
        UpdateExpression: "set #token = :token",
        ExpressionAttributeNames: {
          "#token": "token", // Usar #token como alias para "token"
        },
        ExpressionAttributeValues: {
          ":token": token,
        },
      })
      .promise();

    console.log("Token guardado exitosamente en la base de datos");

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    // Manejo de errores
    console.error("Error al procesar la solicitud:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        mensaje: "Error interno del servidor",
        error: error.message,
      }),
    };
  }
};

// Exportar la función
module.exports = { loginUsuario };
