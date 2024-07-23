import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const app = express();
const SECRET_KEY = "your_secret_key";

app.use(express.json());

app.get("/", (req, res) => {
  // Genera un nuevo token y envíalo en la respuesta
  const uuid = uuidv4();
  const newToken = jwt.sign({ device: uuid }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "30d",
  });

  res.json({ token: newToken });
});

app.use((req: any, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("este es el token", token);

  if (!token) {
    return res.status(403).send("No token provided");
  }

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.device = decoded.device;
    next();
  });
});

app.get("/protected-route", (req, res) => {
  res.send("Acceso concedido");
});

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
