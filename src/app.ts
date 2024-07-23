import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser()); // Añadir middleware para manejar cookies

app.use(
  cors({
    origin: "https://frontend-test-nine-xi.vercel.app",
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

const SECRET_KEY = "tu_clave_secreta";

app.use((req: any, res, next) => {
  const token = req.cookies.token;
  console.log("este es el token", token);
  if (!token) {
    const uuid = uuidv4();
    const token: any = jwt.sign({ device: uuid }, SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    req.device = uuid;
    return next();
  }
  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.device = decoded.device;
    next();
  });
});

app.get("/token", (req: any, res) => {
  res.json({
    message: "This is sa protected route!! callate ",
    device: req.device,
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
