import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { recordStyles } from '../../styles/record.style';
import { useLocalSearchParams } from 'expo-router';

interface Parameter {
  name: string;
  color: string;
}

export default function Analytics() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useLocalSearchParams();

  const fetchParameters = async () => {
    try {
      const response = await fetch(`https://seniorcitizenapp.onrender.com/records/parameters/${userId}`); 
      const data = await response.json();
      setParameters(data);
    } catch (error) {
      console.error('Failed to fetch parameters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  return (
    <View style={recordStyles.container}>
      <Text style={styles.title}>Select a health parameter:</Text>

      <View style={styles.scrollWrapper}>
        {loading ? (
          <ActivityIndicator size="small" color="#999" />
        ) : (
          <ScrollView
            contentContainerStyle={styles.paramContainer}
            showsVerticalScrollIndicator={true}
          >
            {parameters.map((param, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.paramButton, { backgroundColor: '#c52727' }]}
              >
                <Text style={styles.paramText}>{param.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View>
        <Text>Graph</Text>
      </View>

      <View>
        <Text>Individual records</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 10
  },
  scrollWrapper: {
    maxHeight: 115,
    marginHorizontal: 10
  },
  paramContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 20
  },
  paramButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10
  },
  paramText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});