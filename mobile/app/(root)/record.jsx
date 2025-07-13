import React from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { styles } from "../styles/record.styles.js";
import { FontAwesome5 } from '@expo/vector-icons';

export default function Records() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Basic Health Check Section */}
      <View style={styles.container}>
        <Image
          source={{ uri: "https://i.pinimg.com/736x/c3/2d/fb/c32dfb8f7fd878315dac2750f11f0780.jpg" }}
          style={styles.healthCheckImage}
        />
        <Text style={styles.title}>Your Monthly Health Test is Live 🚨 </Text>
        <Text style={styles.description}>Take a quick 5 min assesment test for your Health.
           We have your previous uploaded data
           Help AI by giving newly updated data during test It will help 
           us to generate proper Health report for you.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Health Test</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.nextboxdesign}>
        {/* Upload Area */}
        <View style={styles.uploadBox}>
          <TouchableOpacity>
            <Text style={styles.uploadText}>📤 Upload Your Lab Tests</Text>
          </TouchableOpacity>
        </View>

        {/* Uploaded Files Section */}
        <Text style={styles.sectionTitle}>Your Files</Text>
        <View style={styles.filesContainer}>
          <View style={styles.fileCard}>
            <FontAwesome5 name="file-pdf" size={30} color="#FF4C4C" />
            <Text style={styles.fileText}>Blood_Test.pdf</Text>
          </View>
          <View style={styles.fileCard}>
            <FontAwesome5 name="file-pdf" size={30} color="#FF4C4C" />
            <Text style={styles.fileText}>X-Ray_Report.pdf</Text>
          </View>
          <View style={styles.fileCard}>
            <FontAwesome5 name="file-pdf" size={30} color="#FF4C4C" />
            <Text style={styles.fileText}>MRI_Scan.pdf</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>AI Suggestions to stay Healthy ❤️</Text>
        <View style={styles.suggestionCardContainer}>
          <View style={styles.suggestionCardGreen}>
            <Text style={styles.suggestionText}>✔️ Maintain a diet of 2000 calories.</Text>
          </View>
          <View style={styles.suggestionCardRed}>
            <Text style={styles.suggestionText}>❌ Don't smoke.</Text>
          </View>
          <View style={styles.suggestionCardGreen}>
            <Text style={styles.suggestionText}>✔️ Maintain a diet of 2000 calories.</Text>
          </View>
          <View style={styles.suggestionCardRed}>
            <Text style={styles.suggestionText}>❌ Don't smoke.</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}
