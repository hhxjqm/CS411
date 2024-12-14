import { createContext } from "react";
import { type User } from "../request/user"

type UserContextType = {
  login: User | undefined;
  setLogin: (user: User) => void;
}

const UserContext = createContext<UserContextType>({ login: undefined, setLogin: () => {} });

export default UserContext;