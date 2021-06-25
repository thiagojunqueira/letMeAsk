import { useHistory } from "react-router-dom";
import { FormEvent, useState } from "react";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import githubIconImg from "../assets/images/github-icon.svg";
import { Button } from "../components/Button";
import useAuth from "../hooks/useAuth";

import "../styles/auth.scss";
import { database } from "../services/firebase";

export function Home() {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState('')
  const { user, signInWithGoogle, signInWithGithub } = useAuth();

  async function handleCreateNewRoom(provider: string) {
    if (!user) {
      switch (provider) {
        case "google":
          await signInWithGoogle();
          break;
        case "github":
          await signInWithGithub();
          break;
      }
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('A sala não existe!');
      return;
    }

    const roomEnded = roomRef.val().removedAt
    if (roomEnded) {
      alert(`Esta sala foi encerrada pelo administrador em ${roomEnded}`);
      return;
    }
    
    history.push(`/rooms/${roomCode}`);
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
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala" 
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}  
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
