import { useHistory } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import githubIconImg from "../assets/images/github-icon.svg";
import { Button } from "../components/Button";

import "../styles/auth.scss";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle, signInWithGithub } = useAuth();

  async function handleCreateNewRoom(provider: string) {
    // if (!user) {
    switch (provider) {
      case "google":
        await signInWithGoogle();
        break;
      case "github":
        await signInWithGithub();
        break;
    }
    // }

    history.push("/rooms/new");
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao vivo!</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real.</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask logo" />
          {user ? (
            <h1>
              Usuário logado: {user.name} - {user.provider}
            </h1>
          ) : (
            <>
              <button
                className="create-room-button google-button"
                onClick={() => handleCreateNewRoom("google")}
              >
                <img src={googleIconImg} alt="Logo do google" />
                Crie sua sala com o Google
              </button>
              <button
                className="create-room-button github-button"
                onClick={() => handleCreateNewRoom("github")}
              >
                <img src={githubIconImg} alt="Logo do google" />
                Crie sua sala com o Github
              </button>
            </>
          )}
          <button
                className="create-room-button google-button"
                onClick={() => handleCreateNewRoom("google")}
              >
                <img src={googleIconImg} alt="Logo do google" />
                Crie sua sala com o Google
              </button>
              <button
                className="create-room-button github-button"
                onClick={() => handleCreateNewRoom("github")}
              >
                <img src={githubIconImg} alt="Logo do google" />
                Crie sua sala com o Github
              </button>
          <div className="separator">Ou entre em uma sala</div>
          <form>
            <input type="text" placeholder="Digite o código da sala" />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
