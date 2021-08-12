import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';

// Components
import BarChart from 'components/charts/BarChart';
import moment from 'moment';

const client = axios.create({ baseURL: 'http://localhost:4000' });

export default function DashboardPage() {
  const [chartData, setChartData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [metric, setMetric] = useState('death');

  useEffect(() => {
    (async () => {
      let { data } = await client.get('/dashboard', { params: { type: 'default' } });

      setChartData(data.data);
    })();
  }, []);
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <Formik>
        <div>
          <input
            type="date"
            onChange={({ target: { value } }) => {
              setDate(value);
            }}
            value={moment(date).format('YYYY-MM-DD')}
          />
          <div>
            <div style={{ display: 'inline-block' }}>
              <label>Death</label>
              <input
                id="death-metric"
                type="radio"
                name="metric"
                value="death"
                onChange={({ target: { value } }) => {
                  setMetric(value);
                }}
                checked={metric === 'death'}
              />
            </div>
            <div style={{ display: 'inline-block' }}>
              <label>Case</label>
              <input
                id="case-metric"
                type="radio"
                name="metric"
                value="case"
                onChange={({ target: { value } }) => {
                  setMetric(value);
                }}
                checked={metric === 'case'}
              />
            </div>
          </div>
        </div>
      </Formik>
      <div>
        <h3>{metric}% by state</h3>
        {chartData && <BarChart data={chartData} date={moment(date).toDate()} metric={metric} />}
      </div>
    </div>
  );
}
