const AWS = require("aws-sdk");
exports.obtenerTodo = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const result = await dynamodb
    .scan({
      TableName: "InventarioPeliculas",
    })
    .promise();
  const pelicula = result.Items;
  return {
    statusCode: 200,
    body: JSON.stringify(pelicula),
  };
  
};