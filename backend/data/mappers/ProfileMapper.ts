import type EnkaResponse from "../../api/EnkaResponse"
import type { Profile } from "../types/Profile"
import { mapCharacter } from "./CharacterMapper"
import { mapMedal } from "./MedalMapper"
import { getNamecardUrl } from "./NamecardMapper"
import { getProfilePictureUrl } from "./ProfilePictureMapper"
import { getTitle } from "./TitleMapper"

export function mapProfile(r: EnkaResponse): Profile {
    return {
        Uid: r.PlayerInfo.SocialDetail.ProfileDetail.Uid,
        Ttl: r.ttl,
        Information: {
            Nickname: r.PlayerInfo.SocialDetail.ProfileDetail.Nickname,
            Description: r.PlayerInfo.SocialDetail.Desc,
            MainCharacter: r.PlayerInfo.SocialDetail.ProfileDetail.AvatarId,
            Level: r.PlayerInfo.SocialDetail.ProfileDetail.Level,
            Title: getTitle(r.PlayerInfo.SocialDetail.ProfileDetail.Title),
            ProfilePictureUrl: getProfilePictureUrl(r.PlayerInfo.SocialDetail.ProfileDetail.ProfileId),
            Platform: r.PlayerInfo.SocialDetail.ProfileDetail.PlatformType.toString(),
            NamecardUrl: getNamecardUrl(r.PlayerInfo.SocialDetail.ProfileDetail.CallingCardId),
            Medals: r.PlayerInfo.SocialDetail.MedalList.map(mapMedal)
        },
        Characters: r.PlayerInfo.ShowcaseDetail.AvatarList.map(mapCharacter)
    }
}