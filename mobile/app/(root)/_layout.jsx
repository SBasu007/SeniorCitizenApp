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
                        iconName = 'timer'; // report icon
                    }else if (route.name === 'record') {
                        IconComponent = FontAwesome5;
                        iconName = 'file'; // service icon
                    }
                    else if (route.name === 'family') {
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
                                paddingBottom: 10
                            }}
                        >
                            <IconComponent
                                name={iconName}
                                size={20}
                                color={focused ? 'red' : 'black'}
                            />
                            <Text style={{ color: focused ? 'red' : 'black', fontSize: 12 }}>
                                {route.name === 'index' ? 'Timer' : route.name.charAt(0).toUpperCase() + route.name.slice(1)}
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
            <Tabs.Screen name="index" options={{ headerTitle: 'Medicine Timer', headerStyle: { backgroundColor: "#FCF3F2" }, headerShadowVisible: false }} />
            <Tabs.Screen name="record" options={{ headerTitle: 'Records', headerStyle: { backgroundColor: "#FCF3F2" }, headerShadowVisible: false }} />
            <Tabs.Screen name="family" options={{ headerTitle: 'Family', headerStyle: { backgroundColor: "#FCF3F2" }, headerShadowVisible: false }} />
            <Tabs.Screen name="service" options={{ headerTitle: 'Book Service', headerStyle: { backgroundColor: "#FCF3F2" }, headerShadowVisible: false }} />
        </Tabs>
    );
}