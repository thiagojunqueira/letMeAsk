import copyImg from "../assets/images/copy.svg";

import "../styles/roomCode.scss";

import toast, { Toaster } from "react-hot-toast";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  const roomCode = props.code;

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(roomCode);
    toast.success('Código copiado!')
  }

  return (
    <>
      <Toaster />
      <button className="room-code" onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt="copy room code" />
        </div>
        <span>Sala #{roomCode}</span>
      </button>
    </>
  );
}
