export const getAxisID = (metric: string) => {
  if (metric.toLowerCase().endsWith('pressure')) {
    return 1;
  } else if (metric.toLowerCase().endsWith('temp')) {
    return 2;
  }
  return 0;
};

export const formatUnit = (value: number): string => (value >= 1000 ? `${value / 1000}K` : value.toString());

export const getTimeAgo = (minutesAgo: number) => new Date(new Date().getTime() - minutesAgo * 60000).getTime();
