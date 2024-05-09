import Header from "../../components/Header";
import Title from "../../components/Title";
import avatar from "../../assets/avatar.png";
import { AuthContext } from "../../contexts/auth";
import { useContext, useState, useEffect } from "react";

import { db, storage } from "../../services/firebaseConnections";
import {
  addDoc,
  doc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";

import "./profile.css";

import { FiSettings, FiUpload } from "react-icons/fi";
import { GiConsoleController } from "react-icons/gi";

export default function Profile() {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [bio, setBio] = useState("");
  const [userDetail, setUserDetail] = useState({});

  const [idade, setIdade] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [estado, setEstado] = useState("");
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@ticketspro");
      setUserDetail(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);
        const tarefaRef = collection(db, "tarefas");

        const q = query(
          tarefaRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid)
        );
        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              bairro: doc.data().bairro,
              estado: doc.data().estado,
              idade: doc.data().idade,
              rua: doc.data().rua,
              biografia: doc.data().tarefa,
              userUid: doc.data().userUid,
            });
          });
          setTarefas(lista);
          console.log(lista);
        });
      }
    }
    loadTarefas();
  }, []);

  function handleFile(e) {
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        alert("Envie uma imagem do tipo PNG ou JPEG");
        setImageAvatar(null);
        return;
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await addDoc(collection(db, "tarefas"), {
      tarefa: bio,
      userUid: userDetail?.uid,
      idade: idade,
      rua: rua,
      bairro: bairro,
      estado: estado,
      created: new Date(),
    })
      .then(() => {
        setBio("");
      })
      .catch((error) => {
        GiConsoleController.log(error);
      });

    setBairro("");
    setEstado("");
    setRua("");
    setIdade("");
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name={"minha conta"}>
          <FiSettings size={25} />
        </Title>

        {tarefas.map((item) => (
          <article key={item.id} className="list">
            <span>Sua idade</span>
            <br />
            <buton>edit</buton>
            <p>{item.idade}</p>
            <span>Sua rua </span>
            <p>{item.rua}</p>
            <span>Seu Bairro</span>
            <p>{item.bairro}</p>
            <span>Seu Estado</span>
            <p>{item.estado}</p>
            <span>Sua Bio</span>
            <p>{item.biografia}</p>
          </article>
        ))}

        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>
              <input type="file" accept="image/*" onChange={handleFile} />
              <br />
              {avatarUrl === null ? (
                <img src={avatar} alt="fotoPerfil" width={200} height={200} />
              ) : (
                <img
                  src={avatarUrl}
                  alt="fotoPerfil"
                  width={200}
                  height={200}
                />
              )}
            </label>

            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>idade</label>
            <input
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
            />

            <label>Rua</label>
            <input
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />

            <label>Bairro</label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />

            <label>Estado</label>
            <input
              type="text"
              placeholder="Seu Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />

            <label>Bio</label>
            <textarea
              placeholder="Biografia"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <button type="submit">Salvar</button>
          </form>
        </div>

        <div className="container">
          <button className="logout-btn" onClick={() => logout()}>
            {" "}
            Sair
          </button>
        </div>
      </div>

      <h1>Pagina perfil</h1>
    </div>
  );
}
