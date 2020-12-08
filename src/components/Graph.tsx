import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { green, indigo, brown, purple, lightBlue, amber } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import { getMetrics, getSelectedItems } from '../Features/Metrics/selectors';
import { getAxisID, formatUnit } from '../utils';

const COLORS = [brown[400], amber[400], purple[400], lightBlue[400], indigo[400], green[500]];

const useCustomStyles = makeStyles(theme => ({
  graphContainer: {
    width: '92vw',
    height: '85vh',
  },
}));

interface GraphUnits {
  [key: string]: {
    isEnabled: boolean;
    value: string;
    dx: number;
    dy: number;
    angle: number;
    yAxisId: number;
    fontSize?: number;
    tickFormatter?: (value: number) => string;
  };
}

const Graphs: React.FC = () => {
  const selectedValues = useSelector(getSelectedItems);
  const metrics = useSelector(getMetrics);
  const classes = useCustomStyles();
  const graphData = Object.keys(metrics).map(key => metrics[key]);

  const units: GraphUnits = {
    percentage: {
      isEnabled: selectedValues.some((m: string) => getAxisID(m) === 0),
      value: '%',
      dx: 10,
      dy: 10,
      angle: -90,
      yAxisId: 0,
    },
    pressure: {
      isEnabled: selectedValues.some((m: string) => getAxisID(m) === 1),
      value: 'PSI',
      dx: 10,
      dy: 10,
      angle: -90,
      fontSize: 12,
      yAxisId: 1,
      tickFormatter: formatUnit,
    },
    temperature: {
      isEnabled: selectedValues.some((m: string) => getAxisID(m) === 2),
      value: 'F',
      dx: 10,
      dy: 15,
      angle: -90,
      fontSize: 12,
      yAxisId: 2,
    },
  };

  return (
    <Grid container className={classes.graphContainer}>
      <ResponsiveContainer>
        <LineChart width={600} height={600} data={graphData}>
          {selectedValues.map((metric, index) => {
            return (
              <Line key={metric} yAxisId={getAxisID(metric)} dataKey={metric} stroke={COLORS[index]} dot activeDot />
            );
          })}
          {selectedValues.length > 0 && <XAxis dataKey="at" interval={130} />}
          {Object.keys(units).map(key => {
            const { isEnabled, yAxisId, tickFormatter, ...rest } = units[key];
            return (
              isEnabled && (
                <YAxis
                  key={key}
                  label={{ position: 'insideTopLeft', offset: 0, fill: '#FAD0C7', ...rest }}
                  yAxisId={yAxisId}
                  tickFormatter={tickFormatter}
                />
              )
            );
          })}
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Grid>
  );
};

export default Graphs;
