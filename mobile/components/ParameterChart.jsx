import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ParameterChart({ parameterName, userId }) {
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `https://seniorcitizenapp.onrender.com/records/parameter-data/${userId}/${parameterName}`
      );
      const result = await response.json();

      // Format date labels to only show DD-MM
      const labels = result.map((entry) =>
        new Date(entry.created_at).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
        })
      );

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

  // Determine chart width based on number of data points
  const chartWidth = Math.max(screenWidth, chartData.labels.length * 80);

  return (
    <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 12, margin: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>
        {parameterName} Trend
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: chartData.values }]
          }}
          width={chartWidth}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(66, 135, 245, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#42a5f5',
            },
            propsForBackgroundLines: {
              stroke: '#e3e3e3',
            },
          }}
          bezier
          style={{
            borderRadius: 16,
            marginVertical: 8,
          }}
        />
      </ScrollView>
    </View>
  );
}