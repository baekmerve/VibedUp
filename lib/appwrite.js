import {
  Account,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

import {
  APPWRITE_ENDPOINT,
  APPWRITE_PLATFORM,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_VIDEO_COLLECTION_ID,
  APPWRITE_LIKED_VIDEO_COLLECTION_ID,
  APPWRITE_LIKED_POST_COLLECTION_ID,
  APPWRITE_POSTS_COLLECTION_ID,
  APPWRITE_STORAGE_ID,
} from "@env";

export const config = {
  endpoint: APPWRITE_ENDPOINT,
  platform: APPWRITE_PLATFORM,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  videoCollectionId: APPWRITE_VIDEO_COLLECTION_ID,
  postCollectionId: APPWRITE_POSTS_COLLECTION_ID,
  likedVideoCollectionId: APPWRITE_LIKED_VIDEO_COLLECTION_ID,
  likedPostCollectionId: APPWRITE_LIKED_POST_COLLECTION_ID,
  storageId: APPWRITE_STORAGE_ID,
};

const client = new Client();

client
  .setEndpoint(config.endpoint) //  Appwrite Endpoint
  .setProject(config.projectId) //  project ID
  .setPlatform(config.platform); //  application ID or bundle ID.

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

//function for Register User //
export const createAccount = async (email, password, username, avatar) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatar
      ? await uploadFile(avatar, "image").catch((error) => {
          console.error("Avatar upload failed:", error);
          return null; // Proceed without an avatar if upload fails
        })
      : null;
    await login(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.error("Error in createAccount:", error);
    throw new Error("An error occurred during account creation.");
  }
};

//function for Login User //
export const login = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

//function for getCurrentUser //
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {}
};

//function for fecthing videos //
export const fetchAllVideos = async () => {
  try {
    const videos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

//function for fecthing posts //
export const fetchAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.postCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

//function for latest videos //
export const fetchLatestVideos = async () => {
  try {
    const videos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,

      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};
//function for search videos //
export const searchVideos = async (query) => {
  try {
    const [titleResults, contentResults] = await Promise.all([
      databases.listDocuments(config.databaseId, config.videoCollectionId, [
        Query.search("title", query),
      ]),
      databases.listDocuments(config.databaseId, config.videoCollectionId, [
        Query.search("content", query),
      ]),
    ]);

    // Combine results and remove duplicates based on $id
    const combinedResults = [
      ...titleResults.documents,
      ...contentResults.documents,
    ];

    const uniqueResults = Array.from(
      new Map(combinedResults.map((item) => [item.$id, item])).values()
    );

    return uniqueResults;
  } catch (error) {
    console.error("Error searching videos:", error.message);
    throw new Error("Failed to fetch search results");
  }
};
//function for search posts //
export const searchPosts = async (query) => {
  try {
    const [titleResults, contentResults] = await Promise.all([
      databases.listDocuments(config.databaseId, config.postCollectionId, [
        Query.search("title", query),
      ]),
      databases.listDocuments(config.databaseId, config.postCollectionId, [
        Query.search("content", query),
      ]),
    ]);

    // Combine and remove duplicates
    const combinedResults = [
      ...titleResults.documents,
      ...contentResults.documents,
    ];

    const uniqueResults = Array.from(
      new Map(combinedResults.map((item) => [item.$id, item])).values()
    );

    return uniqueResults;
  } catch (error) {
    console.error("Error searching posts:", error.message);
    throw new Error("Failed to fetch search results");
  }
};

//function for getUser videos //
export const getUserVideos = async (userId) => {
  try {
    const videos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

//function for getUser videos //
export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

//function for deleteUserPost  //
export const deleteUserVideo = async (userId, videoId) => {
  try {
    //Step 1: Check if the user is the creator of the post
    const video = await databases.getDocument(
      config.databaseId,
      config.videoCollectionId,
      videoId
    );

    if (video.creator.$id !== userId) {
      throw new Error("You can only delete your own posts.");
    }

    // Step 2: If the user is the creator, delete the post
    await databases.deleteDocument(
      config.databaseId,
      config.videoCollectionId,
      videoId
    );
    console.log("Video deleted successfully", videoId);
    return { status: "success" };
  } catch (error) {
    console.error("Error deleting video:", error);
    throw new Error("Failed to delete video");
  }
};

//function for deleteUserPost  //
export const deleteUserPost = async (userId, videoId) => {
  try {
    //Step 1: Check if the user is the creator of the post
    const post = await databases.getDocument(
      config.databaseId,
      config.postCollectionId,
      videoId
    );

    if (post.creator.$id !== userId) {
      throw new Error("You can only delete your own posts.");
    }

    // Step 2: If the user is the creator, delete the post
    await databases.deleteDocument(
      config.databaseId,
      config.postCollectionId,
      videoId
    );
    console.log("Post deleted successfully", videoId);
    return { status: "success" };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
};

//function for likeVideo //
export const saveVideo = async (userId, videoId) => {
  try {
    // Check if the user already liked this post
    const existingLike = await databases.listDocuments(
      config.databaseId,
      config.likedVideoCollectionId,
      [Query.equal("userId", userId), Query.equal("videoId", videoId)]
    );

    if (existingLike.documents.length > 0) {
      // If the user already liked the post, remove the like
      const likeId = existingLike.documents[0].$id;

      // Delete the like document
      await databases.deleteDocument(
        config.databaseId,
        config.likedVideoCollectionId,
        likeId
      );
      console.log("Like removed successfully");

      return { status: "unliked" };
    } else {
      const response = await databases.createDocument(
        config.databaseId,
        config.likedVideoCollectionId,
        ID.unique(),
        {
          userId: userId, // Plain attribute for querying
          videoId: videoId, // Plain attribute for querying
        }
      );
      console.log("Video liked successfully");
      return { status: "liked", response };
    }
  } catch (error) {
    console.error("Error liking video:", error);
    throw new Error("Failed to toggle like");
  }
};

//function for likePost //
export const savePost = async (userId, postId) => {
  try {
    // Check if the user already liked this post
    const existingLike = await databases.listDocuments(
      config.databaseId,
      config.likedPostCollectionId,
      [Query.equal("userId", userId), Query.equal("postId", postId)]
    );

    if (existingLike.documents.length > 0) {
      // If the user already liked the post, remove the like
      const likeId = existingLike.documents[0].$id;

      // Delete the like document
      await databases.deleteDocument(
        config.databaseId,
        config.likedPostCollectionId,
        likeId
      );
      console.log("Like removed successfully");

      return { status: "unliked" };
    } else {
      const response = await databases.createDocument(
        config.databaseId,
        config.likedPostCollectionId,
        ID.unique(),
        {
          userId: userId, // Reference to the User collection
          postId: postId, // Reference to the Post collection
        }
      );
      console.log("Post liked successfully");
      return { status: "liked", response };
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error("Failed to toggle like");
  }
};

//function for liked videos //
export const getUserSavedVideos = async (userId) => {
  try {
    // Fetch liked video IDs using plain text attributes
    const likesResponse = await databases.listDocuments(
      config.databaseId,
      config.likedVideoCollectionId,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    // Extract video IDs from the likes
    const likedVideoIds = likesResponse.documents.map(
      (like) => like.videoId["$id"]
    );

    if (!likedVideoIds || likedVideoIds.length === 0) {
      console.log("No liked videos found for this user.");
      return [];
    }
    // Fetch video details using the video IDs
    const videosResponse = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("$id", likedVideoIds)] // Query for videos by their IDs
    );

    return videosResponse.documents || [];
  } catch (error) {
    console.error("Error fetching user liked videos", error.message);
    return [];
  }
};

//function for liked posts //
export const getUserSavedPosts = async (userId) => {
  try {
    // Fetch liked post references (userId -> postId relation)
    const likesResponse = await databases.listDocuments(
      config.databaseId,
      config.likedPostCollectionId,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    // Extract post IDs from the liked posts
    const likedPostIds = likesResponse.documents.map(
      (like) => like.postId["$id"]
    );

    if (!likedPostIds.length) {
      console.log("No liked post found for this user.");
      return [];
    }

    // Fetch post details using the post IDs
    const postsResponse = await databases.listDocuments(
      config.databaseId,
      config.postCollectionId,
      [Query.equal("$id", likedPostIds)] // Query for posts by their IDs
    );

    return postsResponse.documents || [];
  } catch (error) {
    console.error("Error fetching user liked posts", error.message);
    return [];
  }
};

//function for uploadFile //
export const uploadFile = async (file, type) => {
  if (!file) {
    console.error("No file provided for upload.");
    throw new Error("File not provided.");
  }
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    if (!uploadedFile || !uploadedFile.$id) {
      throw new Error("File upload failed: No file ID returned.");
    }

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed. Please try again.");
  }
};

//function for getFilePreview //
export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type ");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

//function for createVideo  //
export const createVideo = async (form) => {
  try {
    //we can upload video and thumbnail at the same time bu using Promise.all
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newVideo = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        creator: form.userId,
        content: form.content,
      }
    );
    return newVideo;
  } catch (error) {
    throw new Error(error);
  }
};

//function for create post  //
export const createPost = async (form) => {
  try {
    //const thumbnailUrl = await uploadFile(form.thumbnail, "image");

    let thumbnailUrl = null;
    if (form.thumbnail) {
      thumbnailUrl = await uploadFile(form.thumbnail, "image");
    }
    const newPost = await databases.createDocument(
      config.databaseId,
      config.postCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        creator: form.userId,
        content: form.content,
      }
    );
    return newPost;
  } catch (error) {
    console.error("Error in createPost:", error);
    throw new Error(error.message || "Failed to create post");
  }
};

//function for editUserVideo  //
export const editUserVideo = async (videoId, form) => {
  try {
    const updatedVideo = await databases.updateDocument(
      config.databaseId,
      config.videoCollectionId,
      videoId,
      {
        title: form.title,
        content: form.content,
      }
    );
    return updatedVideo;
  } catch (error) {
    throw new Error(error.message || "Failed to edit video");
  }
};

//function for editUserPost  //
export const editUserPost = async (postId, form) => {
  try {
    const updatedPost = await databases.updateDocument(
      config.databaseId,
      config.postCollectionId,
      postId,
      {
        title: form.title,
        content: form.content,
      }
    );
    return updatedPost;
  } catch (error) {
    throw new Error(error.message || "Failed to edit post");
  }
};

//function for logout //
export const logout = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};
