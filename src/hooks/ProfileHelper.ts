import { database } from "../services/firebase";
import useAuth from "./useAuth";

export default async function ProfileHelper() {
  const { user } = useAuth();

  async function addUserToDatabase() {
    const firebaseUser = await database.ref("users").push({
      userId: user?.id,
      avatar: user?.avatar,
      name: user?.name,
    });
  
    return firebaseUser.key || "";
  }

  return addUserToDatabase

}

