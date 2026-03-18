import { icons } from "@/constants/icons";
import { Image, TextInput, TouchableOpacity } from "react-native";

// ADDED: Props interface — tells TypeScript what props this component accepts
interface Props {
  onPress?: () => void; // function that runs when bar is tapped
  placeholder?: string; // text shown before user types
  value: string;
  onChangeText: (text: string) => void;
}

// CHANGED: empty () to ({ onPress, placeholder }) — now receives props from parent
const SearchBar = ({ onPress, placeholder, value, onChangeText }: Props) => {
  return (
    // CHANGED: View → TouchableOpacity so the whole bar is tappable
    // ADDED: onPress prop passed down to TouchableOpacity
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-dark-200 rounded-full px-5 py-4"
    >
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor={"#ab8bff"}
      />
      <TextInput
        // REMOVED: onPress={() => {}} — TextInput doesn't have an onPress, that lives on TouchableOpacity now
        // CHANGED: hardcoded "Search" → placeholder prop so parent can control this text
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#a8b5db"
        className="flex-1 ml-2 text-white"
      />
    </TouchableOpacity>
  );
};

export default SearchBar;
