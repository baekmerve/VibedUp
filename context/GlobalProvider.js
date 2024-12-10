import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, toggleLikeVideo } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    getCurrentUser()
      .then(async (response) => {
        if (response) {
          setIsLoggedIn(true);
          setUser(response);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
      
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Toggle like for a video
  const toggleLike = async (videoId) => {
    if (user) {
      const result = await toggleLikeVideo(user.$id, videoId); // Call the function from Appwrite

      if (result.status === "liked") {
        // If the video was liked, add it to the list
        setLikedVideos((prev) => [...prev, videoId]);
      } else if (result.status === "withdrawn") {
        // If the like was withdrawn, remove it from the list
        setLikedVideos((prev) => prev.filter((id) => id !== videoId));
      }
    }
  };



  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        likedVideos,
        setLikedVideos,
        toggleLike,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
