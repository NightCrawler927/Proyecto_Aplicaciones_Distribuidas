const AWS = require("aws-sdk");
exports.borrarPeli = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters; 
  try {
    await dynamodb
      .delete({
        TableName: "InventarioPeliculas",  
        Key: {
            id, 
        },
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Película eliminada", 
      }),
    };
  } catch (error) {
    console.error("Error al eliminar la película:", error);

    return {
      status: 500,
      body: JSON.stringify({
        message: "Hubo un error al eliminar la película",
        error: error.message,
      }),
    };
  }
};