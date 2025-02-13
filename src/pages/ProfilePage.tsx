import { useParams } from "react-router"
import Users from "../mock/MockUsers"
import UserHeader from "../components/UserHeader"
import { mapProfile } from "../enka/data/mappers/ProfileMapper"

export default function ProfilePage(): React.ReactElement {
    let { id } = useParams()

    const rawUser = Users.find(u => u.uid == id)
    const user = mapProfile(rawUser!)
    
    return (
        <UserHeader user={user} />
    )
}