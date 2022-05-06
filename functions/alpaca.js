const Alpaca = require("@alpacahq/alpaca-trade-api");

const alpaca = new Alpaca({});

function flatten(suspend_trade, message = "") {
  alpaca
    .cancelAllOrders()
    .then((res) =>
      console.info(`suspendAccount: cancel : ${JSON.stringify(res)}`)
    )
    .then(() => {
      alpaca
        .closeAllPositions()
        .then((res) =>
          console.info(`suspendAccount: close : ${JSON.stringify(res)}`)
        )
        .then(() => {
          if (suspend_trade) {
            alpaca
              .updateAccountConfigurations({ suspend_trade: true })
              .then((res) => {
                console.info(`suspendAccount: ${suspend_trade} ${message}`);
                console.info(
                  `suspendAccount: suspend : ${JSON.stringify(res)}`
                );
              })
              .catch((err) =>
                console.error(
                  `suspendAccount: suspend : ${JSON.stringify(
                    err.response.data
                  )}`
                )
              );
          } else {
            console.info(`suspendAccount: ${suspend_trade} ${message}`);
          }
        })
        .catch((err) =>
          console.error(
            `suspendAccount close: ${JSON.stringify(err.response.data)}`
          )
        );
    })
    .catch((err) =>
      console.error(
        `suspendAccount: cancel : ${JSON.stringify(err.response.data)}`
      )
    );
}

module.exports = {
  alpaca,
  flatten,
};
