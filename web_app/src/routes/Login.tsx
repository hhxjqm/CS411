import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../request/user";
import UserContext from "../context/UserContext";

function LoginRouter() {
  const { setLogin } = useContext(UserContext);
  const [userId, setUserId] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await getUser(Number(userId));
      if (user) {
        setLogin(user);
        navigate("/"); // Navigate to the Profile page
      } else {
        setResponse("User not found.");
      }
    } catch (error) {
      setResponse("Error logging in.");
    }
  };

  return (
    <div className="body">
    <div className="App" >
      <h1>Welcome to MintTrack🍃</h1>
      <p>Please Use Your User ID to Login:</p>
      <div>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {response && <p>{response}</p>}
      </div>
    </div>
    </div>
  );
}

export default LoginRouter;
