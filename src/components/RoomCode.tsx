import copyImg from "../assets/images/copy.svg";

import "../styles/roomCode.scss";

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {
  
  const roomCode = props.code

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(roomCode)
  }
  
  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="copy room code" />
      </div>
      <span>Sala #{roomCode}</span>
    </button>
  );
}
