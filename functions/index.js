const functions = require("firebase-functions");
const { alpaca, flatten } = require("./alpaca");

const dailyProfitTarget = parseFloat(process.env.DAILY_PT);

exports.closeDailyPositions = functions.pubsub
  .schedule("57 13 * * 1-5")
  .timeZone("America/Denver")
  .onRun((context) => {
    flatten(false, "daily close");
    return null;
  });

exports.checkDailyProfitTarget = functions.pubsub
  .schedule("* 7-13 * * 1-5")
  .timeZone("America/Denver")
  .onRun((context) => {
    alpaca
      .getAccountConfigurations()
      .then((res) => {
        if (!res.suspend_trade) {
          alpaca
            .getAccount()
            .then((res) => {
              yesterdayEq = parseFloat(res.last_equity);
              todayEq = parseFloat(res.equity);
              let profit = (todayEq - yesterdayEq).toFixed(2);
              if (profit >= dailyProfitTarget) {
                flatten(true, `daily profit met: ${profit}`);
              }
            })
            .catch((err) => functions.logger.error(err));
        }
      })
      .catch((err) => functions.logger.error(err));
    return null;
  });
