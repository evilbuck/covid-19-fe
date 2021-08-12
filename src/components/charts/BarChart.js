import React, { memo, useEffect, useLayoutEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import _ from 'lodash';
import moment from 'moment-timezone';
import * as math from 'mathjs';

var counter = 0;

function count() {
  return counter++;
}

function weekOfCompare(dateInWeek, date) {
  let startOfWeek = moment(dateInWeek).startOf('week').toDate();
  let endOfWeek = moment(dateInWeek).endOf('week').toDate();

  // console.log('start', startOfWeek, 'end', endOfWeek)

  return moment(date).isBetween(startOfWeek, endOfWeek);
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
    // let stats = data.filter((d) => d.state && moment(d.date).isSame(selectedDay, 'day'));
    let stats = data.filter((d) => d.state && weekOfCompare(selectedDay, d.date));
    let states = stats
      .reduce((memo, d) => {
        let key = `${d.state}:${moment(d.date).startOf('month').format('YYYY-MM-DD')}`;

        let index = _.find(memo, { key });
        if (!index) {
          d.key = key;
          memo.push({
            ...d,
            deaths: parseInt(d.deaths),
            cases: parseInt(d.cases),
            population: math.isNumeric(d.population) ? parseInt(d.population) : 0,
          });
        } else {
          if (index.deaths === '100540-3' || index.population === '100540-3') {
            debugger;
          }
          index.deaths = parseInt(index.deaths) + parseInt(d.deaths);
          index.cases = parseInt(index.cases) + parseInt(d.cases);
          index.population = parseInt(index.population) + parseInt(d.population);
          if (index.deaths === '100540-3' || index.population === '100540-3') {
            debugger;
          }
        }

        return memo;
      }, [])
      .map((d) => {
        let { population, deaths, cases } = d;
        // population = +population;
        // deaths = +deaths;
        // cases = +cases;
        if (deaths === '100540-3' || population === '100540-3') {
          debugger;
        }

        let death_ratio = math.divide(deaths, population);
        let case_ratio = math.divide(cases, population);

        return { ...d, population: +population, cases, deaths, death_ratio, case_ratio };
      })
      .sort((a, b) => math.compare(b.death_ratio, a.death_ratio));
    // .sort((a, b) => b.death_ratio - a.death_ratio);

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
