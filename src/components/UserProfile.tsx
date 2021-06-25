import "../styles/userProfile.scss";

import logoutImg from "../assets/images/logout.svg";
import useAuth from "../hooks/useAuth";
import { Button } from "./Button";
import { useHistory } from "react-router-dom";

export function UserProfile() {
  const { user, signOut } = useAuth();
  const history = useHistory();

  function handleSignOut() {
    if(user) {
      if (window.confirm("Deseja sair da sua conta?")) {
        signOut();
      }
    }
  } 

  return (
    <div id="content">
      <header>
        <span>Autenticado com <strong>{user?.provider.split('.')[0]}</strong></span>
        <div>
          <button onClick={handleSignOut}>
            <img src={logoutImg} alt="logout" />
          </button>
          {/* <button>Sair</button> */}
          {/* <span>Sair</span> */}
        </div>
      </header>

      <div className="user-info">
        <img src={user?.avatar} alt="avatar" />
        <h3>{user?.name}</h3>
        <span>{user?.id}</span>
      </div>

      <div className="stats">
        <section className="main-stats">
          <p>Salas que eu administro</p>
          <span>03</span>
        </section>
        <section className="sub-stats">
          <p>Perguntas respondidas</p>
          <span>08</span>
        </section>
        <section className="sub-stats">
          <p>Perguntas pendentes</p>
          <span>19</span>
        </section>
      </div>

      <div className="stats">
        <section className="main-stats">
          <p>Salas que eu participo</p>
          <span>06</span>
        </section>
        <section className="sub-stats">
          <p>Perguntas realizadas</p>
          <span>06</span>
        </section>
        <section className="sub-stats">
          <p>Curtidas recebidas</p>
          <span>23</span>
        </section>
        <section className="sub-stats">
          <p>Perguntas respondidas</p>
          <span>04</span>
        </section>
      </div>

      <div className="actions">
        <Button onClick={() => history.push('/rooms')}>Listar salas conhecidas</Button>
        <div className="sub-actions">
          <Button isOutlined onClick={() => history.push('/rooms/new')}>Criar nova sala</Button>
          <Button isOutlined onClick={() => history.push('/rooms/join')}>Entrar em uma sala</Button>
        </div>
      </div>
    </div>
  );
}
