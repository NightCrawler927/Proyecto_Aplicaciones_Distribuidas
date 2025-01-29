const AWS = require("aws-sdk");
exports.actualizarPeli = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;
  const { titulo, genero, alanzamiento, stockdisponible, precioventa } =
    JSON.parse(event.body);
  await dynamodb
    .update({
      TableName: "InventarioPeliculas",
      Key: {
        id,
      },
      UpdateExpression:
        "set titulo = :titulo, genero = :genero, alanzamiento = :alanzamiento, stockdisponible = :stockdisponible, precioventa = :precioventa",
      ExpressionAttributeValues: {
        ":titulo": titulo,
        ":genero": genero,
        ":alanzamiento": alanzamiento,
        ":stockdisponible": stockdisponible,
        ":precioventa": precioventa,
      },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Película actualizada",
    }),
  };
};
