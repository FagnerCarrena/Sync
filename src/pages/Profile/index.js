import Header from "../../components/Header";
import Title from "../../components/Title";
import avatar from "../../assets/avatar.png";
import { AuthContext } from "../../contexts/auth";
import { useContext, useState, useEffect } from "react";

import { db, storage } from "../../services/firebaseConnections";
import { addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import "./profile.css";

import { toast } from "react-toastify";

const UserProfile = () => {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nome, setNome] = useState(user && user.nome);

  const [userInfo, setUserInfo] = useState({
    nome: "",
    rua: "",
    age: "",
    bairro: "",
    estado: "",

    bio: "",
  });

  const [formValues, setFormValues] = useState({
    newNome: "",
    newRua: "",
    newAge: "",
    newBairro: "",
    newEstado: "",
    newBio: "",
  });

  async function handleUpload() {
    const currentUid = user.uid;

    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

    const uploadTask = uploadBytes(uploadRef, imageAvatar).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (DownloadURL) => {
        let urlFoto = DownloadURL;

        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          avatarUrl: urlFoto,
          nome: nome,
        }).then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          };
          setUser(data);
          storageUser(data);
          toast.success("Atualizado com sucesso!");
        });
      });
    });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (imageAvatar === null && nome !== "") {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        nome: nome,
      }).then(() => {
        let data = {
          ...user,
          nome: nome,
        };
        setUser(data);
        storageUser(data);
        toast.success("atualizado com sucesso");
      });
    } else if (nome !== "" && imageAvatar !== null) {
      handleUpload();
    }

    setUserInfo({
      name: formValues.newNome || userInfo.nome,
      age: formValues.newAge || userInfo.age,
      rua: formValues.newRua || userInfo.rua,
      bairro: formValues.newBairro || userInfo.bairro,
      estado: formValues.newEstado || userInfo.estado,
      bio: formValues.newBio || userInfo.bio,
    });

    setFormValues({
      newNome: "",
      newRua: "",
      newName: "",
      newBairro: "",
      newAge: "",
      newEstado: "",
      newBio: "",
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  function handleFile(e) {
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

  return (
    <div className="container">
      <div className="form-profile">
        <input type="file" accept="image/*" onChange={handleFile} />
        <br />
        {avatarUrl === null ? (
          <img src={avatar} alt="fotoPerfil" width={200} height={200} />
        ) : (
          <img src={avatarUrl} alt="fotoPerfil" width={200} height={200} />
        )}
        <h2>Informações do Usuário</h2>
        <p value={nome} onChange={(e) => setNome(e.target.value)}>
          <strong>Nome:</strong> {nome}
        </p>

        <p>
          <strong>Idade:</strong> {userInfo.age}
        </p>

        <p>
          <strong>Rua:</strong> {userInfo.rua}
        </p>

        <p>
          <strong>Bairro:</strong> {userInfo.bairro}
        </p>

        <p>
          <strong>Estado:</strong> {userInfo.estado}
        </p>
        <p>
          <strong>Biografia:</strong> {userInfo.bio}
        </p>
      </div>
      <div className="update-form">
        <h2>Atualizar Informações</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            Nova Idade:
            <input
              type="number"
              name="newAge"
              value={formValues.newAge}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Rua:
            <input
              type="text"
              name="newRua"
              value={formValues.newRua}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Bairro:
            <input
              type="text"
              name="newBairro"
              value={formValues.newBairro}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Estado:
            <input
              type="text"
              name="newEstado"
              value={formValues.newEstado}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Nova Biografia:
            <textarea
              name="newBio"
              value={formValues.newBio}
              onChange={handleInputChange}
            />
          </label>
          <button className="logout-btn update-button" type="submit">
            Atualizar
          </button>
        </form>
      </div>

      <button className="logout-btn" onClick={() => logout()}>
        {" "}
        Sair
      </button>
    </div>
  );
};

export default UserProfile;
