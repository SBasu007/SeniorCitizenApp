import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ParameterChart({ parameterName, userId }) {
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {
    try {
      const response = await fetch(`https://seniorcitizenapp.onrender.com/records/parameter-data/${userId}/${parameterName}`);
      const result = await response.json();

      const labels = result.map((entry) => entry.recorded_date.slice(5)); // e.g. "08-01"
      const values = result.map((entry) => parseFloat(entry.value));

      setChartData({ labels, values });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [parameterName]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        {parameterName} Trend
      </Text>
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [{ data: chartData.values }]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
        style={{
          borderRadius: 16,
          marginVertical: 8,
          marginHorizontal: 20
        }}
      />
    </View>
  );
}
