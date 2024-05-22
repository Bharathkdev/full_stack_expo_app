import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/appwrite";
  
const GlobalContext = createContext();
  
export const useGlobalContext = () => useContext(GlobalContext);
  
export const GlobalProvider = ({children}: any) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        getCurrentUser().then(res => {
            if(res) {
                setIsLoggedIn(true);
                setUser(res);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        })
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false));
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                isLiked,
                setIsLiked,
                setUser,
                isLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}