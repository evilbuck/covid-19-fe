import React, { memo, useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import _ from 'lodash';
import moment from 'moment';

export default function BarChart({ data, demographics }) {
  console.log('BarChart', data);
  const chartContainer = useRef(null);

  useEffect(() => {
    if (_.isEmpty(demographics)) return;
    // filter out the date range we want
    // TODO: make date range dynamic
    let selectedDay = moment().subtract(7, 'days');
    // let stats = data.filter((d) => moment(d.date).isAfter(moment().subtract('days', 15)));
    let stats = data.filter((d) => d.state && moment(d.date).isSame(selectedDay, 'day'));
    let states = stats.sort((a, b) => {
      try {
        let a_population = demographics.find((demo) => demo.state === a.state)?.population;
        let b_population = demographics.find((demo) => demo.state === b.state)?.population;
        let a_death_ratio = parseFloat(+a.deaths / +a_population);
        let b_death_ratio = parseFloat(+b.deaths / +b_population);
        let a_per_thousand = (a_death_ratio * a_population) / 100;
        console.log('a per 1000', a_per_thousand);
        console.log('a', a_population, a_death_ratio, a.deaths, a.state, '\n', demographics);
        console.log(`${+b.deaths} / ${+b_population} * 100 = ${b_death_ratio}`);

        return b_death_ratio - a_death_ratio;
      } catch (error) {
        console.error(error, a.state, b.state);
      }
    });

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
            let population = parseFloat(demographics.find((demo) => demo.state === d.state).population);
            return Math.round((+d.deaths / population) * 100);
          }),
        },
      ],
    });
  }, [data, chartContainer.current, demographics]);

  return (
    <div>
      <h2>Chart</h2>

      <div id="counts-chart" style={{ width: '500px', height: '750px' }} ref={chartContainer}></div>
    </div>
  );
}
