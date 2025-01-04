import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";

const EditModal = ({
  contentId,
  visible,
  onClose,
  initialData,
  type,
  handleUpdate,
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);

  // Synchronize state with initialData when it changes
  useEffect(() => {
    setTitle(initialData.title);
    setContent(initialData.content);
  }, [initialData]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableOpacity
        className="flex-1 justify-center items-center"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="bg-white border border-gray-400 p-6 rounded-2xl shadow-2xl w-4/5 max-w-lg ">
          <Text className=" text-brown text-lg font-semibold mb-4 text-center">
            Edit {type}
          </Text>

          <TextInput
            className=" text-brown border border-gray-400 rounded-lg p-3 mb-4 text-sm "
            value={title}
            onChangeText={setTitle}
            placeholder="Edit Title"
            placeholderTextColor="#888"
            multiline={true}
          />
          <TextInput
            className="text-brown border border-gray-400 rounded-lg p-3 mb-4 h-44 text-sm"
            value={content}
            onChangeText={setContent}
            placeholder="Edit Content"
            placeholderTextColor="#888"
            multiline={true}
          />

          <View className="flex-row justify-evenly mt-2">
            <TouchableOpacity
              className="bg-gray-300 p-3 rounded-lg w-1/3 mr-2"
              onPress={onClose}
            >
              <Text className="text-center text-sm text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blueGreen p-3 rounded-lg w-1/3"
              onPress={() => handleUpdate(contentId, { title, content }, type)}
            >
              <Text className="text-center text-sm text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default EditModal;
