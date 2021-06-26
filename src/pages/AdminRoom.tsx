import { Link, useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import errorImg from "../assets/images/error.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import useAuth from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";
import { database } from "../services/firebase";
import { useState } from "react";
import { useEffect } from "react";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { user } = useAuth();
  const roomParams = useParams<RoomParams>();
  const roomId = roomParams.id;
  const history = useHistory();
  const { title, questions, authorId } = useRoom(roomId);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && authorId) {
      if (user?.id === authorId) {
        setIsAdmin(true);
      }
      setIsLoading(false);
    }
  }, [user, authorId]);

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      removedAt: new Date(),
    });

    history.push("/");
  }

  async function handleCheckQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {isAdmin ? (
        <div id="page-room">
          <header>
            <div className="content">
              <Link to="/">
                <img src={logoImg} alt="logo" />
              </Link>
              <div>
                <RoomCode code={roomId} />
                <Button isOutlined onClick={handleEndRoom}>
                  Encerrar sala
                </Button>
              </div>
            </div>
          </header>

          <main>
            <div className="room-title">
              <h1>Sala {title}</h1>
              {questions.length > 0 && (
                <span>{questions.length} Perguntas</span>
              )}
            </div>

            <div className="question-list">
              {questions.map((question) => {
                return (
                  <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >
                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestion(question.id)}
                        >
                          <img
                            src={checkImg}
                            alt="Marcar pergunta como respondida"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Destacar pergunta" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>
                  </Question>
                );
              })}
            </div>
          </main>
        </div>
      ) : (
        <div className="not-allowed">
          <img src={logoImg} alt="logo" />
          <img src={errorImg} alt="error" />
          <h3>Você não têm permissão para acessar esta página!</h3>
          <button onClick={() => history.push("/")}>
            Voltar para a página inicial
          </button>
        </div>
      )}
    </>
  );
}
