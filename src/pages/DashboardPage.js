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
        </div>
      </Formik>
      <div>
        <h3>Deaths by state</h3>
        {chartData && <BarChart data={chartData} date={moment(date).toDate()} />}
      </div>
    </div>
  );
}
