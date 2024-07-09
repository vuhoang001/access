const app = require("./src/app");
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce with port::: ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server express");
  });
});
