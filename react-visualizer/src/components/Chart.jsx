import { Chart } from "react-google-charts";
export default function MyChart(props) {
  const options = {
    title: "Chapter Membership Statistics",
    vAxis: { minValue: 0 },
    chartArea: { width: "70%", height: "70%" },
  };
  return (
    <Chart
      // Try different chart types by changing this property with one of: LineChart, BarChart, AreaChart...
      chartType="AreaChart"
      data={props.data}
      options={options}
      legendToggle
    />
  );
}
