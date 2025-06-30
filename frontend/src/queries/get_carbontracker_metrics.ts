import { gql } from 'graphql-request';

const getCarbontrackerDataQuery = gql`
    query fetchCarbontrackerData($input: CarbonTrackerInput!) {
        fetchCarbontrackerData(input: $input) {
            duration
            cpuModel
            cpuPowerData
            averagePowerUsage
            energyUsage
            location
            carbonIntensity
            energy
            co2eq
        }
    }
`;

export default getCarbontrackerDataQuery;
