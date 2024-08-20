const { reply_message, replyImage_and_msg_ToLine, get_image, sendImage_to_prediction, sendimage_store_vercel } = require('./function_line/any_function');

const callback = async (req, res) => {
  try {
    let { destination, events } = req.body; // รับแค่ข้อมูลท่ส่งมาชื่อว่า eventเท่านั้น
    let linetoken =
      "Z/tgeBDExJVEPvHM9EgrSYWyR306oYO7linebvrE+RfEPxmX9fU0YBmuBUlrWkPzcTEdeSbBOQbj5T9wMuLvm0rLc7nd1+4u05kkBOfcKgNkplX181TEtu/f4yKXy8K7gdQSTnexep2+NwGSnkHOowdB04t89/1O/w1cDnyilFU=";
    if (
      events &&
      events[0] &&
      events[0].type === "message" &&
      events[0].message.type === "image"
    ) {
      let reply_id = events[0].replyToken;
      let message_id = events[0].message.id;
      let userid_ = events[0].source.userId;
      let beforpredection = await get_image(message_id, linetoken, userid_);
      // console.log(beforpredection);
      let { detected_objects,
        image_after_prediction } = await sendImage_to_prediction(
          beforpredection,
          linetoken,
          userid_
        );
      let data = [];
      if (detected_objects && detected_objects.length > 0) {
        const { url_imagepre } = await sendimage_store_vercel(image_after_prediction);
        detected_objects.forEach((element) => {
          data.push(
            `- โรค: ${element.class_name
            }\nความเป็นไปได้: ${element.confidence.toFixed(2)}%\n`
          );
        });
        await replyImage_and_msg_ToLine(reply_id, linetoken, url_imagepre, `ตรวจพบว่าเป็น\n${data.join("")}`);
      } else {
        await reply_message(reply_id, linetoken, `ไม่พบข้อมูลการพยากรณ์`);
      }
      res.sendStatus(200);
    } else res.sendStatus(200);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed.", error: err.message });
  }
};
module.exports = callback;
