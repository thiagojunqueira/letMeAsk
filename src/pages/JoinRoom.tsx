import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import logoImg from "../assets/images/logo.svg";

import { database } from "../services/firebase";

import "../styles/joinRoom.scss";
import { LeftPanel } from "../components/LeftPanel";
import { Button } from "../components/Button";

export function JoinRoom() {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState("");

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      toast.error("Por favor insira um código de sala");
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Código da sala não encontrado!");
      return;
    }

    // const roomEnded = roomRef.val().removedAt;
    // if (roomEnded) {
    //   toast.error(`Esta sala foi encerrada pelo administrador em ${roomEnded}`);
    //   return;
    // }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <>
      <div id="page-join-room">
        <LeftPanel />
        <div className="content">
          <img src={logoImg} alt="Letmeask logo" />
          <header>
            <h2>Digite o código da sala</h2>
            <span>
              E começe a fazer perguntas!
            </span>
          </header>
          <form onSubmit={handleJoinRoom}>
            <Toaster />
            <input
              type="text"
              placeholder="Código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button>Entrar na sala</Button>
          </form>
          <button className="go-back" onClick={() => history.push("/")}>
            Voltar para página inicial
          </button>
        </div>
      </div>
    </>
  );
}
