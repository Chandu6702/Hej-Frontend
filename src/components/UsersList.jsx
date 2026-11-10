
import React, { useState } from "react";
import { useFriendStore } from "../store/useFriendStore";

const UsersList = ({ user }) => {
    const { sendFriendRequest } = useFriendStore();

    const [isSending, setIsSending] = useState(false);

    const handleSendRequest = async () => {
        if (isSending) return;

        setIsSending(true);

        try {
            await sendFriendRequest(user._id);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-full p-3 flex justify-between items-center gap-3 hover:bg-base-300 transition-colors">

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
                onClick={handleSendRequest}
                disabled={isSending}
                className="btn btn-primary btn-sm"
            >
                {isSending ? "Sending..." : "Send Request"}
            </button>

        </div>
    );
};

export default UsersList;
