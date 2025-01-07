import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import { createAccount } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import * as ImagePicker from "expo-image-picker";

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        avatar: result.assets[0],
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.username || !form.password || !form.email) {
      Alert.alert("Error", "Please fill in all the fields");
    }

    // Simple Email Validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Password strength check 
    if (form.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await createAccount(
        form.email,
        form.password,
        form.username,
        form.avatar
      );

      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-paper h-full">
      {/* for smooth keyboard interaction. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View className="w-full h-full justify-center px-4 my-3">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[160px] h-[90px]"
            />
            <Text className="font-psemibold text-2xl text-brown  text-semibold ">
              Sign up to VibedUp!
            </Text>
            <TouchableOpacity
              onPress={() => openPicker("image")}
              className="mt-3 items-center"
            >
              {form.avatar ? (
                <Image
                  source={{ uri: form.avatar.uri }}
                  className="w-32 h-32 rounded-[50%]"
                  resizeMode="cover"
                />
              ) : (
                <View className=" justify-center items-center flex-row mt-1">
                  <View className="items-center">
                    <Image
                      source={icons.upload2}
                      resizeMode="contain"
                      className="w-14 h-14 "
                    />
                    <Text className="text-xs mt-2 text-brown font-pmedium">
                      upload a picture
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
            <FormField
              title="Username"
              placeholder="Enter a unique username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-5"
            />
            <FormField
              title="Email"
              placeholder="Enter your email address"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-5"
              keybordType="email-address"
            />
            <FormField
              title="Password"
              placeholder="Enter a password contains of 8 character"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-5"
            />

            <CustomButton
              title="Sign-In"
              handlePress={handleSubmit}
              containerStyles="mt-10"
              isLoading={isSubmitting}
            />
            <View className="flex-row justify-center pt-5 gap-2">
              <Text className="text-lg text-brown font-pregular">
                Already have an account?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-psemibold text-secondary"
              >
                Login
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
