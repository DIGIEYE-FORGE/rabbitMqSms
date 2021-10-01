const { filter, mergeMap } = require("rxjs/operators");
const db = require("./utils/db");
const deviceModel = require("./devices.model");
const { getDeviceQueue } = require("./amqp");
const NO_OF_SUBSCRIBERS = 1;



/** on database error connection we stop server immediately **/
db.on("error", (err) => {
    console.error(new Error(err));
    process.exit(1);
});

db.on("disconnected", () => {
    console.error(new Error("Database diconnected"));
    process.exit(1);
});

const deviceQueue = getDeviceQueue(NO_OF_SUBSCRIBERS);

deviceQueue
  .pipe(
    filter(({ payload }) => !!payload.content),
    mergeMap(async (message) => {
      try {
        return {
          ...message,
          content: JSON.parse(message.payload.content.toString().toLowerCase()), 
        };
      } catch (err) {
        console.log("Parse Error", message.payload);
        // todo: push message into error queue or collections
        // await saveBadEvent(
        //   message.payload.content.toString(),
        //   "PARSE_JSON_ERROR",
        //   err.message
        // );
        message.ack();
        return null;
      }
    }),
    filter((data) => !!data)
  )
  .subscribe(async ({ content, ack, payload }) => {
    try {
      console.log(content);
      const device = await deviceBuilder(content);
      if(device)
        await device.save();
      ack();
    } catch (err) {
    //   await saveBadEvent(
    //     payload.content.toString(),
    //     "SAVE_TO_DB_ERROR",
    //     err.message
    //   );
      ack();
    }
  });


const deviceBuilder = async (payload) => {
    let device;
    device = deviceModel();
    if (payload.number)
      device.number = payload.number;
    if (payload.message)
    device.message = payload.message;
    if (payload.alert)
    device.alert = payload.alert;
    if (payload.date)
    device.date = payload.date;
    return device;
};