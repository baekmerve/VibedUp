import { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  fetchAllVideos,
  fetchAllPosts,
  fetchLatestVideos,
  getUserLikedVideos,
  getUserLikedPosts,
  deleteUserVideo,
  deleteUserPost,
  likeVideo,
  likePost,
  unlikeVideo,
  unlikePost,
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

  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);

  const [latestPosts, setLatestPosts] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const [likedVideoList, setLikedVideoList] = useState([]);
  const [savedVideoId, setSavedVideoId] = useState([]);
  const [likedPostList, setLikedPostList] = useState([]);
  const [savedPostId, setSavedPostId] = useState([]);

  const [searchPostResult, setSearchPostResult] = useState([]);
  const [searchVideoResult, setSearchVideoResult] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  // function for fetchUserData

  const fetchUserData = async () => {
    try {
      const userInfo = await getCurrentUser();
      if (userInfo) {
        setIsLoggedIn(true);
        setUser(userInfo);
        await Promise.all([fetchUserLikedVideos(), fetchUserLikedPosts()]);
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
  useEffect(() => {
    fetchUserData();
  }, []);

  // function for commonRefresh
  const commonRefresh = async (fetchData) => {
    if (refreshing) return; // Prevent refreshing if it's already in progress

    setRefreshing(true); // Start refreshing
    try {
      // Call the fetch function passed as argument
      await fetchData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false); // Stop refreshing when done
    }
  };

  // function for handleCreatePost
  const handleCreatePost = async (newPostData) => {
    try {
      // Assuming createPost is the function that adds a new post to the database
      await createPost(newPostData);

      // Refetch the user posts after creating a new post
      await fetchUserPostList(user.$id); // You can use the function that fetches the posts for the profile
      await fetchAllPostContent();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // function for handleCreatVideo
  const handleCreatVideo = async (newPostData) => {
    try {
      // Assuming createPost is the function that adds a new post to the database
      await createVideo(newPostData);

      // Refetch the user posts after creating a new post
      //setPosts((prevPosts) => [...prevPosts, newPostData]);
      await fetchUserVideoList(user.$id); // You can use the function that fetches the posts for the profile
      await fetchAllVideoContent();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // function for Like a Video
  const toggleLikeVideo = async (videoId) => {
    if (!user) return; // Ensure user is logged in
    try {
      if (savedVideoId.includes(videoId)) {
        // Video is already liked, so unlike it
        await unlikeVideo(user.$id, videoId);
        // Remove the video ID
        setSavedVideoId((prev) => prev.filter((id) => id !== videoId));
      } else {
        // Video is not liked, so like it
        await likeVideo(user.$id, videoId);
        // Add the video ID
        setSavedVideoId((prev) => [...prev, videoId]);
      }

      // After like/unlike, refetch the data to show the updated list
      fetchUserData(); // Refetch liked posts and videos
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  //function for Like a Posts
  const toggleLikePost = async (postId) => {
    if (!user) return; // Ensure user is logged in

    try {
      if (savedPostId.includes(postId)) {
        await unlikePost(user.$id, postId); // Call `unlikePost`
        setSavedPostId((prev) => prev.filter((id) => id !== postId)); // Remove the video ID
      } else {
        await likePost(user.$id, postId); // Call `likePost`
        setSavedPostId((prev) => [...prev, postId]); // Add the video ID
      }
      const updatedLikedPosts = await fetchUserLikedPosts();
      setLikedPostList(updatedLikedPosts);

      // After like/unlike, refetch the data to show the updated list
      fetchUserData(); // Refetch liked posts and videos
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  //function for updateContent
  const updateContent = async (contentId, updatedData, type) => {
    try {
      // Perform the update for either video or post
      if (type === "video") {
        await editUserVideo(contentId, updatedData); // Assuming editUserVideo is defined somewhere
      } else if (type === "post") {
        await editUserPost(contentId, updatedData); // Assuming editUserPost is defined somewhere
      }

      return `${type} updated successfully`;
    } catch (error) {
      console.error("Error updating content:", error.message);
      throw new Error(error.message || "Failed to update content");
    }
  };

  //function for fetch all videos
  const fetchAllVideoContent = async () => {
    try {
      const videoList = await fetchAllVideos();
      setVideos(videoList);
    } catch (error) {
      console.error("Error fetchAllContent:", error.message);
      throw new Error(error.message || "Failed to fetch video content");
    }
  };

  //function for fetch all posts
  const fetchAllPostContent = async () => {
    try {
      const postList = await fetchAllPosts();
      setPosts(postList);
    } catch (error) {
      console.error("Error fetchAllPostContent:", error.message);
      throw new Error(error.message || "Failed to fetch post content");
    }
  };

  //function for fetch all posts
  const fetchLatestVideoContent = async () => {
    try {
      const response = await fetchLatestVideos();
      setLatestPosts(response);
    } catch (error) {
      console.error("Error fetchAllPostContent:", error.message);
      throw new Error(error.message || "Failed to fetch post content");
    }
  };

  //function for deleteContent
  const deleteContent = async (contentId, type, refetchFunction) => {
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
              if (type === "video") {
                await deleteUserVideo(user.$id, contentId); // Call delete API for video
              } else if (type === "post") {
                await deleteUserPost(user.$id, contentId); // Call delete API for post
              }
              await refetchFunction(); // Call the passed refetch function
              alert(`${type} deleted successfully`);
            },
          },
        ]
      );
    } catch (error) {
      alert(error.message);
    }
  };

  //function for fetch all posts
  const fetchUserPostList = async () => {
    try {
      const postList = await getUserPosts(user.$id);
      setUserPosts(postList);
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
      throw new Error(error.message || "Failed to fetch user post list");
    }
  };
  //function for fetch all videos
  const fetchUserVideoList = async () => {
    try {
      const videoList = await getUserVideos(user.$id);
      setUserVideos(videoList);
    } catch (error) {
      console.error("Error fetching user videos:", error.message);
      throw new Error(error.message || "Failed to fetch user video list");
    }
  };

  //function for fetch SearchVideos
  const fetchSearchVideos = async (query) => {
    if (!query.trim()) {
      // Handle empty query gracefully, for example, reset search results
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

  //function for user liked videos
  const fetchUserLikedVideos = async () => {
    if (!user) return []; // Ensure user is logged in
    try {
      // Returns the list of liked video objects
      const likedVideosList = await getUserLikedVideos(user.$id);

      // Update state with the list of liked video IDs
      setSavedVideoId(likedVideosList.map((video) => video.$id));

      // Update state with the detailed liked video list
      setLikedVideoList(likedVideosList);

      return likedVideosList;
    } catch (error) {
      console.error("Error fetching liked videos:", error.message);
      return [];
    }
  };

  //function for user liked posts
  const fetchUserLikedPosts = async () => {
    if (!user) return []; // Ensure user is logged in
    try {
      const likedPostList = await getUserLikedPosts(user.$id); // Fetch videos
      setSavedPostId(likedPostList.map((post) => post.$id)); // Store IDs
      setLikedPostList(likedPostList);

      return likedPostList;
    } catch (error) {
      console.error("Error fetching liked post:", error.message);
      return [];
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
        user,
        setUser,
        isLoading,
        toggleLikeVideo,
        toggleLikePost,
        updateContent,
        videos,
        posts,
        latestPosts,
        userPosts,
        userVideos,
        fetchAllVideoContent,
        fetchAllPostContent,
        fetchLatestVideoContent,
        deleteContent,
        fetchUserPostList,
        fetchUserVideoList,
        userLogout,
        fetchUserLikedVideos,
        fetchUserLikedPosts,
        likedVideoList,
        likedPostList,
        savedVideoId,
        savedPostId,
        commonRefresh,
        refreshing,
        handleCreatePost,
        handleCreatVideo,
        fetchSearchVideos,
        fetchSearchPosts,
        searchPostResult,
        searchVideoResult,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
