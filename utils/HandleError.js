module.exports = function HandleError(client) {
  process.on("uncaughtException", function (error) {
    console.error(error);
  });

  process.on("uncaughtExceptionMonitor", function (error) {
    console.error(error);
  });

  process.on("unhandledRejection", function (error) {
    console.error(error);
  });

  process.on("rejectionHandled", function (error) {
    console.error(error);
  });

  process.on("worker", function (error) {
    console.error(error);
  });

  process.on("SIGINT", () => {
    console.log("Caught interrupt signal");
    client.destroy();
    process.exit();
  });

  process.on("SIGTERM", () => {
    console.log("Caught interrupt signal");
    client.destroy();
    process.exit();
  });
};
