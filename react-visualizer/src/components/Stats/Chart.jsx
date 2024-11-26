import { Chart } from "react-google-charts";
export default function MyChart({ data, type }) {
  const options = {
    title: "Chapter Membership Statistics",
    vAxis: { minValue: 0 },
    chartArea: { left: "10%", width: "66%", height: "80%" },
    height: "43vh",
    Width: "33vw",
    legend: { position: "right" },
  };
  return (
    <Chart
      // Try different chart types by changing this property with one of: LineChart, BarChart, AreaChart...
      chartType={type}
      data={data}
      options={options}
      legendToggle
    />
  );
}
