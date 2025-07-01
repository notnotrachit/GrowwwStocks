import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TimeSeriesData } from '../../types';
import { COLORS, DIMENSIONS } from '../../constants';

interface StockChartProps {
  data: TimeSeriesData;
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  const screenWidth = Dimensions.get('window').width;
  
  const processChartData = () => {
    const entries = Object.entries(data)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-15);     
    if (entries.length === 0) return null;
    
    const labels = entries.map(([date], index) => {
      const d = new Date(date);
      return index % 3 === 0 ? `${d.getMonth() + 1}/${d.getDate()}` : '';
    });
    
    const prices = entries.map(([, values]) => parseFloat(values['4. close']));
    
    return {
      labels,
      datasets: [{
        data: prices,
        strokeWidth: 2,
      }],
      firstPrice: prices[0],
      lastPrice: prices[prices.length - 1],
    };
  };

  const chartData = processChartData();
  
  if (!chartData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No chart data available</Text>
      </View>
    );
  }

  // Calculate price change for color
  const isPositive = chartData.lastPrice >= chartData.firstPrice;
  const lineColor = isPositive ? COLORS.positive : COLORS.negative;
  const changePercent = ((chartData.lastPrice - chartData.firstPrice) / chartData.firstPrice * 100).toFixed(2);

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => lineColor,
    labelColor: (opacity = 1) => COLORS.textSecondary,
    style: {
      borderRadius: 0,
    },
    propsForDots: {
      r: '1',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: COLORS.border,
      strokeWidth: 0.5,
      strokeOpacity: 0.3,
    },
    fillShadowGradient: lineColor,
    fillShadowGradientOpacity: 0.2,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{symbol} Price Chart (15 Days)</Text>
        <Text style={[styles.priceChange, { color: lineColor }]}>
          {isPositive ? '+' : ''}{changePercent}%
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 48}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withShadow={false}
          withDots={false}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero={false}
          segments={4} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    marginVertical: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderRadius: DIMENSIONS.borderRadius,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 0,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
    paddingVertical: 40,
  },
});

export default StockChart;