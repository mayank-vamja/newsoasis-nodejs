const { clientAPIkey } = require("../../.env");

// TODO: setup mechanism to support client api-key generation & support using DB
const allowesIDs = [clientAPIkey];

module.exports = (req, res, next) => {
  const appId = req.headers["app-id"];
  if (appId?.length > 0) {
    if (!allowesIDs.includes(appId)) {
      res.status(403).json({
        error: "Invalid app-id",
      });
      return;
    }
  } else {
    res.status(400).json({
      error: "Provide app-id",
    });
    return;
  }

  next();
};
