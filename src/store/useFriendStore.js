import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useFriendStore = create((set, get) => ({
  users: [],
  friends: [],
  friendRequests: [],
  searchedUsers: [],

  isUsersLoading: false,
  isFriendsLoading: false,
  isRequestsLoading: false,
  isSearching: false,

  hasMore: true,

  // ====================================
  // RESET USERS
  // ====================================

  resetUsers: () => {
    set({
      users: [],
      hasMore: true,
      isUsersLoading: false,
    });
  },

  // ====================================
  // GET USERS
  // ====================================

  getUsers: async (page = 1, limit = 10) => {
    if (get().isUsersLoading) {
      return null;
    }

    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get(
        `/friends/users?page=${page}&limit=${limit}`,
      );

      const newUsers = res.data.filteredUsers || [];

      set((state) => {
        const existingIds = new Set(state.users.map((user) => user._id));

        const uniqueUsers = newUsers.filter(
          (user) => !existingIds.has(user._id),
        );

        return {
          users: [...state.users, ...uniqueUsers],
          hasMore: res.data.hasMore,
        };
      });

      return res.data.hasMore;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users.");

      return null;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ====================================
  // GET FRIENDS
  // ====================================

  getFriends: async () => {
    set({ isFriendsLoading: true });

    try {
      const res = await axiosInstance.get("/friends");

      set({
        friends: res.data,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch friends.");
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  // ====================================
  // GET FRIEND REQUESTS
  // ====================================

  getFriendRequests: async () => {
    set({ isRequestsLoading: true });

    try {
      const res = await axiosInstance.get("/friends/requests");

      set({
        friendRequests: res.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch friend requests.",
      );
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  // ====================================
  // SEND FRIEND REQUEST
  // ====================================

  sendFriendRequest: async (friendId) => {
    try {
      await axiosInstance.post("/friends/request", { friendId });

      set((state) => ({
        users: state.users.filter((user) => user._id !== friendId),

        searchedUsers: state.searchedUsers.filter(
          (user) => user._id !== friendId,
        ),
      }));

      toast.success("Friend request sent!");

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send friend request.",
      );

      return false;
    }
  },

  // ====================================
  // RESPOND TO FRIEND REQUEST
  // ====================================

  respondToFriendRequest: async (requestId, status) => {
    try {
      const request = get().friendRequests.find((req) => req._id === requestId);

      await axiosInstance.put("/friends/respond", {
        requestId,
        status,
      });

      set((state) => ({
        friendRequests: state.friendRequests.filter(
          (req) => req._id !== requestId,
        ),

        friends:
          status === "accepted" && request?.from
            ? [...state.friends, request.from]
            : state.friends,
      }));

      toast.success(`Friend request ${status}.`);

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update friend request.",
      );

      return false;
    }
  },

  // ====================================
  // SEARCH USERS
  // ====================================

  searchUsers: async (query) => {
    const requestId = (get().searchRequestId || 0) + 1;

    set({
      searchRequestId: requestId,
      isSearching: true,
    });

    if (!query.trim()) {
      set({
        searchedUsers: [],
        isSearching: false,
      });
      return;
    }

    try {
      const params = new URLSearchParams({
        query: query.trim(),
      });

      const res = await axiosInstance.get(
        `/friends/search?${params.toString()}`,
      );

      // Ignore outdated responses.
      if (get().searchRequestId !== requestId) return;

      set({
        searchedUsers: res.data,
      });
    } catch (error) {
      if (get().searchRequestId !== requestId) return;

      toast.error(error.response?.data?.message || "Failed to search users.");
    } finally {
      if (get().searchRequestId === requestId) {
        set({ isSearching: false });
      }
    }
  },
}));
