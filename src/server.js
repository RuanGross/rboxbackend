const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

// toda vez que o usuario abrir a aplicação no frontend
// ele recebe o socket, que é a representação da conexão do usuário com a parte de real time
// apartir do momento que ele da um join com a box referente, ele fica isolado dos demais
io.on("connection", socket => {
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});
mongoose.connect(
  "mongodb+srv://ruangross:ruangross@cluster0-iukoe.mongodb.net/ruanbox?retryWrites=true",
  {
    useNewUrlParser: true
  }
);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

// recebe e envia dados entre o frontend e backend
app.use(express.json());
// Permite o envio de arquivos nas requisições
app.use(express.urlencoded({ extended: true }));
// caminho para utilizar o arquivo routes com as routes do sistema

app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));
app.use(require("./routes"));

// define a porta do servidor, no caso o 33333
// process.env.PORT = variavel ambiente, para ser atualizada dependendo do ambiente que a app está rodando
server.listen(process.env.PORT || 3333);
