import React, { useState, useEffect } from 'react';
import {
  DataItem,
  FORMAT,
  getChartData,
  hoursDecimalFromSeconds,
  readableHoursFromDecimal,
} from './utils';
import moment from 'moment';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const ScreenTime = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [currentTimeFrame, setCurrentTimeFrame] = useState(
    moment().format(FORMAT)
  );
  const [selectedDate, setSelectedDate] = useState(moment().format(FORMAT));
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getChartData(currentTimeFrame);
    setData(data);
  };

  const handleBarClick = (data: any) => {
    setSelectedDate(data.name);
  };

  const getSelectedDate = () => {
    console.log(selectedDate);
    for (let i = 0; i < data.length; i++) {
      const day = data[i];
      if (day.name === selectedDate) return day;
    }
  };

  return (
    <div className="screen-time">
      <h2>Screen Time</h2>
      {data.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer height="100%" width="80%">
            <BarChart
              width={1000}
              height={500}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis unit="h" allowDecimals={false} />
              <Tooltip
                formatter={(value: any) => readableHoursFromDecimal(value)}
              />
              <Legend />
              <Bar dataKey="Time" onClick={handleBarClick} fill="#3E2ABE">
                {data.map((entry, index) => (
                  <Cell
                    cursor="pointer"
                    radius="2"
                    fill={entry.name === selectedDate ? '#3E2ABE' : '#8884d8'}
                    key={`cell-${index}`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="sites">
            <h1>{readableHoursFromDecimal(getSelectedDate()!.Time)}</h1>

            <List>
              {getSelectedDate()!.sites.map((site) => {
                return (
                  <ListItem button alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={site.name} src={site.favIcon} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={site.name}
                      secondary={readableHoursFromDecimal(
                        parseFloat(hoursDecimalFromSeconds(site.time))
                      )}
                    />
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenTime;
