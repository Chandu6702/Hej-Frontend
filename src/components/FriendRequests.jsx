import React from 'react'
import { useFriendStore } from '../store/useFriendStore'

const FriendRequests = ({ key, request }) => {
    const { respondToFriendRequest } = useFriendStore();

    return (
        <div
            key={key}
            className="w-full p-3 flex justify-between items-center gap-3 hover:bg-base-300 transition-colors">
            <div className="flex items-center gap-3">
                <img
                    src={request.from?.profilePic || "/avatar.png"}
                    alt={request.from?.fullName || "User"}
                    className="size-12 object-cover rounded-full"
                />
                <div className="text-left">
                    <div className="font-medium truncate">
                        {request.from?.fullName || "Unknown User"}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => respondToFriendRequest(key, "accepted")}
                    className="btn btn-success btn-sm"
                >
                    Accept
                </button>
                <button
                    onClick={() => respondToFriendRequest(key, "rejected")}
                    className="btn btn-error btn-sm"
                >
                    Reject
                </button>
            </div>
        </div>
    )
}

export default FriendRequests