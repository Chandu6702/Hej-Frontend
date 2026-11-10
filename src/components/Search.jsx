
import React, { useState, useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import UsersList from "./UsersList";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        searchedUsers,
        searchUsers,
        isSearching,
    } = useFriendStore();

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Debounced search
    useEffect(() => {
        const query = searchQuery.trim();

        if (!query) {
            useFriendStore.setState({
                searchedUsers: [],
            });
            return;
        }

        const timeout = setTimeout(() => {
            searchUsers(query);
        }, 400);

        return () => clearTimeout(timeout);

    }, [searchQuery, searchUsers]);

    return (
        <div className="mb-4">

            {/* Search Input */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search users..."
                className="input input-bordered w-full"
            />

            {/* Search Results */}
            {searchQuery.trim() && (
                <div className="mt-3">

                    {isSearching && (
                        <p className="text-center text-gray-500 py-3">
                            Searching...
                        </p>
                    )}

                    {!isSearching && searchedUsers.length === 0 && (
                        <p className="text-center text-gray-500 py-3">
                            No users found.
                        </p>
                    )}

                    {!isSearching && searchedUsers.map((user) => (
                        <UsersList
                            key={user._id}
                            user={user}
                        />
                    ))}

                </div>
            )}

        </div>
    );
};

export default Search;
