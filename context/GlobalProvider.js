import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  getUserLikedVideos,
  likeVideo,
  unlikeVideo,
} from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        if (response) {
          setIsLoggedIn(true);
          setUser(response);

          // Fetch liked videos
          const likedVideosFromBackend = await getUserLikedVideos(response.$id);

          const likedVideoIds = likedVideosFromBackend.map(
            (video) => video.$id
          );

          setLikedVideos(likedVideoIds); // Set liked videos
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);


//function for Like a Video
  const toggleLike = async (videoId) => {
    if (!user) return; // Ensure user is logged in
    try {
      if (likedVideos.includes(videoId)) {
        await unlikeVideo(user.$id, videoId); // Call `unlikeVideo`
        setLikedVideos((prev) => prev.filter((id) => id !== videoId)); // Remove the video ID
      } else {
        await likeVideo(user.$id, videoId); // Call `likeVideo`
        setLikedVideos((prev) => [...prev, videoId]); // Add the video ID
      }
    } catch (error) {
      console.error("Error toggling like:", error);
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
