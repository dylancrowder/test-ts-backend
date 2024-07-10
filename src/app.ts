import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("esta conectado");
});
const PORT: number = 8080;
app.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});
