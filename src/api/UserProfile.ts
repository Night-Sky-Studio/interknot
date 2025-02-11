import { MainCharacter } from "./definitions/mappers/Avatars"
import { getMedalIcon, MedalIcon, MedalType } from "./definitions/mappers/Medals"
import { getNamecardUrl } from "./definitions/mappers/Namecards"
import { getProfilePictureUrl } from "./definitions/mappers/ProfilePictures"
import { getTitle, Title } from "./definitions/mappers/Titles"
import type EnkaResponse from "./EnkaResponse"

interface ProfileInfo {
    Nickname: string
    Description: string
    MainCharacter: MainCharacter    // AvatarId :: Wise or Belle
    Level: number
    Title: Title
    ProfilePictureUrl: string
    Platform: string                // PlatformType :: Probably the last played platform?
    NamecardUrl: string             // CallingCardId
    Medals: Medal[]
}

export interface UserProfile {
    Uid: number
    Ttl: number
    Information: ProfileInfo
}

export interface Medal {
    MedalType: MedalType
    MedalIcon: MedalIcon
    Value: number
}

type RawMedal = {
    Value: number,
    MedalType: number,
    MedalIcon: number
}

export function mapMedal(r: RawMedal): Medal {
    return {
        MedalType: r.MedalType,
        MedalIcon: getMedalIcon(r.MedalIcon),
        Value: r.Value
    }
}

export function mapUserProfile(r: EnkaResponse): UserProfile {
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
            Medals: r.PlayerInfo.SocialDetail.MedalList.map(m => mapMedal(m))
        }
    }
}