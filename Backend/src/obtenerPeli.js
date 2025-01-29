const AWS = require("aws-sdk");
exports.obtenerPeli = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;
  try {
    const result = await dynamodb
      .get({
        TableName: "InventarioPeliculas",
        Key: {
          id,
        },
      })
      .promise();

    if (!result.Item) {
      return {
        status: 404,
        body: JSON.stringify({
          message: "Película no encontrada",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Película encontrada",
        book: result.Item,
      }),
    };
  } catch (error) {
    console.error("Error al obtener película:", error);

    return {
      status: 500,
      body: JSON.stringify({
        message: "Hubo un error al obtener la película",
        error: error.message,
      }),
    };
  }
};
