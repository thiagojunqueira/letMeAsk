import "../styles/roomsList.scss";

import externalLinkImg from "../assets/images/external-link.svg";
import starImg from "../assets/images/star.svg";
import logoImg from "../assets/images/logo.svg";
import backImg from "../assets/images/back.svg";

import toast, { Toaster } from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import { LeftPanel } from "../components/LeftPanel";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import useAuth from "../hooks/useAuth";

export function RoomsList() {
  const history = useHistory();
  const { user } = useAuth();
  const [roomsList, setRoomsList] = useState<Array<any>>([]);

  useEffect(() => {
    async function getUserKnownRooms(userData: any) {
      const parsedRooms = Object.entries(userData).map(([key, value]: any) => {
        return {
          rooms: Object.entries(value.rooms).map(([key, value]: any) => {
            return {
              id: value.roomId,
            };
          }),
        };
      });
      const roomsData = parsedRooms[0].rooms;
      const knownRoomsIds = roomsData.map((room) => room.id);

      await database.ref("rooms").once("value", (rooms) => {
        const roomsData = rooms.val();
        const parsedRoomsData = Object.entries(roomsData)
          .filter(([key, value]: any) => knownRoomsIds.includes(key))
          .map((room) => {
            return {
              id: room[0],
              data: room[1],
            };
          });
        setRoomsList(parsedRoomsData);
      });
    }

    async function loadUserKnownRooms() {
      if (user) {
        await database
          .ref("users")
          .orderByChild("userId")
          .equalTo(user.id)
          .once("value", async (user) => {
            const userData = user.val();
            if (userData) {
              await getUserKnownRooms(userData);
            }
          });
      }
    }

    loadUserKnownRooms();
  }, [user]);

  function handleGoToRoom(isAdmin: boolean, roomId: string) {
    if (isAdmin) {
      history.push(`/admin/rooms/${roomId}`);
    } else {
      history.push(`/rooms/${roomId}`);
    }
  }

  function handleRedirectToVideo(videoURL: string) {
    if (videoURL) {
      toast.success(videoURL);
      window.open(`https://${videoURL}`, "_blank");
    }
  }

  return (
    <div id="page-rooms-list">
      {/* <LeftPanel /> */}
      <div className="cards">
        <Link to="/">
          <img src={logoImg} alt="logo" />
        </Link>
        <button className="go-back" onClick={() => history.push("/")}>
          <img src={backImg} alt="Voltar" />
          <span>Voltar para a página inicial</span>
        </button>
        <header>
          <h2>Entre e gerencie salas conhecidas</h2>
          <span>
            Todas as salas que você já visitou ou é administrador aparecerão
            aqui!
          </span>
        </header>

        {roomsList.map((room) => {
          const isAdmin = user?.id === room.data.authorId;
          return (
            <div key={room.id} className={"card " + (isAdmin && "adm")}>
              <header>
                <div className="title">
                  <h3>{room.data.title}</h3>
                  {isAdmin && (
                    <div className="star">
                      <img src={starImg} alt="star" />
                      <span>Você é o administrador desta sala!</span>
                    </div>
                  )}
                </div>
                <div className="room-info">
                  <span>{room.id}</span>
                  <button onClick={() => handleGoToRoom(isAdmin, room.id)}>
                    Ir para sala
                  </button>
                </div>
              </header>
              <Toaster position="top-center" />

              <div className="author">
                <span>Responsável: </span>
                <span className="author-name">{room.data.authorName}</span>
              </div>

              <footer>
                {room.data.schedulerDate ? (
                  <span>
                    <strong>Dia: </strong>
                    {room.data.schedulerDate}
                    <strong> Hora: </strong>
                    {room.data.schedulerTime}
                  </span>
                ) : (
                  <span>Data de transmissão não informada</span>
                )}
                <div className="actions">
                  <button
                    onClick={() => handleRedirectToVideo(room.data.videoURL)}
                  >
                    <img src={externalLinkImg} alt="" />
                  </button>
                </div>
              </footer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
