import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/layout.styles.js';
import { Pressable, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
export default function TabLayout() {
    const router = useRouter();
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarStyle: styles.tabBar,
                tabBarButton: (props) => (
                    <Pressable
                        {...props}
                        android_ripple={null} // disables black ripple effect
                    />
                ),
                tabBarShowLabel: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let IconComponent;

                    if (route.name === 'index') {
                        IconComponent = MaterialIcons;
                        iconName = 'assignment'; // report icon
                    } else if (route.name === 'family') {
                        IconComponent = FontAwesome5;
                        iconName = 'users';
                    } else if (route.name === 'service') {
                        IconComponent = FontAwesome5;
                        iconName = 'concierge-bell'; // service icon
                    }

                    return (
                        <View
                            style={{
                                paddingVertical: 0,
                                paddingHorizontal: 0,
                                borderRadius: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <IconComponent
                                name={iconName}
                                size={20}
                                color={focused ? 'red' : 'black'}
                            />
                            <Text style={{ color: focused ? 'red' : 'black', fontSize: 12 }}>
                                {route.name === 'index' ? 'Report' : route.name.charAt(0).toUpperCase() + route.name.slice(1)}
                            </Text>
                        </View>
                    );
                },
                headerRight: () => (
                    <Pressable
                        onPress={() => router.push('/profile')} // Navigate to profile page
                        style={{ marginRight: 15 }}
                    >
                        <Ionicons name="person-circle-outline" size={30} color="black" />
                    </Pressable>
                ),
            })}
        >
            <Tabs.Screen name="index" options={{ headerTitle: 'Sarthi AI' , headerStyle: { backgroundColor: "#FCF3F2"}}} />
            <Tabs.Screen name="family" options={{ headerTitle: 'Find Family', headerStyle: { backgroundColor: "#FCF3F2"} }} />
            <Tabs.Screen name="service" options={{ headerTitle: 'Book Service', headerStyle: { backgroundColor: "#FCF3F2"} }} />
        </Tabs>
    );
}