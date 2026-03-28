const availableDoros = [
    1041,
    1051,
    1091,
    1171,
    1181,
    1191,
    1221,
    1241,
    1261,
    1301,
    1311,
    1321,
    1331,
    1361,
    1371,
    1381,
    1391,
    1401,
    1411,
    1431,
    1451,
    1461,
    1501,
    1521
]

export function doroMode() {
    const now = new Date()
    return now.getMonth() === 3 && now.getDate() === 1 || true
}

export function hasDoro(characterId: number) {
    return availableDoros.includes(characterId)
}