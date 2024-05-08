import Header from "../../components/Header";
import Title from "../../components/Title";
import avatar from "../../assets/avatar.png";
import { AuthContext } from "../../contexts/auth";
import { useContext, useState } from "react";
import { db, storage } from "../../services/firebaseConnections";
import { doc, updateDoc } from "firebase/firestore";

import "./profile.css";

import { FiSettings, FiUpload } from "react-icons/fi";

export default function Profile() {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);

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

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name={"minha conta"}>
          <FiSettings size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>
              <input type="file" accept="image/*" onChange={handleFile} />
              <br />
              {avatarUrl === null ? (
                <img src={avatar} alt="fotoPerfil" width={250} height={250} />
              ) : (
                <img
                  src={avatarUrl}
                  alt="fotoPerfil"
                  width={250}
                  height={250}
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
            <input type="number" placeholder="Sua Idade" />

            <label>Rua</label>
            <input type="text" placeholder="Sua Rua" />

            <label>Bairro</label>
            <input type="text" placeholder="Seu Bairro" />

            <label>Estado</label>
            <input type="text" placeholder="Seu Estado" />

            <label>Bio</label>
            <textarea placeholder="Biografia" />

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
