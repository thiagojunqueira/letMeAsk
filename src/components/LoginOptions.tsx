import useAuth from "../hooks/useAuth";
import googleIconImg from "../assets/images/google-icon.svg";
import githubIconImg from "../assets/images/github-icon.svg";

import '../styles/loginOptions.scss'

export function LoginOptions() {
  const { user, signInWithGoogle, signInWithGithub } = useAuth();
  
  async function handleUserLogin(provider: string) {
    if (!user) {
      switch (provider) {
        case "google":
          await signInWithGoogle();
          break;
        case "github":
          await signInWithGithub();
          break;
      }
    }
  }

  return (
    <div id="login-buttons">
      <h3>Parece que você não está autenticado...</h3>
      <button
        className="create-room-button google-button"
        onClick={() => handleUserLogin("google")}
      >
        <img src={googleIconImg} alt="Logo do google" />
        Faça login com Google
      </button>
      <button
        className="create-room-button github-button"
        onClick={() => handleUserLogin("github")}
      >
        <img src={githubIconImg} alt="Logo do google" />
        Faça login com Github
      </button>
    </div>
  );
}