import Uber from "./Uber.json"
import Jelosus1 from "./Jelosus1.json"
import LilyStilson from "./LilyStilson.json"
import Neijin from "./Neijin.json"
import Alt from "./Альт.json"

import EnkaResponse from "../../backend/api/EnkaResponse"
import { mapProfile } from "../data/mappers/ProfileMapper"

const Users = [
    mapProfile(Uber as unknown as EnkaResponse), 
    mapProfile(Jelosus1 as unknown as EnkaResponse),
    mapProfile(LilyStilson as unknown as EnkaResponse),
    mapProfile(Neijin as unknown as EnkaResponse),
    mapProfile(Alt as unknown as EnkaResponse)
]


export default Users