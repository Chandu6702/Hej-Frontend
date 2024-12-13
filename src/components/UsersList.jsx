import React from 'react'
import { useFriendStore } from "../store/useFriendStore";

const UsersList = ({ id, user }) => {
    const { sendFriendRequest } = useFriendStore();
    return (
        <div
            key={id}
            className="w-full p-3 flex justify-between items-center gap-3 hover:bg-base-300 transition-colors"
        >
            <div className="flex items-center gap-3">
                <img
                    src={user?.profilePic || "/avatar.png"}
                    alt={user?.fullName}
                    className="size-12 object-cover rounded-full"
                />
                <div className="text-left">
                    <div className="font-medium truncate">{user.fullName}</div>
                </div>
            </div>
            <button
                onClick={() => sendFriendRequest(id)}
                className="btn btn-primary btn-sm"
            >
                Send Request
            </button>
        </div>
    )
}

export default UsersList