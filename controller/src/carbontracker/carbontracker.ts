import { carbontrackerEndpoint } from '../config.js';
import type { CarbonTrackerData, CarbonTrackerInput } from '../server/schema.js';

interface CarbonTrackerServiceResponse {
  stdout: string;
  stderr: string;
  parsed: string; // This is a JSON string that needs to be parsed
}

interface CarbonTrackerParsedData {
  Duration: string;
  'CPU Model': string;
  'CPU Power Data': string;
  'Average Power Usage': string;
  'Energy Usage': string;
  Location: string;
  'Carbon Intensity': string;
  Energy: string;
  CO2eq: string;
}

/**
 * Parse a value-unit string and return value and unit separately
 * Examples: "7.50 W" -> { value: 7.50, unit: "W" }
 *           "0.000 g" -> { value: 0.000, unit: "g" }
 */
function parseValueUnit(valueUnitString: string): { value: number; unit: string } {
  const trimmed = valueUnitString.trim();
  const parts = trimmed.split(' ');

  if (parts.length < 2) {
    // If no unit, assume it's just a number
    return { value: Number.parseFloat(trimmed) || 0, unit: '' };
  }

  const value = Number.parseFloat(parts[0]) || 0;
  const unit = parts.slice(1).join(' '); // Join remaining parts as unit

  return { value, unit };
}

/**
 * Convert duration string to seconds
 * Examples: "0:00:11.00" -> 11.00
 *           "0:01:30.50" -> 90.50
 */
function parseDurationToSeconds(durationString: string): number {
  const parts = durationString.split(':');

  if (parts.length !== 3) {
    // If format is unexpected, try to parse as number
    return Number.parseFloat(durationString) || 0;
  }

  const hours = Number.parseFloat(parts[0]) || 0;
  const minutes = Number.parseFloat(parts[1]) || 0;
  const seconds = Number.parseFloat(parts[2]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

export default async function fetchCarbontrackerData(
  input: CarbonTrackerInput,
): Promise<CarbonTrackerData> {
  try {
    // Convert the input data to the format expected by the carbontracker service
    // The service expects the input to be JSON-stringified and wrapped in {data: string}
    // This matches the curl example: jq -Rs '{data: .}' file.json
    const requestPayload = {
      data: JSON.stringify(input),
    };

    const response = await fetch(`${String(carbontrackerEndpoint)}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Carbontracker service returned ${response.status}: ${errorText}`);
    }

    const result = await response.json() as CarbonTrackerServiceResponse;

    // Parse the JSON string from the parsed field
    const parsedData = JSON.parse(result.parsed) as CarbonTrackerParsedData;

    // Parse values with units
    const averagePowerUsage = parseValueUnit(parsedData['Average Power Usage']);
    const energyUsage = parseValueUnit(parsedData['Energy Usage']);
    const carbonIntensity = parseValueUnit(parsedData['Carbon Intensity']);
    const energy = parseValueUnit(parsedData.Energy);
    const co2eq = parseValueUnit(parsedData.CO2eq);

    // Transform the response to match GraphQL schema field names
    return {
      duration: parseDurationToSeconds(parsedData.Duration),
      cpuModel: parsedData['CPU Model'],
      cpuPowerData: parsedData['CPU Power Data'],
      averagePowerUsage: averagePowerUsage.value,
      averagePowerUsageUnit: averagePowerUsage.unit,
      energyUsage: energyUsage.value,
      energyUsageUnit: energyUsage.unit,
      location: parsedData.Location,
      carbonIntensity: carbonIntensity.value,
      carbonIntensityUnit: carbonIntensity.unit,
      energy: energy.value,
      energyUnit: energy.unit,
      co2eq: co2eq.value,
      co2eqUnit: co2eq.unit,
    };
  } catch (error) {
    throw new Error(`Failed to fetch carbontracker data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
