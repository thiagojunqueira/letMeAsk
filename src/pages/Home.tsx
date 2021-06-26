import { useHistory } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { LeftPanel } from "../components/LeftPanel";

import { LoginOptions } from "../components/LoginOptions";
import { UserProfile } from "../components/UserProfile";
import useAuth from "../hooks/useAuth";

import "../styles/auth.scss";


export function Home() {
  const { user } = useAuth();
  const history = useHistory();

  return (
    <div id="page-auth">
      <LeftPanel />
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask logo" />
          {user ? (
            <UserProfile />
          ) : (
            <>
              <LoginOptions />
              <button onClick={() => history.push('/rooms/join')}  className="join-as-visitor">
                Ou entre em uma sala como visitante
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
