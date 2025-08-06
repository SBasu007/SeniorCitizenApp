import React from "react";
import { SafeAreaView,View,Text,Button } from "react-native";
import { router } from "expo-router";
export default function OnlineConsultation(){
    const handleBookDoctor = () => {
        // Use router.push to navigate to the specified path
        router.push('/(root)/(service)/regular/bookdoctor');
    };
    return(
        <SafeAreaView>
            <View>
                <Text>
                <Button 
                    title="Book a Doctor" // Text displayed on the button
                    onPress={handleBookDoctor} // Function to call when button is pressed
                    color="#DC2626" // Optional: Set a color for the button
                />
                </Text>
            </View>
        </SafeAreaView>
    )
}