import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("wakemeapp.db");

const translate_days = (days: any) => {
    let output = '';

    for (let day of days) {
        output += day + ',';
    }

    return output.substring(0, output.length - 1);

};

class Database {

    static createTable() {
        console.log('create db');
        db.transaction(tx => {
            tx.executeSql("DROP TABLE IF EXISTS alarm;");
            tx.executeSql("CREATE TABLE IF NOT EXISTS alarm (id INTEGER PRIMARY KEY NOT NULL, hours TEXT, minutes TEXT, days TEXT, sound TEXT, dailyChallenge TEXT, stoppedSuccessfully INTEGER);");
            tx.executeSql("CREATE TABLE IF NOT EXISTS user (id INTEGER primary key not null, TEXT name, INTEGER streak);");
        });
    }

    static add(hours: any, minutes: any, sound: string, challenge: string) {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO alarm (hours, minutes, days, sound, dailyChallenge, stoppedSuccessfully) VALUES (?, ?, ?, ?, ?, ?)',
                [hours, minutes, 'null', sound, challenge, 0]
            );
        });
    }

    static getAll() {
        console.log('getting all');
        var query = "SELECT * FROM alarm";
        return new Promise((resolve, reject) => db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                resolve(JSON.stringify(results));
                console.log(results);
            }, function (tx, error): any {
                reject(error);
            });
        }));
    }

    static updatePassed(id: number) {
        console.log('update passed');
        db.transaction(tx => {
            tx.executeSql(`UPDATE alarm SET stoppedSuccessfully=1 WHERE id=${id}`);
        });
    }

    static getOne(id: any) {
        console.log('one row request');
        var query = `SELECT * FROM alarm WHERE id='${id}'`;
        return new Promise((resolve, reject) => db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                resolve(JSON.stringify(results));
            }, function (tx, error): any {
                reject(error);
            });
        }));
    }

    static delete(id: any) {
        console.log('delete from db');
        db.transaction(tx => {
            tx.executeSql(`DELETE FROM alarm WHERE (id=${id})`);
        });
    }

    static setDays(days: string, id: any) {
        console.log('update days');
        days = translate_days(days);

        console.log(days, id);

        db.transaction(tx => {
            tx.executeSql(`UPDATE alarm SET days='${days}' WHERE id=${id}`);
        });
    }
}

export default Database;