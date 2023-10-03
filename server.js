
//const cors = require('cors')
const axios = require("axios")

let fetchNews = async function () {
  let response = await axios.get(
    "https://raw.githubusercontent.com/graphql-kit/graphql-apis/master/demos.json"
  );
  return response;
};

app.get('/graphqlApis', async function (req, res) {
  let responseData = await fetchNews()
  res.status(responseData.status).send(responseData.data)
})