import { useState, useEffect } from "react";
import { getUser } from "../request/user";


interface ProfileProps { 
    id: number
}

function Profile(props: ProfileProps) {

    const { id } = props;
    const [user, setUser] = useState({})

    useEffect(() => {
        getUser(id).then(setUser)
    }, [id])

    return (
        <div> Profile: {JSON.stringify(user)}</div>
    )
}


export default Profile;