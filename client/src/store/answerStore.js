import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const dummyAnswers = [
  {
    text: "Hey this is dummy text",
    userId: 1,
    likedBy: ["user1", "user2"],
    creationDate: new Date(),
  },
  {
    text: "Hey this is dummy text",
    userId: 1,
    likedBy: ["user1", "user2"],
    creationDate: new Date(),
  },
];

const useAnswerStore = create((set, get) => ({
  answers: dummyAnswers,
  fetchAnswers: async (qid) => {
    try {
      const response = await axiosInstance.get(`/answers/${qid}`);
      set({ answers: response.data });
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  },
  postAnswer: async (answer) => {
    try {
      const response = await axiosInstance.post("/answers/addAnswer", answer);
      set((state) => ({
        answers: [...state.answers, response.data],
      }));
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  },
  likeAnswer: async (answerId, userId) => {
    try {
      const answer = get().answers.find((answer) => answer._id === answerId);
      if (!answer.likedBy.includes(userId)) {
        await axiosInstance.put(`/answers/${answerId}/like`);
        set((state) => ({
          answers: state.answers.map((answer) =>
            answer._id === answerId
              ? { ...answer, likedBy: [...answer.likedBy, userId] }
              : answer
          ),
        }));
      }
    } catch (error) {
      console.error("Error liking answer:", error);
    }
  },
  dislikeAnswer: async (answerId, userId) => {
    try {
      const answer = get().answers.find((answer) => answer._id === answerId);
      if (answer.likedBy.includes(userId)) {
        await axiosInstance.put(`/answers/${answerId}/dislike`);
        set((state) => ({
          answers: state.answers.map((answer) =>
            answer._id === answerId
              ? {
                  ...answer,
                  likedBy: answer.likedBy.filter((id) => id !== userId),
                }
              : answer
          ),
        }));
      }
    } catch (error) {
      console.error("Error disliking answer:", error);
    }
  },
  deleteAnswer: async (answerId) => {
    try {
      await axiosInstance.delete(`/answers/${answerId}`);
      set((state) => ({
        answers: state.answers.filter((answer) => answer._id !== answerId),
      }));
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  },
}));

export default useAnswerStore;
