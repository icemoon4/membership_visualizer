import { Chart } from "react-google-charts";
export default function MyChart({ data, type }) {
  const options = {
    title: "Chapter Membership Statistics",
    allowHtml: true,
    vAxis: { minValue: 0 },
    chartArea: { left: "5%", width: "75%", height: "80%" },
    height: "55vh",
    width: "95%",
    legend: { position: "right" },
  };

  function transformData(originalData) {
    const metrics = originalData[0].slice(1); //(constitutional_members, active_monthly, etc... our counts)
    let fromDay = originalData[1];
    let toDay = originalData[originalData.length - 1];
    let newData = [fromDay, toDay];
    const dates = [fromDay[0], toDay[0]]; //we're comparing change between these two dates, ergo..

    //initialize transformed array w headers
    const transformed = [["Metric", ...dates, "% Change"]];

    //populate the metrics and corresponding data
    metrics.forEach((metric, index) => {
      const values = newData.map((dataRow) => dataRow[index + 1]);
      //calculate percentage change
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      const percentageChange =
        firstValue !== 0
          ? ((lastValue - firstValue) / Math.abs(firstValue)) * 100
          : 0;
      //google will not allow for both arrow and number formatters so we have to dollar store it
      const arrow =
        percentageChange > 0 ? "⬆️" : percentageChange < 0 ? "⬇️" : "—";

      const percColor =
        percentageChange < 0 ? "red" : percentageChange > 0 ? "green" : "black";

      const formattedChange = `${arrow} <span style="color:${percColor};">${percentageChange.toFixed(
        2
      )}%</span>`;

      //construct row with % change included
      const row = [metric, ...values, formattedChange];
      transformed.push(row);
    });

    return transformed;
  }

  if (
    !data ||
    !Array.isArray(data) ||
    data.length === 0 ||
    data[0].length === 0
  ) {
    return <p>Loading chart data...</p>;
  }
  return (
    <Chart
      chartType={type}
      data={type === "Table" ? transformData(data) : data}
      options={options}
      legendToggle
    />
  );
}
