import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileLayout() {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerTitle: 'Your Profile',
                headerTitleStyle: { fontSize: 20 },
                headerLeft: () => (
                    <Pressable
                        onPress={() => router.back()} // Navigate back to previous screen
                    // style={{ marginLeft: 15 }}
                    >
                        <Ionicons name="arrow-back" size={20} color="black" />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
                headerTitleContainerStyle: { paddingLeft: 20 },
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
}