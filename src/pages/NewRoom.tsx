import { Link, useHistory } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import { FormEvent, useState } from 'react';


import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";

import '../styles/auth.scss'
import { database } from '../services/firebase';

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [roomName, setRoomName] = useState('')
  
  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (roomName.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: roomName,
      authorId: user?.id
    });

    history.push(`/rooms/${firebaseRoom.key}`)
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala" 
              onChange={event => setRoomName(event.target.value)}
              value={roomName}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui!</Link></p>
        </div>
      </main>
    </div>
  );
}
