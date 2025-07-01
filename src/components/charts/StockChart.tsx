import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { TimeSeriesData } from "../../types";
import { DIMENSIONS } from "../../constants";
import useTheme from "../../hooks/useTheme";

interface StockChartProps {
  data: TimeSeriesData;
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const styles = createStyles(colors);

  const processChartData = () => {
    const entries = Object.entries(data)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-15);
    if (entries.length === 0) return null;
    const labels = entries.map(([date], index) => {
      const d = new Date(date);
      return index % 3 === 0 ? `${d.getMonth() + 1}/${d.getDate()}` : "";
    });

    const prices = entries.map(([, values]) => parseFloat(values["4. close"]));

    return {
      labels,
      datasets: [
        {
          data: prices,
          strokeWidth: 2,
        },
      ],
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
  const lineColor = isPositive ? colors.positive : colors.negative;
  const changePercent = (
    ((chartData.lastPrice - chartData.firstPrice) / chartData.firstPrice) *
    100
  ).toFixed(2);

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => lineColor,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: 0,
    },
    propsForDots: {
      r: "1",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: colors.border,
      strokeWidth: 0.5,
      strokeOpacity: 0.3,
    },
    fillShadowGradient: lineColor,
    fillShadowGradientOpacity: 0.2,
    useShadowColorFromDataset: false,
  };

  return (
    <View>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{symbol} Price Chart (15 Days)</Text>
        <Text style={[styles.priceChange, { color: lineColor }]}>
          {isPositive ? "+" : ""}
          {changePercent}%
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

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginVertical: 16,
      paddingTop: 16,
      paddingHorizontal: 16,
      borderRadius: DIMENSIONS.borderRadius,
      borderWidth: 0,
      elevation: 2,
    },
    chartHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    priceChange: {
      fontSize: 14,
      fontWeight: "bold",
    },
    chartContainer: {
      alignItems: "center",
      overflow: "hidden",
    },
    chart: {
      marginVertical: 8,
      borderRadius: 0,
    },
    noDataText: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 14,
      paddingVertical: 40,
    },
  });

export default StockChart;
