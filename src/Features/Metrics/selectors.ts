import { DefaultState } from '../../store';

export const getSelectedItems = ({ metrics }: DefaultState) => metrics.selected;

export const getMetrics = ({ metrics: { metrics } }: DefaultState) => metrics;

export const getUpdateValues = (state: DefaultState) => state.metrics.latestValue;
