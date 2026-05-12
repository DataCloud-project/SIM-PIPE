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

function power(dataX: number[], dataY: number[], precision: number): CurveFitReturnType {
  // Power law regression a * x ^ b
  const sum = [0, 0, 0, 0, 0];
  const nvalues = dataX.length;
  for (let n = 0; n < nvalues; n += 1) {
    if (dataY[n] !== null) {
      sum[0] += Math.log(dataX[n]);
      sum[1] += Math.log(dataY[n]) * Math.log(dataX[n]);
      sum[2] += Math.log(dataY[n]);
      sum[3] += (Math.log(dataX[n]) ** 2);
    }
  }
  const b = ((nvalues * sum[1]) - (sum[0] * sum[2])) / ((nvalues * sum[3]) - (sum[0] ** 2));
  const a = ((sum[2] - (b * sum[0])) / nvalues);
  const coeffA = round(Math.exp(a), precision);
  const coeffB = round(b, precision);

  const predictedY = dataX.map((x) => powerFunction(x, coeffA, coeffB, precision));

  return {
    coeffs: [coeffA, coeffB],
    type: 'power',
    r2: round(determinationCoefficient(dataY, predictedY), precision),
  };
}

function linear(
  dataX: number[],
  dataY: number[]): CurveFitReturnType {
  // Linear regression a + (b * x)
  const x1 = dataX[0];
  const x2 = dataX[1];
  const y1 = dataY[0];
  const y2 = dataY[1];
  const b = (y2 - y1) / (x2 - x1);
  const a = y1 - b * x1;
  return {
    coeffs: [a, b],
    type: 'linear',
    r2: 1,
  };
}

export function curveFitting(
  dataX: number[],
  dataY: number[],
  method = 'linear',
  precision = 4): CurveFitReturnType {
  // Curve fitting
  // method: 'power' or 'linear'. Default is 'linear'
  let results = {
    coeffs: [0, 0], type: '', r2: 0,
  };

  if (dataX.length !== dataY.length) {
    throw new Error('Input data arrays must have the same length');
  }

  if (dataX.length === 0) {
    throw new Error('Input data arrays must have at least one element');
  }

  let inputX: number[];
  let inputY: number[];
  if (dataX.length === 1) {
    // single data point, use origo (0,0) as base.
    inputX = [0, dataX[0]];
    inputY = [0, dataY[0]];
  } else {
    inputX = dataX;
    inputY = dataY;
  }

  if (method === 'power') {
    results = power(inputX, inputY, precision);
  } else if (method === 'linear') {
    results = linear(inputX, inputY);
  }
  return results;
}

export function extrapolate(
  type: string,
  coeffs: number[],
  x: number): number {
  // Extrapolate a value from a curve fit
  if (type === 'power') {
    return powerFunction(x, coeffs[0], coeffs[1], 4);
  }
  if (type === 'linear') {
    return round(coeffs[0] + (coeffs[1] * x), 4);
  }
  throw new Error('Invalid curve fit type');
}
