import {database} from './database.ts'

try {
    database.exec(`
        BEGIN IMMEDIATE;
        DELETE FROM score;
        DELETE FROM sqlite_sequence WHERE name = 'score';
        COMMIT;
    `)
    console.log('Database successfully reset.')
} finally {
    database.close()
}
