const firebaseConfig = {
    apiKey: "AIzaSyB8fC9U8Zob6zRmVi9kiinm6pCu95JbeYw",
    authDomain: "chat-batata.firebaseapp.com",
    databaseURL: "https://chat-batata-default-rtdb.firebaseio.com",
    projectId: "chat-batata",
    storageBucket: "chat-batata.appspot.com",
    messagingSenderId: "332641938254",
    appId: "1:332641938254:web:3fd1ae59007d7c270acc1f"
  };

  firebase.initializeApp(firebaseConfig);

const nomeUsuario = localStorage.getItem("nomeUsuario");
const nomeSala = localStorage.getItem("nomeSala");

inicializar();

function inicializar() {
  document.getElementById("nomeSala").textContent =  nomeSala;

  getData();
}

function getData() {
  const output = document.getElementById("output");
  firebase
    .database()
    .ref("/" + nomeSala)
    .on("value", (snapshot) => {
      output.innerHTML = "";
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        if (childKey != "purpose") {
          const childMsg = childSnapshot.val();
          const nome = childMsg.nome;
          const msg = childMsg.mensagem;
          const likes = childMsg.likes;

          const chatCard = document.createElement("div");
          chatCard.className = "chatCard";
          const chatNome = document.createElement("h4");
          chatNome.className = "chatNome";
          chatNome.textContent = nome;
          chatCard.appendChild(chatNome);
          const row = document.createElement("div");
          row.className = "row";
          chatCard.appendChild(row);
          const col = document.createElement("div");
          col.className = "col";
          row.appendChild(col);
          const chatMsg = document.createElement("h5");
          chatMsg.className = "chatMsg";
          chatMsg.textContent = msg;
          col.appendChild(chatMsg);
          const colAuto = document.createElement("div");
          colAuto.className = "col-auto";
          row.appendChild(colAuto);
          const botaoLike = document.createElement("button");
          botaoLike.className = "btn btn-info";
          botaoLike.id = childKey;
          botaoLike.value = likes;
          botaoLike.setAttribute("onclick", "likeMsg(this.id)");
          botaoLike.innerHTML =
            '<i class="fa-regular fa-thumbs-up"></i> ' + likes;
          colAuto.appendChild(botaoLike);
          output.appendChild(chatCard);
        }
      });
    });
}

function send() {
  const txtMsg = document.getElementById("msg");
  const msg = txtMsg.value;

  if (msg.trim()) {
    firebase
      .database()
      .ref("/" + nomeSala)
      .push({
        nome: nomeUsuario,
        mensagem: msg,
        likes: 0,
      });
    txtMsg.value = "";
  }
}

function likeMsg(btnId) {
  let likes = Number(document.getElementById(btnId).value);
  likes++;
  firebase
    .database()
    .ref("/" + nomeSala)
    .child(btnId)
    .update({
      likes: likes,
    });
}