import { useParams, useSearchParams } from "react-router";

export default function LeaderboardDetailPage(): React.ReactElement {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "10"

    return (<>

    </>)
}