import { FormEvent, useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { LoginOptions } from "../components/LoginOptions";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import useAuth from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import toast, { Toaster } from "react-hot-toast";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function Room() {
  const history = useHistory();
  const { user } = useAuth();
  const roomParams = useParams<RoomParams>();
  const roomId = roomParams.id;
  const { title, questions, authorId, removedAt } = useRoom(roomId);
  const [newQuestion, setNewQuestion] = useState("");

  const [loginPanelOpen, setLoginPanelOpen] = useState(false);

  useEffect(() => {
    async function addUserToDatabase() {
      const firebaseUser = await database.ref("users").push({
        userId: user?.id,
        avatar: user?.avatar,
        name: user?.name,
      });

      return firebaseUser.key || "";
    }

    async function addRoomOnUserProfile(firebaseUserId: string | null) {
      if (firebaseUserId) {
        await database.ref(`users/${firebaseUserId}/rooms`).push({
          roomId: roomId,
        });
      }
    }

    async function isRoomOnUserProfile(firebaseUserId: string | null) {
      let foundRoom = false;
      await database
        .ref(`users/${firebaseUserId}/rooms`)
        .once("value", (data) => {
          if (data.val()) {
            const parsedRooms = Object.entries(data.val()).map(
              ([key, value]: any) => {
                return {
                  firebaseRoomId: key,
                  roomId: value.roomId,
                };
              }
            );
            // eslint-disable-next-line array-callback-return
            return parsedRooms.find((room) =>
              room.roomId === roomId ? (foundRoom = true) : null
            );
          }
        });
      return foundRoom;
    }

    async function updateUserInfo() {
      if (user) {
        await database
          .ref("users")
          .orderByChild("userId")
          .equalTo(user.id)
          .once("value", async (user) => {
            const userData = user.val();
            if (userData) {
              const parsedUser = Object.entries(userData).map(
                ([key, value]: any) => {
                  return {
                    firebaseUserKey: key,
                  };
                }
              );
              const isRegisteredOnRoom = await isRoomOnUserProfile(
                parsedUser[0].firebaseUserKey
              );
              if (!isRegisteredOnRoom) {
                addRoomOnUserProfile(parsedUser[0].firebaseUserKey);
              }
            } else {
              const userKey = await addUserToDatabase();
              addRoomOnUserProfile(userKey);
            }
          });
      }
    }

    updateUserInfo();
  }, [roomId, user]);

  useEffect(() => {
    if (user?.id === authorId) {
      toast.loading("Você é o admin desta sala! Redirecionando..", {
        duration: 2000,
      });
      setTimeout(() => {
        history.push(`/admin/rooms/${roomId}`);
      }, 2000);
    }
  }, [user, authorId, roomId, history]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      toast.error("Voce precisa estar autenticado");
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
        id: user.id,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
    toast.success("Pergunta enviada com sucesso!");

    setNewQuestion("");
  }

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (!user) {
      toast.error("Você precisa estar logado para curtir uma pergunta.");
      return;
    }
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
      toast.success("Curtida removida com sucesso!");
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
      toast.success("Mensagem curtida!");
    }
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="logo" />
          </Link>
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>

        {removedAt ? (
          <h3>Esta sala foi fechada pelo administrador em {removedAt}</h3>
        ) : (
          <>
            <form onSubmit={handleSendQuestion}>
              <textarea
                placeholder="O que deseja perguntar?"
                value={newQuestion}
                onChange={(event) => setNewQuestion(event.target.value)}
              />
              <div className="form-footer">
                {user ? (
                  <div className="user-data">
                    <img src={user.avatar} alt={user.name} />
                    <span>{user.name}</span>
                  </div>
                ) : (
                  <span>
                    Para enviar uma pergunta,
                    <button onClick={() => setLoginPanelOpen(!loginPanelOpen)}>
                      faça seu login
                    </button>
                  </span>
                )}
                <Button type="submit" disabled={!user}>
                  Enviar Pergunta
                </Button>
              </div>
            </form>
            {loginPanelOpen && !user && (
              <div className="login-panel">
                <LoginOptions />
              </div>
            )}
          </>
        )}

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
                  <button
                    className={`like-button + ${
                      question.likeId ? "liked" : ""
                    }`}
                    type="button"
                    onClick={() =>
                      handleLikeQuestion(question.id, question.likeId)
                    }
                    aria-label="Marcar como gostei"
                  >
                    {question.likeCount > 0 && (
                      <span>{question.likeCount}</span>
                    )}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
