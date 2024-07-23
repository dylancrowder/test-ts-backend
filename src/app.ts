import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const app = express();
const SECRET_KEY = "your_secret_key";

// Configurar CORS para permitir credenciales (cookies)
app.use(
  cors({
    origin: "https://frontend-test-nine-xi.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());

app.use((req: any, res: any, next: any) => {
  const token = req.cookies.token;
  console.log("este es el token", token);

  if (!token) {
    const uuid = uuidv4();
    const newToken = jwt.sign({ device: uuid }, SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "30d",
    });

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true, // Asegúrate de estar usando HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "Lax", // Considera cambiar a 'Strict' o 'None' según tus necesidades
    });

    // Continúa con el siguiente middleware después de setear la cookie
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

// Rutas y lógica adicional
app.get("/protected-route", (req: any, res: any) => {
  // Ejemplo de ruta protegida
  res.send("Acceso concedido");
});

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
