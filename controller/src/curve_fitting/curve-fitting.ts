// Regression
// Power Law Curve Fitting (y = a * x ^ b)
// Linear Curve Fitting (y = a + b * x)

interface CurveFitReturnType { coeffs: number[], type: string, r2: number }

function round(number: number, precision: number): number {
  // Round a number to a certain number of decimal places given by precision
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}

function powerFunction(x: number, a: number, b: number, precision: number): number {
  // Power law function a * x ^ b
  return round(a * (x ** b), precision);
}

function determinationCoefficient(data_y: number[], data_y_predicted: number[]): number {
  // Coefficient of determination (R^2) for power law curve fitting
  const predictions = data_y_predicted.map((prediction) => prediction);
  const observations = data_y.map((y) => y);

  let sum = 0; // sum of observations
  for (const observation of observations) {
    sum += observation;
  }
  const mean = sum / observations.length;

  let ssyy = 0; // sum of squares total
  for (const observation of observations) {
    const difference = observation - mean;
    ssyy += difference * difference;
  }

  let sse = 0; // sum of squared errors
  for (const [index, observation] of observations.entries()) {
    const prediction = predictions[index];
    const residual = observation - prediction;
    sse += residual * residual;
  }

  return 1 - (sse / ssyy);
}

function power(data_x: number[], data_y: number[], precision: number): CurveFitReturnType {
  // Power law regression a * x ^ b
  const sum = [0, 0, 0, 0, 0];
  const nvalues = data_x.length;
  for (let n = 0; n < nvalues; n += 1) {
    if (data_y[n] !== null) {
      sum[0] += Math.log(data_x[n]);
      sum[1] += Math.log(data_y[n]) * Math.log(data_x[n]);
      sum[2] += Math.log(data_y[n]);
      sum[3] += (Math.log(data_x[n]) ** 2);
    }
  }
  const b = ((nvalues * sum[1]) - (sum[0] * sum[2])) / ((nvalues * sum[3]) - (sum[0] ** 2));
  const a = ((sum[2] - (b * sum[0])) / nvalues);
  const coeffA = round(Math.exp(a), precision);
  const coeffB = round(b, precision);

  const predictedY = data_x.map((x) => powerFunction(x, coeffA, coeffB, precision));

  return {
    coeffs: [coeffA, coeffB],
    type: 'power',
    r2: round(determinationCoefficient(data_y, predictedY), precision),
  };
}

function linear(
  data_x: number[],
  data_y: number[]): CurveFitReturnType {
  // Linear regression a + (b * x)
  const x1 = data_x[0];
  const x2 = data_x[1];
  const y1 = data_y[0];
  const y2 = data_y[1];
  const b = (y2 - y1) / (x2 - x1);
  const a = y1 - b * x1;
  return {
    coeffs: [a, b],
    type: 'linear',
    r2: 1,
  };
}

export default function curveFitting(
  data_x: number[],
  data_y: number[],
  method = 'linear',
  precision = 4): CurveFitReturnType {
  // Curve fitting
  // method: 'power' or 'linear'. Default is 'linear'
  let results = {
    coeffs: [0, 0], type: '', r2: 0,
  };

  if (data_x.length !== data_y.length) {
    throw new Error('Input data arrays must have the same length');
  }

  if (data_x.length === 0) {
    throw new Error('Input data arrays must have at least one element');
  }

  let dataX: number[];
  let dataY: number[];
  if (data_x.length === 1) {
    // single data point, use origo (0,0) as base.
    dataX = [0, data_x[0]];
    dataY = [0, data_y[0]];
  } else {
    dataX = data_x;
    dataY = data_y;
  }

  if (method === 'power') {
    results = power(dataX, dataY, precision);
  } else if (method === 'linear') {
    results = linear(dataX, dataY);
  }
  return results;
}
