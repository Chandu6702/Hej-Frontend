import React, { useState, useEffect } from 'react';
import { useFriendStore } from '../store/useFriendStore';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const { searchedUsers, searchUsers } = useFriendStore();

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            searchUsers(query);
        }, 300);

        setDebounceTimeout(newTimeout);
    };

    return (
        <>
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search users"
                    className="input input-bordered w-full"
                />
            </div>

            {/* Search Results */}
            {searchedUsers.map((user) => (
                <div
                    key={user._id}
                    className="w-full p-3 flex justify-between items-center gap-3 hover:bg-base-300 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.profilePic || "/avatar.png"}
                            alt={user?.fullName || "User"}
                            className="size-12 object-cover rounded-full"
                        />
                        <div className="text-left">
                            <div className="font-medium truncate">
                                {user?.fullName || "Unknown User"}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => sendFriendRequest(user._id)}
                        className="btn btn-primary btn-sm"
                    >
                        Send Request
                    </button>
                </div>
            ))}
        </>
    );
};

export default Search;