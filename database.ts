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
            tx.executeSql("CREATE TABLE IF NOT EXISTS alarm (id INTEGER PRIMARY KEY NOT NULL, hours TEXT, minutes TEXT, days TEXT, sound TEXT, dailyChallenge TEXT, stoppedSuccessfully INTEGER, active INTEGER);");
            tx.executeSql("CREATE TABLE IF NOT EXISTS streak (id INTEGER PRIMARY KEY NOT NULL, currentStreak INTEGER, highestStreak INTEGER);");
            tx.executeSql("CREATE TABLE IF NOT EXISTS user (id INTEGER primary key not null, TEXT name, INTEGER streak);");
            this.addStreak();
        });
    }

    static add(hours: any, minutes: any, sound: string, challenge: string) {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO alarm (hours, minutes, days, sound, dailyChallenge, stoppedSuccessfully, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [hours, minutes, 'null', sound, challenge, 0, 1]
            );
        });
    }

    static getAll() {
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

    static updateActive(id: number, active: number) {
        db.transaction(tx => {
            tx.executeSql(`UPDATE alarm SET active=${active} WHERE id=${id}`);
        });
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

    // streaks
    static updateStreak() {
        db.transaction(
          (tx) => {
            tx.executeSql(
              "SELECT currentStreak, highestStreak FROM streak WHERE id=1;",
              [],
              (tx, results) => {
                const { currentStreak, highestStreak } = results.rows.item(0);
    
                const newCurrentStreak = currentStreak + 1;
                console.log(`CurrentStreak: ${newCurrentStreak}`);
                const newHighestStreak = Math.max(newCurrentStreak, highestStreak);
                console.log(`HighestStreak: ${newHighestStreak}`);
    
                // Update the current streak
                tx.executeSql(
                  "UPDATE streak SET currentStreak=? WHERE id=1;",
                  [newCurrentStreak],
                  (_, __) => {
                    console.log("Current streak updated successfully");
                  },
                  (_, error) => {
                    console.error("Error updating current streak:", error);
                    return true;
                  }
                );
    
                // Update the highest streak
                tx.executeSql(
                  "UPDATE streak SET highestStreak=? WHERE id=1;",
                  [newHighestStreak],
                  (_, __) => {
                    console.log("Highest streak updated successfully");
                  },
                  (_, error) => {
                    console.error("Error updating highest streak:", error);
                    return true;
                  }
                );
              }
            );
          },
          (error) => {
            console.error("Transaction error:", error);
            return true;
          }
        );
      }
    
      static getStreak() {
        var query = "SELECT * FROM streak WHERE id=1;";
        return new Promise((resolve, reject) =>
            db.transaction((tx) => {
                tx.executeSql(
                    query,
                    [],
                    (tx, results) => {
                        resolve(JSON.stringify(results));
                    },
                    function (tx, error): boolean {
                        reject(error);
                        return false;
                    }
                );
            })
        );
      }  

      static addStreak() {
        db.transaction(
          (tx) => {
            tx.executeSql(
              "SELECT * FROM streak WHERE id=1;",
              [],
              (_, results) => {
                if (results.rows.length === 0) {
                  tx.executeSql(
                    "INSERT INTO streak (id, currentStreak, highestStreak) VALUES (?, ?, ?);",
                    [1, 0, 0],
                    (_, __) => {
                      console.log("Streak added successfully");
                    },
                    (_, error) => {
                      console.error("Error adding streak:", error);
                      return true;
                    }
                  );
                } else {
                  console.log("Streak with id=1 already exists. Ignoring.");
                }
              },
              (_, error) => {
                console.error("Error checking streak existence:", error);
                return true;
              }
            );
          },
          (error) => {
            console.error("Transaction error:", error);
            return true;
          }
        );
      }

      static resetStreak() {
        db.transaction(
          (tx) => {
            tx.executeSql(
              "UPDATE streak SET currentStreak=0 WHERE id=1;",
              [],
              (_, __) => {
                console.log("Streak reset successfully");
              },
              (_, error) => {
                console.error("Error resetting streak:", error);
                return true;
              }
            );
          },
          (error) => {
            console.error("Transaction error:", error);
            return true;
          }
        );
      }

}

export default Database;