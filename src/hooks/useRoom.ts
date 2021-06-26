import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import useAuth from "./useAuth";


type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
      id: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {
      authorId: string
    }>
  }
>;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
    id: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on("value", (room) => {
      const roomData = room.val();
      const questions: FirebaseQuestions = roomData.questions ?? {};

      const parsedQuestions = Object.entries(questions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        };
      });

      setTitle(roomData.title);
      setAuthorId(roomData.authorId);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id]);

  return { questions, title, authorId }
}