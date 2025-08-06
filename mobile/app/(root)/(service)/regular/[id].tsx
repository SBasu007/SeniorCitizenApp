import React from "react";
import { useLocalSearchParams } from "expo-router";
import OnlineConsultation from "./online-consultation";
import { SafeAreaView,Text } from "react-native";
export default function RegularBookingPage(){
    const {id} = useLocalSearchParams();

    if(id == "online-consultation"){
        return <OnlineConsultation/>
    }


    return (
        <SafeAreaView>
          <Text>Service not found: {id}</Text>
        </SafeAreaView>
      );
}