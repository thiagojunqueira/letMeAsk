import { Link, useHistory } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

import logoImg from "../assets/images/logo.svg";
import backImg from "../assets/images/back.svg";
import errorImg from "../assets/images/error.svg";
import { Button } from "../components/Button";

import "../styles/newRoom.scss";
import { database } from "../services/firebase";
import { LeftPanel } from "../components/LeftPanel";

type RoomInfoProps = {
  roomName: string;
  roomDescription: string;
  schedulerDate: string;
  schedulerTime: string;
  videoUrl: string;
};

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();

  const { register, handleSubmit } = useForm();

  async function updateUserProfile(roomId: string | null) {
    async function addRoomToUserProfile(firebaseUserId: string | null) {
      if (firebaseUserId) {
        await database.ref(`users/${firebaseUserId}/rooms`).push({
          roomId: roomId,
          isAdmin: true,
        });
      }
    }
    
    if (user && roomId) {
      await database
            .ref("users")
            .orderByChild("userId")
            .equalTo(user?.id)
            .once("value", async (data) => {
              const userData = data.val();
              if (userData) {
                // usuario existe na entidade
                const parsedUser = Object.entries(userData).map(
                  ([key, value]: any) => {
                    return {
                      firebaseUserKey: key,
                    };
                  }
                );
                await addRoomToUserProfile(parsedUser[0].firebaseUserKey)
              } else {
                const firebaseUser = await database.ref("users").push({
                  userId: user.id,
                  avatar: user?.avatar,
                  name: user?.name,
                });
                await addRoomToUserProfile(firebaseUser.key)
              }
            })
    }
  }

  async function onSubmit(formData: RoomInfoProps, e: any) {
    if (formData.roomName.trim() === "") {
      toast.error("Por favor insira o nome da sala!");
      return;
    }
    console.log(formData);
    e.target.reset();

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: formData.roomName,
      description: formData.roomDescription,
      schedulerDate: formData.schedulerDate,
      schedulerTime: formData.schedulerTime,
      videoURL: formData.videoUrl,
      authorId: user?.id,
      authorName: user?.name,
    });
    await updateUserProfile(firebaseRoom.key);

    toast.success("Sucesso! Redirecionando...");
    setTimeout(() => {
      history.push(`/admin/rooms/${firebaseRoom.key}`);
    }, 2000);
  }

  return (
    <div id="new-room">
      {/* <LeftPanel /> */}
      <main>
        <div className="main-content">
          <Toaster />
          <Link to="/">
            <img src={logoImg} alt="Letmeask logo" />
          </Link>
          <button className="go-back" onClick={() => history.push("/")}>
            <img src={backImg} alt="Voltar" />
            <span>Voltar para a página inicial</span>
          </button>

          {user ? (
            <>
              <header>
                <h2>Informe os dados da nova sala!</h2>
                <span>
                  Após isso, é só compartilhar o link da sala com seus
                  espectadores.
                </span>
              </header>
              <form className="create-room" onSubmit={handleSubmit(onSubmit)}>
                <label>
                  Nome da sala *
                  <input
                    type="text"
                    placeholder="Dê um nome à sua sala!"
                    {...register("roomName")}
                  />
                </label>
                <label>
                  Descrição da sala
                  <textarea
                    placeholder="Adicione uma breve descrição"
                    {...register("roomDescription")}
                  />
                </label>

                <div className="video-scheduler">
                  <label>
                    Dia
                    <input type="date" {...register("schedulerDate")} />
                  </label>
                  <label>
                    Hora
                    <input type="time" {...register("schedulerTime")} />
                  </label>
                </div>
                <label>
                  Link da plataforma de stream
                  <input
                    type="text"
                    placeholder="Qual é o link da transmissão?"
                    {...register("videoUrl")}
                  />
                </label>

                <Button type="submit">Criar Sala!</Button>
              </form>
              <p>
                Quer entrar em uma sala existente?{" "}
                <Link to="/rooms/join">Clique aqui!</Link>
              </p>
            </>
          ) : (
            <div className="invalid-user">
              <img src={errorImg} alt="" />
              <h1>Parece que você não está logado!</h1>
              <p>
                Deseja entrar em uma sala como visitante?{" "}
                <Link to="/rooms/join">Clique aqui!</Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
