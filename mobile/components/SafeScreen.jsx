import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex:1, backgroundColor: "#FCF3F2"}}>
            {children}
        </View>
    )
};

export default SafeScreen;