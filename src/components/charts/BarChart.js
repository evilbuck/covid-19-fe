import React, { memo, useEffect, useLayoutEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import _ from 'lodash';
import moment from 'moment';

var counter = 0;

function count() {
  return counter++;
}

function BarChart({ data, date }) {
  const chartContainer = useRef(null);
  console.log('BarChart render');

  useLayoutEffect(() => {
    // filter out the date range we want
    // TODO: make date range dynamic
    console.log('useLayoutEffect', date);
    let selectedDay = date ?? moment().subtract(7, 'days');
    // let stats = data.filter((d) => moment(d.date).isAfter(moment().subtract('days', 15)));
    let stats = data.filter((d) => d.state && moment(d.date).isSame(selectedDay, 'day'));
    let states = stats
      .map((d) => {
        let { population, deaths, cases } = d;
        population = +population;
        deaths = +deaths;
        cases = +cases;
        let death_ratio = deaths / population;
        let case_ratio = cases / population;

        return { ...d, population: +population, cases, deaths, death_ratio, case_ratio };
      })
      .sort((a, b) => b.death_ratio - a.death_ratio);

    // get the top ten states by death
    let chart = Highcharts.chart(chartContainer.current, {
      chart: { type: 'bar' },
      title: { text: 'most deaths by state' },
      xAxis: { categories: states.map((d) => d.state) },
      yAxis: { title: 'death % of population' },
      series: [
        {
          name: 'death % of population',
          data: states.map((d) => {
            return d.death_ratio;
          }),
        },
      ],
    });
  }, [data, chartContainer.current, date]);

  return (
    <div>
      <h2>Chart</h2>

      <div id="counts-chart" style={{ width: '500px', height: '950px' }} ref={chartContainer}></div>
    </div>
  );
}

// export default memo(BarChart, () => true);
export default BarChart;
