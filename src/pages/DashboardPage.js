import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Components
import BarChart from 'components/charts/BarChart';

const client = axios.create({ baseURL: 'http://localhost:4000' });

export default function DashboardPage() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    (async () => {
      let { data } = await client.get('/dashboard', { params: { type: 'default' } });
      setChartData(data);
    })();
  }, []);
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div>
        <h3>Deaths by state</h3>
        {chartData && <BarChart data={chartData} />}
      </div>
    </div>
  );
}
