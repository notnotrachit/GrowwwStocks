import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TimeSeriesData } from '../../types';
import { COLORS } from '../../constants';

interface StockChartProps {
  data: TimeSeriesData;
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  const screenWidth = Dimensions.get('window').width;
  
  // Process data for chart
  const processChartData = () => {
    const entries = Object.entries(data)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-30); // Last 30 days
    
    const labels = entries.map(([date]) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    
    const prices = entries.map(([, values]) => parseFloat(values['4. close']));
    
    return {
      labels,
      datasets: [
        {
          data: prices,
          color: (opacity = 1) => COLORS.primary,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => COLORS.primary,
    labelColor: (opacity = 1) => COLORS.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '1',
      stroke: COLORS.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: COLORS.border,
      strokeWidth: 1,
    },
  };

  const chartData = processChartData();

  if (chartData.datasets[0].data.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={true}
        withHorizontalLines={true}
        fromZero={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default StockChart;