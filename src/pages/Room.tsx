import { FormEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode';
import useAuth from '../hooks/useAuth';
import { database } from '../services/firebase';

import "../styles/room.scss";

type RoomParams = {
  id: string
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string,
    id: string,
  },
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean
}>

type Question = {
  id: string,
  author: {
    name: string,
    avatar: string,
    id: string,
  },
  content: string,
  isHighlighted: boolean,
  isAnswered: boolean
}

export function Room() {
  const { user } = useAuth();
  const roomParams = useParams<RoomParams>();
  const roomId = roomParams.id

  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  
  useEffect( () => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on('value', room => {
      const roomData = room.val();
      const questions: FirebaseQuestions = roomData.questions ?? {} 
      
      const parsedQuestions = Object.entries(questions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      })

      setTitle(roomData.title)
      setQuestions(parsedQuestions);

    })
  }, [roomId])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('Voce precisa estar autenticado')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
        id: user.id
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId}/>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} Perguntas</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que deseja perguntar?" 
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />
          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button></span>
            )}
            <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
          </div>
        </form>

      </main>
    </div>
  )
}