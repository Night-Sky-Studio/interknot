import { useParams } from "react-router";

export interface IProfilePageProps {
    id: number
}

export default function ProfilePage(): React.ReactElement {
    let { id } = useParams();
    
    return (
        <h1>Opened {id} user</h1>
    )
}