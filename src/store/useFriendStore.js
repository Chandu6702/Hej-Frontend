import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useFriendStore = create((set, get) => ({
  users: [],
  friends: [],
  friendRequests: [],
  searchedUsers: [],
  setUsers: (users) => set({ users }),

  getFriends: async () => {
    try {
      const res = await axiosInstance.get("/friends");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch friends.");
    }
  },

  getUsers: async (page = 1, limit = 10) => {
    set({ isUsersLoading: true });
    try {
      const currentUsers = get().users;
      const res = await axiosInstance.get(
        `/friends/users?page=${page}&limit=${limit}`
      );
      const newUsers = res.data.filteredUsers;

      const uniqueUsers = [
        ...currentUsers,
        ...newUsers.filter(
          (newUser) => !currentUsers.some((user) => user._id === newUser._id)
        ),
      ];

      set({ users: uniqueUsers });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ friendRequests: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch friend requests."
      );
    }
  },

  sendFriendRequest: async (friendId) => {
    try {
      await axiosInstance.post("/friends/request", { friendId });
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send friend request."
      );
    }
  },

  respondToFriendRequest: async (requestId, status) => {
    try {
      await axiosInstance.put("/friends/respond", { requestId, status });
      set({
        friendRequests: get().friendRequests.filter(
          (req) => req._id !== requestId
        ),
      });
      toast.success(`Friend request ${status}.`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update friend request."
      );
    }
  },

  searchUsers: async (query) => {
    try {
      const res = await axiosInstance.get(`/friends/search?query=${query}`);
      set({ searchedUsers: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search users.");
    }
  },
}));
