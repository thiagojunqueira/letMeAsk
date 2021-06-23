import "../styles/userProfile.scss";

import logoutImg from "../assets/images/logout.svg";

export function UserProfile() {
  return (
    <div id="content">
      <header>
        <span>Autenticado com <strong>Google</strong></span>
        <div>
          <img src={logoutImg} alt="logout" />
          {/* <button>Sair</button> */}
          {/* <span>Sair</span> */}
        </div>
      </header>

      <div className="user-info">
        <img src="https://avatars.githubusercontent.com/u/63688785?v=4" alt="avatar" />
        <h3>Thiago Junqueira</h3>
        <span>thiago.palermoj@gmail.com</span>
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
    </div>
  );
}
