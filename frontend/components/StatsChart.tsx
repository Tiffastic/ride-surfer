import React from "react";
import {} from "react-native";

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis
} from "victory-native";

export default function StatsChart(props: {
  tickValuesXAxis: any;
  tickFormatXAxis: any;
  tickFormatYAxis: any;
  style: {};
  data: any;
  x: string;
  y: string;
}) {
  return (
    <VictoryChart
      // adding the material theme provided with Victory
      theme={VictoryTheme.material}
      // domainPadding will add space to each side of VictoryBar to
      // prevent it from overlapping the axis
      domainPadding={20}
    >
      <VictoryAxis
        // tickValues specifies both the number of ticks and where
        // they are placed on the axis
        tickValues={props.tickValuesXAxis}
        tickFormat={props.tickFormatXAxis}
      />
      <VictoryAxis
        dependentAxis
        // tickFormat specifies how ticks should be displayed
        tickFormat={props.tickFormatYAxis}
      />
      <VictoryBar
        style={props.style}
        data={props.data}
        x={props.x}
        y={props.y}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }
        }}
      />
    </VictoryChart>
  );
}
