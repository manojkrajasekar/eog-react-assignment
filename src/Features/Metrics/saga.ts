import { takeEvery, put, fork, select } from 'redux-saga/effects';
import { actions } from './reducer';
import { SelectPayload, metricInterface } from './types';
import { PayloadAction } from 'redux-starter-kit';
import { client } from './Metrics';
import { OperationResult } from 'urql';
import { getMetrics, getUpdatedValues } from './selectors';
import { getTimeAgo } from '../../utils';

const DURATION = 30;

interface QueryResult {
  getMeasurements: metricInterface[];
}

interface QueryArgs {
  metricName: string;
  after: number;
}

function* transformData({ payload: { metric, at, value } }: PayloadAction<metricInterface>) {
  const data: { [at: string]: metricInterface } = yield select(getMetrics);
  const previousValue: { [metric: string]: number } = yield select(getUpdatedValues);
  const hrs = new Date(at).getHours() % 12 || 12;
  const mins = new Date(at).getMinutes();
  const lastTimeAt = `${('0' + hrs).slice(-2)}:${('0' + mins).slice(-2)}`;

  const metrics = {
    ...data,
    [at]: {
      ...data[at],
      [metric]: value,
      at: lastTimeAt,
    },
  };
  const latestValue = {
    ...previousValue,
    [metric]: value,
  };
  yield put(actions.metricDataRecieved({ metrics, latestValue }));
}

function* mergeData(list?: metricInterface[]) {
  let metrics: { [at: string]: metricInterface } = yield select(getMetrics);
  list?.map(item => {
    const { metric, at, value } = item;
    const hrs = new Date(at).getHours() % 12 || 12;
    const mins = new Date(at).getMinutes();
    const lastTimeAt = `${('0' + hrs).slice(-2)}:${('0' + mins).slice(-2)}`;
    metrics = {
      ...metrics,
      [at]: {
        ...metrics[at],
        [metric]: value,
        at: lastTimeAt,
      },
    };
  });
  yield put(actions.multipleMetricsDataReceived({ metrics }));
}

function* fetchPastData({ payload }: PayloadAction<SelectPayload>) {
  const { newMetric } = payload;

  const { data }: OperationResult<QueryResult> = yield client
    .query<QueryResult, QueryArgs>(
      `
    query($metricName: String!, $after: Timestamp) {
        getMeasurements(input: { metricName: $metricName, after: $after }) {
            at
            metric
            value
            unit
        }
    }`,
      {
        metricName: newMetric,
        after: getTimeAgo(DURATION),
      },
    )
    .toPromise();

  yield fork(mergeData, data?.getMeasurements);
}

export default function* watcher() {
  yield takeEvery(actions.newMetricValueFetched.type, transformData);
  yield takeEvery(actions.selectMetric.type, fetchPastData);
}
