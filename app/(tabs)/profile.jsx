import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import VideoCard from "../components/VideoCard";
import PostCard from "../components/PostCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../components/InfoBox";
import EditModal from "../components/EditModal";
import { router } from "expo-router";

const Profile = () => {
  const {
    user,
    deleteContent,
    userLogout,
    refreshing,
    updateContent,
    fetchUserContents,
    userContents,
    setUserContents,
  } = useGlobalContext();

  console.log("Profile is being rendered");

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditPress = (item) => {
    setSelectedItem({
      id: item.$id,
      type: item.type,
      title: item.title,
      content: item.content,
    });
    setModalVisible(true);
  };

  useEffect(() => {
    if (!user) return; // Exit if no user
    const fetchData = async () => {
      try {
        const response = await fetchUserContents(user.$id);
        if (response?.length > 0) {
          setUserContents(response);
        } else {
          console.warn("No user content found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user content.");
      }
    };

    fetchData(); // Call the async function
  }, []);

  const onRefresh = async () => {
    try {
      await fetchUserContents(user.$id); // Refresh only user content
    } catch (error) {
      console.error("Error refreshing user content:", error);
    }
  };

  // Function to handle edit
  const handleUpdate = async (
    contentId,
    { title, content },
    type,
    setUserContents
  ) => {
    try {
      await updateContent(contentId, { title, content }, type, setUserContents);

      setModalVisible(false);
       alert(`${type} updated successfully`);
    } catch (error) {
      alert(`Error updating content: ${error.message}`);
    }
  };

  // Function to handle deletion
  const handleDelete = async (contentId, type) => {
    await deleteContent(
      contentId,
      type,
      setUserContents // Pass the state updater function
    );
  };

  const handleLogout = async () => {
    await userLogout();
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-[#f2ede8] h-full">
      <FlatList
        data={userContents}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          if (item.type === "post") {
            return (
              <PostCard
                createdAt={item.$createdAt}
                title={item.title}
                content={item.content}
                creatorName={item.creator.username}
                coverImage={item.thumbnail}
                avatar={item.creator.avatar}
                onDelete={() => handleDelete(item.$id, "post")}
                onEdit={() => handleEditPress(item)}
                isCreator={item.creator.$id === user?.$id}
                showSaveButton={false}
                showSettingsButton={true}
              />
            );
          }
          if (item.type === "video") {
            return (
              <VideoCard
                createdAt={item.$createdAt}
                title={item.title}
                content={item.content}
                thumbnail={item.thumbnail}
                video={item.video}
                creatorName={item.creator.username}
                avatar={item.creator.avatar}
                onDelete={() => handleDelete(item.$id, "video")}
                onEdit={() => handleEditPress(item)}
                isCreator={item.creator.$id === user?.$id}
                showSaveButton={false}
                showSettingsButton={true}
              />
            );
          }
        }}
        ListHeaderComponent={() => (
          <View className="  w-full justify-center items-center   px-4 ">
            <TouchableOpacity
              className=" w-full items-end mb-5 "
              onPress={handleLogout}
            >
              <View className="flex-row font-bold justify-center items-center gap-2">
                <Text className="font-psemibold">Logout</Text>
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-7 h-7"
                />
              </View>
            </TouchableOpacity>
            <View className="mb-5 w-full bg-blueGreen rounded-2xl justify-center items-center ">
              <View className=" mt-3">
                {user?.avatar ? (
                  <Image
                    source={{ uri: user?.avatar }}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={icons.profile2}
                    className="w-32 h-32 mt-3 border-brown"
                    resizeMode="cover"
                  />
                )}

                <InfoBox
                  title={user?.username}
                  containerStyles="mt-3"
                  titleStyles="text-2xl "
                />
              </View>

              <View className="mb-4 flex-row justify-center items-center  align-middle ">
                <InfoBox
                  title={
                    userContents.filter((item) => item.type === "video")
                      .length || 0
                  }
                  subtitle="Videos"
                  containerStyles="mx-5"
                  titleStyles="text-xl "
                />
                <InfoBox
                  title={
                    userContents.filter((item) => item.type === "post")
                      .length || 0
                  }
                  subtitle="Posts"
                  containerStyles="mx-5"
                  titleStyles="text-xl "
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Content Found"
            subtitle="No content found for this user"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {selectedItem && (
        <EditModal
          contentId={selectedItem.id}
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          type={selectedItem.type}
          handleUpdate={handleUpdate}
          initialData={{
            title: selectedItem?.title || "",
            content: selectedItem?.content || "",
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
