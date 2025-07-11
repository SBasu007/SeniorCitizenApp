import { Tabs } from "expo-router";
import { styles } from "../styles/layout.styles.js";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarStyle: styles.tabBar
        }

        }>
            <Tabs.Screen name="index" options={{ title: 'Sarthi AI', headerTitle: 'Sarthi AI' }} />
            <Tabs.Screen name="family" options={{ title: 'Family', headerTitle: 'Find Family' }} />
            <Tabs.Screen name="service" options={{ title: 'Service', headerTitle: 'Book Service' }} />
        </Tabs>
    )
}