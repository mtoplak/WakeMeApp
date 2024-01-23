import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("wakemeapp.db");

class Database {

  static createTable() {
    console.log('create db');
    db.transaction(tx => {
      tx.executeSql("DROP TABLE IF EXISTS alarm;");  // Remove this line if you want to keep your alarms on app restart
      tx.executeSql("CREATE TABLE IF NOT EXISTS alarm (id INTEGER PRIMARY KEY NOT NULL, hours TEXT, minutes TEXT, days TEXT, sound TEXT, dailyChallenge TEXT, active INTEGER, notificationId TEXT, name TEXT);");
      tx.executeSql("CREATE TABLE IF NOT EXISTS streak (id INTEGER PRIMARY KEY NOT NULL, currentStreak INTEGER, highestStreak INTEGER);");
      tx.executeSql("CREATE TABLE IF NOT EXISTS user (id INTEGER primary key not null, TEXT name, INTEGER streak);");
      this.addStreak();
    });
  }

  static add(hours: any, minutes: any, sound: string, challenge: string, notificationId: string, name: string) {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO alarm (hours, minutes, days, sound, dailyChallenge, active, notificationId, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [hours, minutes, 'null', sound, challenge, 1, notificationId, name]
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

  static getAllActive() {
    var query = "SELECT * FROM alarm WHERE active = 1";
    return new Promise((resolve, reject) => db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        resolve(JSON.stringify(results));
        console.log(results);
      }, function (tx, error): any {
        reject(error);
      });
    }));
  }

  static getLatestAlarm(callback: any) {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM alarm ORDER BY id DESC LIMIT 1;",
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            const latestAlarm = result.rows.item(0);
            callback(latestAlarm);
          } else {
            // If no alarm found, subtract one minute and try again
            this.getAlarmBeforeNow(callback);
          }
        },
        (_, error) => {
          console.error("Error getting latest alarm:", error);
          return false;
        }
      );
    });
  }

  static getAlarmBeforeNow(callback: any) {
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM alarm WHERE (hours < ? OR (hours = ? AND minutes <= ?)) ORDER BY id DESC LIMIT 1;",
        [
          oneMinuteAgo.getHours().toString().padStart(2, "0"),
          oneMinuteAgo.getHours().toString().padStart(2, "0"),
          oneMinuteAgo.getMinutes().toString().padStart(2, "0")
        ],
        (_, result) => {
          if (result.rows.length > 0) {
            const alarm = result.rows.item(0);
            callback(alarm);
          } else {
            console.error("No alarm found.");
          }
        },
        (_, error) => {
          console.error("Error getting alarm before now:", error);
          return false;
        }
      );
    });
  }

  static updateActive(id: number, active: number) {
    db.transaction(tx => {
      tx.executeSql(`UPDATE alarm SET active=${active} WHERE id=${id}`);
    });
  }

  static updateNotificationId(id: number, notificationId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(`SELECT notificationId FROM alarm WHERE id=${id}`, [], (_, queryResult) => {
          if (queryResult.rows.length > 0) {
            const currentNotificationId = queryResult.rows.item(0).notificationId;

            tx.executeSql(`UPDATE alarm SET notificationId='${notificationId}' WHERE id=${id}`, [], (_, result) => {
              if (result.rowsAffected > 0) {
                resolve(currentNotificationId);
              } else {
                reject(new Error('Update failed.'));
              }
            });
          } else {
            reject(new Error('NotificationId not found.'));
          }
        });
      });
    });
  }

  static getOne(id: any) {
    var query = `SELECT * FROM alarm WHERE id='${id}'`;
    return new Promise((resolve, reject) => db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        resolve(JSON.stringify(results));
      }, function (tx, error): any {
        reject(error);
      });
    }));
  }

  static delete(id: any): Promise<string> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(`SELECT notificationId FROM alarm WHERE id=${id}`, [], (_, queryResult) => {
          if (queryResult.rows.length > 0) {
            const currentNotificationId = queryResult.rows.item(0).notificationId;

            tx.executeSql(`DELETE FROM alarm WHERE id=${id}`, [], (_, result) => {
              if (result.rowsAffected > 0) {
                resolve(currentNotificationId);
              } else {
                reject(new Error('Delete failed.'));
              }
            });
          } else {
            reject(new Error('NotificationId not found.'));
          }
        });
      });
    });
  }

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