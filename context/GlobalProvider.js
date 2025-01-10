import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  fetchAllVideos,
  fetchAllPosts,
  fetchLatestVideos,
  getUserSavedVideos,
  getUserSavedPosts,
  deleteUserVideo,
  deleteUserPost,
  saveVideo,
  savePost,
  getUserVideos,
  getUserPosts,
  editUserVideo,
  editUserPost,
  logout,
  createPost,
  createVideo,
  searchVideos,
  searchPosts,
} from "../lib/appwrite";
import { Alert } from "react-native";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [latestPosts, setLatestPosts] = useState([]);

  const [allContents, setAllContents] = useState([]);
  const [userContents, setUserContents] = useState([]);
  const [savedContents, setSavedContents] = useState([]);
  const [savedContentId, setSavedContentId] = useState([]);

  const [searchPostResult, setSearchPostResult] = useState([]);
  const [searchVideoResult, setSearchVideoResult] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  // function for fetchUserData

  // place fetchUserData in context to avoid redundancy
  const fetchUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setIsLoggedIn(true);
        setUser(currentUser);

        const filteredUserPosts = allContents.filter(
          (content) => content.creator.$id === user.$id
        );
        setUserContents(filteredUserPosts);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUserContents([]);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch data when the app starts
  }, []);

  // function for handleCreatePost
  const handleCreatePost = async (newData) => {
    try {
      const result = await createPost(newData);

      setAllContents((prevContents) => {
        const updatedContents = [result, ...prevContents];
        console.log("Updated allContents", updatedContents);
        return updatedContents;
      });
       fetchAllContents();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // function for handleCreatVideo
  const handleCreatVideo = async (newData) => {
    try {
      const result = await createVideo(newData);

      setAllContents((prevContents) => {
        const updatedContents = [result, ...prevContents];
        return updatedContents;
      });
      fetchAllContents();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  // function for toggleSaveContent
  const toggleSaveContent = async (contentId, type) => {
    if (!user) return; // Ensure user is logged in
    try {
      // Dynamically get the current liked state (video or post)
      const saveFunction = type === "video" ? saveVideo : savePost;

      await saveFunction(user.$id, contentId); // Like the content
      console.log("saved", contentId);

      setSavedContentId((prev) => [contentId, ...prev]); //

      fetchUserSavedContent(user.$id);
    } catch (error) {
      console.error("Error toggling save/remove:", error);
    }
  };

  // function for fetchUserSavedContent

  const fetchUserSavedContent = async (userId, type = null) => {
    if (!user) {
      console.error("User is not logged in");
      return [];
    }
    try {
      // Initialize arrays for liked videos and posts
      let savedVideos = [];
      let savedPosts = [];
      // Fetch video content
      if (!type || type === "video") {
        savedVideos = await getUserSavedVideos(userId);
      }
      // Fetch post content
      if (!type || type === "post") {
        savedPosts = await getUserSavedPosts(userId);
      }
      // Combine and return content
      const savedContentList = [
        ...savedVideos.map((item) => ({ ...item, type: "video" })),
        ...savedPosts.map((item) => ({ ...item, type: "post" })),
      ].sort((a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt));

      setSavedContentId(savedContentList.map((content) => content.$id));

      // Set the combined content to state
      setSavedContents(savedContentList);
    } catch (error) {
      console.error(
        "Error fetching user saved content:",
        error.response || error.message
      );
      throw new Error(
        error.message || "Failed to fetch user saved content list"
      );
    }
  };

  //function for updateContent
  const updateContent = async (contentId, updatedData, type, updateState) => {
    if (!user) return;
    try {
      // Perform the update for either video or post
      if (type === "video") {
        await editUserVideo(contentId, updatedData);
        setUserContents((prevVideos) =>
          prevVideos.map((video) =>
            video.$id === contentId ? { ...video, ...updatedData } : video
          )
        );
      } else if (type === "post") {
        await editUserPost(contentId, updatedData);
        setUserContents((prevPosts) =>
          prevPosts.map((post) =>
            post.$id === contentId ? { ...post, ...updatedData } : post
          )
        );
      }

      updateState((prevContent) =>
        prevContent.map((post) =>
          post.$id === contentId ? { ...post, ...updatedData } : post
        )
      );
    } catch (error) {
      console.error("Error updating content:", error.message);
      throw new Error(error.message || "Failed to update content");
    }
  };

  //function for fetchAllContents {
  const fetchAllContents = async (type = null) => {
    try {
      const fetchContentByType = async (fetchFunction, contentType) => {
        const content = await fetchFunction();
        console.log(`Fetched ${content.length} ${contentType}(s)`);
        return content.map((item) => ({ ...item, type: contentType }));
      };

      // Fetch content based on the type
      const videos =
        !type || type === "video"
          ? await fetchContentByType(fetchAllVideos, "video")
          : [];

      const posts =
        !type || type === "post"
          ? await fetchContentByType(fetchAllPosts, "post")
          : [];

      // Combine and sort content
      const combinedContent = [...videos, ...posts].sort(
        (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
      );
      setAllContents(combinedContent);

      return combinedContent;
    } catch (error) {
      const errorDetails =
        error.response || error.message || JSON.stringify(error);
      console.error("Error fetching all content:", errorDetails);
      throw new Error("Failed to fetch all content list");
    }
  };

  //function for fetch fetchLatestVideoContent
  const fetchLatestVideoContent = async () => {
    try {
      const response = await fetchLatestVideos();
      setLatestPosts(response);
    } catch (error) {
      console.error("Error fetchLatestVideoContent:", error.message);
      throw new Error(error.message || "Failed to fetch post content");
    }
  };

  //function for deleteContent
  const deleteContent = async (contentId, type, updateState) => {
    if (!user) return;

    try {
      Alert.alert(
        "Delete Content",
        `Are you sure you want to delete this ${type}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              console.log(`Deleting ${type} with ID: ${contentId}`);
              try {
                if (type === "video") {
                  await deleteUserVideo(user.$id, contentId); // Delete video API call
                } else if (type === "post") {
                  await deleteUserPost(user.$id, contentId); // Delete post API call
                }

                // Update state to reflect the deletion
                updateState((prevContent) =>
                  prevContent.filter((item) => item.$id !== contentId)
                );

                alert(`${type} deleted successfully`);
              } catch (error) {
                console.error(`Error deleting ${type}:`, error);
                alert(`Failed to delete ${type}. Please try again.`);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in deleteContent:", error);
      alert(error.message);
    }
  };

  //function for fetch user content
  const fetchUserContents = async (userId, type = null) => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
    try {
      let videos = [];
      let posts = [];
      // Fetch video content
      if (!type || type === "video") {
        videos = await getUserVideos(userId);
      }
      // Fetch post content
      if (!type || type === "post") {
        posts = await getUserPosts(userId);
      }
      // Combine and return content
      const combinedContent = [
        ...videos.map((item) => ({ ...item, type: "video" })),
        ...posts.map((item) => ({ ...item, type: "post" })),
      ].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

      return combinedContent;
    } catch (error) {
      console.error(
        "Error fetching user content:",
        error.response || error.message
      );
      throw new Error(error.message || "Failed to fetch user content list");
    }
  };

  //function for fetch SearchVideos
  const fetchSearchVideos = async (query) => {
    if (!query.trim()) {
      // Handle empty query,  reset search results
      setSearchVideoResult([]);
      return;
    }
    try {
      const searchedVideos = await searchVideos(query);
      setSearchVideoResult(searchedVideos);
    } catch (error) {
      console.error("Error fetching search video result :", error.message);
      setSearchVideoResult([]);
      throw new Error(error.message || "Failed to fetch search video result");
    }
  };

  //function for fetch SearchVideos
  const fetchSearchPosts = async (query) => {
    if (!query.trim()) {
      // Handle empty query gracefully, for example, reset search results
      setSearchPostResult([]);
      return;
    }
    try {
      const searchPostResult = await searchPosts(query);
      setSearchPostResult(searchPostResult);
    } catch (error) {
      console.error("Error fetching search post result :", error.message);
      setSearchPostResult([]);
      throw new Error(error.message || "Failed to fetch search post result");
    }
  };

  //function for user logout
  const userLogout = async () => {
    await logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userLogout,
        user,
        setUser,
        isLoading,
        setRefreshing,

        //? function
        updateContent,
        deleteContent,
        toggleSaveContent,
        handleCreatePost,
        handleCreatVideo,
        refreshing,

        //?fetching function
        fetchUserSavedContent,
        fetchUserContents,
        fetchAllContents,
        fetchLatestVideoContent,

        fetchSearchVideos,
        fetchSearchPosts,
        searchPostResult,
        searchVideoResult,

        //?Arrays
        userContents,
        setUserContents,
        ////
        allContents,
        setAllContents,
        ////
        savedContents,
        setSavedContents,
        savedContentId,
        setSavedContentId,
        ////
        latestPosts,
        ////
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
