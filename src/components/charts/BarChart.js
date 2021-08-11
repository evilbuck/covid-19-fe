import React, { memo, useEffect, useRef } from 'react';
import nv from 'nvd3';
// import * as d3 from 'd3';

export default function BarChart({ data }) {
  console.log('BarChart', data);
  const d3Container = useRef(null);

  useEffect(() => {
    nv.addGraph(function () {
      let chart = nv.models
        .multiBarHorizontalChart()
        .x((d) => d.state)
        .y((d) => d.deaths)
        .showValues(true)
        .tooltip(true);

      // d3.select(d3Container.current).datum(data).call(chart);
    });
  }, [data, d3Container.current]);

  return (
    <div>
      <h2>Chart</h2>

      <svg className="d3-component" width={400} height={200} ref={d3Container} />
    </div>
  );
}
