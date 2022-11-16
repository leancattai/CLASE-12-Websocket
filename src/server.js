const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const fs = require("fs");

const handlebarsConfig = {
  defaultLayout: "index.handlebars",
};

app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine(handlebarsConfig));
app.set("view engine", "handlebars");
app.set("views", "../views");
app.use(express.static("../views"));

app.get("/", (req, res) => {
  res.render("main.handlebars");
});

if (!fs.existsSync("mensajes.json")) {
  fs.writeFileSync("mensajes.json", JSON.stringify([]));
}

let mensajes = JSON.parse(fs.readFileSync("mensajes.json"));

let productos = [];

io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.emit("productos", productos);
  socket.emit("mensajes", mensajes);

  socket.on("nuevoMensaje", (mensaje) => {
    let nuevoMsg = {
      ...mensaje,
      fecha: new Date().toLocaleString(),
    };
    mensajes.push(nuevoMsg);

    fs.writeFileSync("mensajes.json", JSON.stringify(mensajes, null, 2));
    io.emit("mensajes", mensajes);
  });

  socket.on("nuevoProducto", (product) => {
    productos.push(product);
    io.emit("productos", productos);
  });
});

httpServer.listen(8080, function () {
  console.log("Servidor corriendo");
});
