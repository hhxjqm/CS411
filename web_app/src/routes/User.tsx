import { useEffect, useState } from "react";
import { getUser, type User } from "../request/user";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

function UserRouter() {
    const { id } = useParams()
    const [user, setUser] = useState<User | undefined>();

    useEffect(() => {
        if (!id) {
            return;
        }
        getUser(Number.parseInt(id)).then(setUser)
    }, [id])

    if (!user) {
        return <Typography>Loading...</Typography>
    }

    return <Typography>{user.Name} | {user?.PhoneNumber}</Typography>;
}

export default UserRouter;