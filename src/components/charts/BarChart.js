import React, { memo, useEffect, useLayoutEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import _ from 'lodash';
import moment from 'moment-timezone';
import * as math from 'mathjs';

function weekOfCompare(dateInWeek, date) {
  let startOfWeek = moment(dateInWeek).startOf('week').toDate();
  let endOfWeek = moment(dateInWeek).endOf('week').toDate();

  return moment(date).isBetween(startOfWeek, endOfWeek);
}

function dataMunger(d) {
  let { population, deaths, cases } = d;

  let death_ratio = math.divide(deaths, population);
  let case_ratio = math.divide(cases, population);

  return { ...d, population: +population, cases, deaths, death_ratio, case_ratio };
}

function deathMapper(d) {
  return d.death_ratio;
}
function caseMapper(d) {
  return d.case_ratio;
}

function caseSorter(a, b) {
  return math.compare(b.case_ratio, a.case_ratio);
}
function deathSorter(a, b) {
  return math.compare(b.death_ratio, a.death_ratio);
}

function BarChart({ data, date, metric }) {
  const chartContainer = useRef(null);

  let mapper, sorter;
  switch (metric) {
    case 'death':
      mapper = deathMapper;
      sorter = deathSorter;
      break;
    case 'case':
      mapper = caseMapper;
      sorter = caseSorter;
      break;
    default:
      throw new Error('no metric provided');
  }

  useLayoutEffect(() => {
    // filter out the date range we want
    // TODO: make date range dynamic
    let selectedDay = date ?? moment().subtract(7, 'days');
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
          index.deaths = parseInt(index.deaths) + parseInt(d.deaths);
          index.cases = parseInt(index.cases) + parseInt(d.cases);
          index.population = parseInt(index.population) + parseInt(d.population);
        }

        return memo;
      }, [])
      .map(dataMunger)
      .sort(sorter);
    // .sort((a, b) => math.compare(b.death_ratio, a.death_ratio));

    // get the top ten states by death
    let chart = Highcharts.chart(chartContainer.current, {
      chart: { type: 'bar' },
      title: { text: `most ${metric} by state` },
      xAxis: { categories: states.map((d) => d.state) },
      yAxis: { title: 'death % of population' },
      series: [
        {
          name: `${metric} % of population`,
          data: states.map(mapper),
        },
      ],
    });
  }, [data, chartContainer.current, date, metric]);

  return (
    <div>
      <h2>Chart</h2>

      <div id="counts-chart" style={{ width: '500px', height: '950px' }} ref={chartContainer}></div>
    </div>
  );
}

// export default memo(BarChart, () => true);
export default BarChart;
