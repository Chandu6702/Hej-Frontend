import React, { useState, useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useInView } from "react-intersection-observer";
import FriendRequests from "../components/FriendRequests";
import UsersList from "../components/UsersList";
import Search from "../components/Search";

const Friends = () => {
    const {
        users,
        friendRequests,
        getUsers,
        getFriendRequests,
    } = useFriendStore();

    const [page, setPage] = useState(1);
    const { ref, inView } = useInView({ threshold: 1 }); // Trigger when fully visible
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading for infinite scroll

    useEffect(() => {
        getUsers(page);
        getFriendRequests();
    }, [page]);

    // Infinite Scroll Handler
    useEffect(() => {
        if (inView && !isLoadingMore) {
            setIsLoadingMore(true);
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView, isLoadingMore]);

    useEffect(() => {
        if (!inView) {
            setIsLoadingMore(false);
        }
    }, [inView]);

    return (
        <div className="h-screen bg-base-200 pt-20">
            <div className="max-w-screen-md mx-auto p-4 py-8">
                {/* Search Bar */}
                <Search />

                {/* Friend Requests */}
                {friendRequests?.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2">Friend Requests</h2>
                        {friendRequests.map((request) => (
                            <FriendRequests key={request._id} request={request} />
                        ))}
                    </div>
                )}

                {/* Users List */}
                <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                    <h2 className="text-lg font-bold mb-2">All Users</h2>
                    {users?.length > 0 ? (
                        users.map((user) => <UsersList id={user._id} user={user} />)
                    ) : (
                        <p className="text-center text-gray-500">No users found.</p>
                    )}
                    <div ref={ref} className="h-10" />
                </div>
            </div>
        </div>
    );
};

export default Friends;
