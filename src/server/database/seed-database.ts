import {database} from './database.ts'

try {
    const insertScore = database.prepare('INSERT INTO score (player_name, score) VALUES (?, ?)')
    database.exec('BEGIN IMMEDIATE')
    for (let index = 0; index < 50; index++) {
        const name = String.fromCharCode(65 + Math.floor(index / 26), 65 + index % 26, 65)
        insertScore.run(name, (50 - index) * 100)
    }
    database.exec('COMMIT')
    console.log('Added 50 sample scores.')
} finally {
    database.close()
}
