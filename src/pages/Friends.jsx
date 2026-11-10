
import React, { useEffect, useCallback } from "react";
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
        resetUsers,
        isUsersLoading,
        hasMore,
    } = useFriendStore();

    const [page, setPage] = React.useState(1);

    const { ref: scrollRef, inView } = useInView({
        threshold: 0,
    });

    // Initial loading
    useEffect(() => {
        resetUsers();
        getFriendRequests();

        return () => {
            resetUsers();
        };
    }, [resetUsers, getFriendRequests]);

    // Fetch current page
    const loadUsers = useCallback(async () => {
        if (isUsersLoading || !hasMore) return;

        const result = await getUsers(page);

        if (result === true) {
            setPage((prev) => prev + 1);
        } else if (result === false) {
            // No more users.
        }
    }, [page, isUsersLoading, hasMore, getUsers]);

    // Load first page
    useEffect(() => {
        if (page === 1 && users.length === 0) {
            loadUsers();
        }
    }, [page, users.length, loadUsers]);

    // Infinite scrolling
    useEffect(() => {
        if (inView && page > 1 && hasMore && !isUsersLoading) {
            loadUsers();
        }
    }, [inView, page, hasMore, isUsersLoading, loadUsers]);

    return (
        <div className="h-screen bg-base-200 pt-20">
            <div className="max-w-screen-md mx-auto p-4 py-8">

                <Search />

                {/* Friend Requests */}

                {friendRequests?.length > 0 && (
                    <div className="mb-6">

                        <h2 className="text-lg font-bold mb-2">
                            Friend Requests
                        </h2>

                        {friendRequests.map((request) => (
                            <FriendRequests
                                key={request._id}
                                request={request}
                            />
                        ))}

                    </div>
                )}

                {/* Users */}

                <div
                    className="overflow-y-auto"
                    style={{
                        maxHeight: "calc(100vh - 200px)",
                    }}
                >

                    <h2 className="text-lg font-bold mb-2">
                        All Users
                    </h2>

                    {users.length > 0 ? (
                        users.map((user) => (
                            <UsersList
                                key={user._id}
                                user={user}
                            />
                        ))
                    ) : (
                        !isUsersLoading && (
                            <p className="text-center text-gray-500">
                                No users found.
                            </p>
                        )
                    )}

                    {isUsersLoading && (
                        <p className="text-center py-4">
                            Loading users...
                        </p>
                    )}

                    {!hasMore && users.length > 0 && (
                        <p className="text-center text-gray-500 py-4">
                            No more users.
                        </p>
                    )}

                    <div
                        ref={scrollRef}
                        className="h-10"
                    />

                </div>
            </div>
        </div>
    );
};

export default Friends;
