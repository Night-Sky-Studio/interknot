import { useParams } from "react-router"
import Users from "../mock/MockUsers"
import { mapUserProfile } from "../api/UserProfile"
import UserHeader from "../components/UserHeader"

export default function ProfilePage(): React.ReactElement {
    let { id } = useParams()

    const rawUser = Users.find(u => u.uid == id)
    const user = mapUserProfile(rawUser!)
    
    return (
        <UserHeader user={user} />
    )
}