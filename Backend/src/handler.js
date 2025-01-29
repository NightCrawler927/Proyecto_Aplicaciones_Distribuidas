exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Holaaa vamos a hacer un deploy con serverless",
    }),
  };
};
