import { createSlice, PayloadAction } from 'redux-starter-kit';
import { metricInterface, MetricsPayload, MetricInitialState, MetricsWithLatest, SelectPayload } from './types';

const initialState: MetricInitialState = {
  selected: [],
  metrics: {},
  latestValue: {},
};

const slice = createSlice({
  initialState,
  name: 'metricsReducer',
  reducers: {
    selectMetric: (state, action: PayloadAction<SelectPayload>) => {
      const { selected } = action.payload;
      return {
        ...state,
        selected,
      };
    },
    metricDataRecieved: (state, action: PayloadAction<MetricsWithLatest>) => {
      const { metrics, latestValue } = action.payload;
      return {
        ...state,
        metrics,
        latestValue,
      };
    },
    multipleMetricsDataReceived: (state, action: PayloadAction<MetricsPayload>) => {
      const { metrics } = action.payload;
      return {
        ...state,
        metrics,
      };
    },
    newMetricValueFetched: (state, action: PayloadAction<metricInterface>) => state,
  },
});

export const { reducer, actions } = slice;
