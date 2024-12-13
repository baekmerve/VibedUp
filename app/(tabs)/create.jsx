import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo, createPost } from "../../lib/appwrite"; // Import function for creating posts
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [formType, setFormType] = useState("video"); // Track the selected form type ("video" or "post")
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    content: "", // Add content field for posts
  });

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const handleSubmit = async () => {
    console.log("Form Data:", form);
    console.log("Form Type:", formType);
    if (
      !form.title ||
      (formType === "video" && (!form.video || !form.thumbnail)) ||
      (formType === "post" && !form.content)
    ) {
      return Alert.alert("Please fill in all the required fields");
    }
    setUploading(true);

    try {
      if (formType === "video") {
        await createVideo({ ...form, userId: user.$id });
      } else if (formType === "post") {
        await createPost({ ...form, userId: user.$id });
      }

      Alert.alert("Success", "Content uploaded successfully!");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        content: "",
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-paper">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-brown font-psemibold">
          Create {formType === "video" ? "Video" : "Post"}
        </Text>
        {/* Toggle between Video and Post */}
        <View className="flex-row space-x-4 mt-6 ">
          <TouchableOpacity
            onPress={() => setFormType("video")}
            className={`px-4 py-2 h-10 w-20 justify-center items-center rounded-lg ${
              formType === "video" ? "bg-secondary" : "bg-brown"
            }`}
          >
            <Text className="font-psemibold text-white">Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFormType("post")}
            className={`px-4 py-2 h-10 w-20 justify-center items-center  rounded-lg ${
              formType === "post" ? "bg-secondary" : "bg-brown"
            }`}
          >
            <Text className="font-psemibold text-white">Post</Text>
          </TouchableOpacity>
        </View>

        {/* Common Fields */}
        <FormField
          title="Title"
          value={form.title}
          placeholder="Enter a title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        {/* Video Form */}
        {formType === "video" && (
          <>
            <View className="mt-7 space-y-2">
              <Text className="text-base text-brown font-pmedium">
                Upload Video
              </Text>
              <TouchableOpacity onPress={() => openPicker("video")}>
                {form.video ? (
                  <Video
                    source={{ uri: form.video.uri }}
                    className="w-full h-64 rounded-2xl"
                    resizeMode={ResizeMode.COVER}
                  />
                ) : (
                  <View className="w-full h-28 px-4 bg-[#DCDCDB] rounded-2xl justify-center items-center ">
                    <View className="items-center space-x-2">
                      <Image
                        source={icons.upload}
                        resizeMode="contain"
                        className="w-7 h-7"
                      />
                      <Text className="text-sm text-brown font-pmedium">
                        Choose a video
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className=" mt-7 space-y-2 ">
              <Text className="text-base text-brown font-pmedium">
                Thumbnail Image
              </Text>
              <TouchableOpacity onPress={() => openPicker("image")}>
                {form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    className="w-full h-64 rounded-2xl"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-28 px-4 bg-[#DCDCDB] rounded-2xl justify-center items-center flex-row space-x-2">
                    <View className="items-center space-x-2">
                      <Image
                        source={icons.upload}
                        resizeMode="contain"
                        className="w-7 h-7"
                      />
                      <Text className="text-sm text-brown font-pmedium">
                        Choose an image
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <FormField
              title="Video Content"
              value={form.content}
              placeholder="Enter the content for this video"
              handleChangeText={(e) => setForm({ ...form, content: e })}
              otherStyles="mt-7 "
            />
          </>
        )}

        {/* Post Form */}
        {formType === "post" && (
          <View>
            <FormField
              title="Content"
              value={form.content}
              placeholder="Write your post content"
              handleChangeText={(e) => setForm({ ...form, content: e })}
              otherStyles="mt-10 mb-10"
              multiline
            />
          </View>
        )}

        <CustomButton
          title="Submit & Publish"
          handlePress={handleSubmit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
