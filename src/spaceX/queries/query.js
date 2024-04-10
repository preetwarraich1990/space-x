
import { gql } from '@apollo/client';


export const GET_SPACE_X = () => gql`
  query GetLocations {
    launchesPast {
    id
    mission_name launch_date_local launch_site {
    site_name_long }
    launch_success links {
    wikipedia }
    rocket { rocket_name first_stage {
    cores { flight core {
    reuse_count
    status }
    } }
    second_stage { payloads {
    payload_type
    payload_mass_kg }
    }
    rocket_type }}
    }
`;