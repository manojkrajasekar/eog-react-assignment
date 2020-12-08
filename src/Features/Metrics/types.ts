export interface metricInterface {
  metric: string;
  at: string;
  value: number;
  unit: string;
}

export interface MetricInitialState {
  metrics: {
    [at: string]: metricInterface;
  };
  latestValue: {
    [metric: string]: number;
  };
  selected: string[];
}

export interface SelectPayload {
  selected: string[];
  newMetric: string;
}

export interface MetricsUpdated {
  metrics: {
    [at: string]: metricInterface;
  };
  latestValue: {
    [metric: string]: number;
  };
}

export interface MetricsPayload {
  metrics: {
    [at: string]: metricInterface;
  };
}
