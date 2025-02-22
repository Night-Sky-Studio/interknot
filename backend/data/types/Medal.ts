enum MedalType {
    "Shiyu Defence" = 1,
    "Simulated Battle Tower" = 2,
    "Deadly Assault" = 3,
    "Simulated Battle Tower - Last Stand" = 4
}

export interface MedalIcon {
    Id: number
    Name: string,
    IconUrl: string,
    LevelFormat: string
}

export interface Medal {
    MedalType: MedalType
    MedalIcon: MedalIcon
    Value: number
}