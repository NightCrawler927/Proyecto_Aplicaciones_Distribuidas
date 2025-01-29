const { v4 } = require("uuid");
const AWS = require("aws-sdk");
exports.agregarPeli = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const id = v4();
  const { titulo, genero, alanzamiento, stockdisponible, precioventa } =
    JSON.parse(event.body);
  const newPeli = {
    id,
    titulo,
    genero,
    alanzamiento,
    stockdisponible,
    precioventa,
  };
  
  
  await dynamodb
    .put({
      TableName: "InventarioPeliculas",
      Item: newPeli,
    })
    .promise();
  return {
    statusCode: 200,
    body: JSON.stringify(newPeli),
  };
};
