import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import avatarImg from "../../assets/avatar.png";
import "./Header.css";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? avatarImg : user.avatarUrl}
          alt="fotoUsuario"
        />
      </div>
    </div>
  );
}
