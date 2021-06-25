import illustrationImg from "../assets/images/illustration.svg";

import "../styles/leftPanel.scss";

export function LeftPanel() {
  return (
    <div id="panel-content">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao vivo!</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real.</p>
      </aside>
    </div>
  );
}
