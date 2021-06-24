import "../styles/roomsList.scss";

import externalLinkImg from "../assets/images/external-link.svg";
import gearImg from "../assets/images/gear.svg";
import trashImg from "../assets/images/trash.svg";
import starImg from "../assets/images/star.svg";

import toast, { Toaster } from 'react-hot-toast'

export function RoomsList() {
  let isAdmin = false;

  function callToaster() {
    toast.success('Teste de sucesso!');
  }

  return (
    <div className="cards">
      <div className={"card " + (isAdmin && "adm")}>
        <Toaster position='top-center'/>
        <header>
          <div className="title">
            <h3>Live de encerramento NLW</h3>
            {isAdmin && (
              <div className="star">
                <img src={starImg} alt="star" />
                <span>Você é o administrador desta sala!</span>
              </div>
            )}
          </div>
          <div className="room-info">
            <span>-Mcsf1jbblHxHosvHcwe</span>
            <button onClick={callToaster}>Ir para sala</button>
          </div>
        </header>

        <div className="author">
          <span>Responsável: </span>
          <span className="author-name">Diego Fernandes</span>
        </div>

        <footer>
          <span>
            <strong>Dia: </strong>27/06/2021<strong> Hora: </strong>20:00
          </span>
          <div className="actions">
            <button>
              <img src={externalLinkImg} alt="" />
            </button>
            {isAdmin && (
              <button>
                <img src={gearImg} alt="" />
              </button>
            )}
            <button>
              <img src={trashImg} alt="" />
            </button>
          </div>
        </footer>
      </div>

      {isAdmin = true}

      <div className={"card " + (isAdmin && "adm")}>
        <header>
          <div className="title">
            <h3>Live de encerramento NLW</h3>
            {isAdmin && (
              <div className="star">
                <img src={starImg} alt="star" />
                <span>Você é o administrador desta sala!</span>
              </div>
            )}
          </div>
          <div className="room-info">
            <span>-Mcsf1jbblHxHosvHcwe</span>
            <button>Ir para sala</button>
          </div>
        </header>

        <div className="author">
          <span>Responsável: </span>
          <span className="author-name">Diego Fernandes</span>
        </div>

        <footer>
          <span>
            <strong>Dia: </strong>27/06/2021<strong> Hora: </strong>20:00
          </span>
          <div className="actions">
            <button>
              <img src={externalLinkImg} alt="" />
            </button>
            {isAdmin && (
              <button>
                <img src={gearImg} alt="" />
              </button>
            )}
            <button>
              <img src={trashImg} alt="" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
