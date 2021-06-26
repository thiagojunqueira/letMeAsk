import "../styles/userProfile.scss";

import logoutImg from "../assets/images/logout.svg";
import useAuth from "../hooks/useAuth";
import { Button } from "./Button";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { database } from "../services/firebase";
import { useState } from "react";

export function UserProfile() {
  const { user, signOut } = useAuth();
  const history = useHistory();
  const [numberAdminRooms, setNumberAdminRooms] = useState<number>(0);
  const [numberCollaboratorRooms, setNumberCollaboratorRooms] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
  const [notAnsweredQuestions, setNotAnsweredQuestions] = useState<number>(0);

  function handleSignOut() {
    if (user) {
      if (window.confirm("Deseja sair da sua conta?")) {
        signOut();
      }
    }
  }

  useEffect(() => {
    async function addUserToDatabase() {
      await database.ref("users").push({
        userId: user?.id,
        avatar: user?.avatar,
        name: user?.name,
      });
    }

    async function getData() {
      if (user) {
        await database
          .ref("users")
          .orderByChild("userId")
          .equalTo(user.id)
          .once("value", async (data) => {
            const userData = data.val();
            if (userData) {
              const parsedUser = Object.entries(userData).map(
                ([key, value]: any) => {
                  return {
                    rooms: Object.entries(value.rooms).map(
                      ([key, value]: any) => {
                        return {
                          isAdmin: value.isAdmin ? true : false,
                          roomId: value.roomId,
                        };
                      }
                    ),
                  };
                }
              );
              const myRooms = parsedUser[0].rooms.filter(
                (room) => room.isAdmin
              );
              const myRoomsIds = myRooms.map((room) => room.roomId);
              setNumberAdminRooms(myRoomsIds.length);
              setNumberCollaboratorRooms(parsedUser[0].rooms.length - myRoomsIds.length)

              await database.ref("rooms").once("value", (data) => {
                const roomsData = data.val();
                if (roomsData) {
                  const parsedQuestions = Object.entries(roomsData)
                    .filter(([key, value]: any) => myRoomsIds.includes(key))
                    .map((room: any) => {
                      const roomQuestion = room[1].questions;
                      if (roomQuestion) {
                        return {
                          questions: Object.entries(roomQuestion).map(
                            ([key, value]: any) => {
                              return {
                                isAnswered: value.isAnswered,
                                isHighlighted: value.isHighlighted
                              }
                            }
                          ),
                        };
                      }
                    });

                  let answered = 0;
                  let notAnswered = 0;
                  parsedQuestions.forEach(questions => {
                    questions?.questions.map(question => question.isAnswered ? answered++ : notAnswered++)
                  })
                  setAnsweredQuestions(answered);
                  setNotAnsweredQuestions(notAnswered);
                }
              });
            } else {
              addUserToDatabase();
            }
          });
      }
    }

    getData();
    

  }, [user]);

  return (
    <div id="content">
      <header>
        <span>
          Autenticado com <strong>{user?.provider.split(".")[0]}</strong>
        </span>
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
          <span>{numberAdminRooms}</span>
        </section>
        <section className="sub-stats">
          <p>Perguntas respondidas</p>
          <span>{answeredQuestions}</span>
        </section>
        <section className="sub-stats">
          <p>Perguntas pendentes</p>
          <span>{notAnsweredQuestions}</span>
        </section>
      </div>

      <div className="stats">
        <section className="main-stats">
          <p>Salas que eu participo</p>
          <span>{numberCollaboratorRooms}</span>
        </section>
      </div>

      <div className="actions">
        <Button onClick={() => history.push("/rooms")}>
          Listar {numberAdminRooms+numberCollaboratorRooms} salas conhecidas
        </Button>
        <div className="sub-actions">
          <Button isOutlined onClick={() => history.push("/rooms/new")}>
            Criar nova sala
          </Button>
          <Button isOutlined onClick={() => history.push("/rooms/join")}>
            Entrar em uma sala
          </Button>
        </div>
      </div>
    </div>
  );
}
