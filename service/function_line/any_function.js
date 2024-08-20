const axios = require('axios');
const { text } = require('express');
async function reply_message(replym_id, linetoken, text) {
    try {
        await axios.post(
            "https://api.line.me/v2/bot/message/reply",
            {
                replyToken: replym_id,
                messages: [{ type: "text", text: text }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${linetoken}`,
                },
            }
        );
    } catch (error) {
        console.error(error);
    }
}
async function message_to_user(linetoken, text, userid) {
    try {
        await axios.post(
            "https://api.line.me/v2/bot/message/push",
            {
                to: userid,
                messages: [{ type: "text", text: text }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${linetoken}`,
                },
            }
        );
    } catch (error) {
        console.error(error);
    }
}
async function get_image(message_id, linetoken) {
    const url = `https://api-data.line.me/v2/bot/message/${message_id}/content`;
    const headers = {
        Authorization: `Bearer ${linetoken}`,
    };

    try {
        const response = await axios.get(url, {
            headers: headers,
            responseType: "arraybuffer",
        });
        if (response.status === 200) {
            const buffer = response.data;
            const view = new Uint8Array(buffer);
            return view;
        } else {
            console.error(`Unexpected status code: ${response.status}`);
            throw new Error("Unexpected response status code");
        }
    } catch (error) {
        console.error(
            "Error:",
            error.response ? error.response.data : error.message
        );
        throw new Error("Failed to get image");
    }
}
async function sendImage_to_prediction(image_data) {
    try {
        const imageBuffer = Buffer.from(image_data);
        const response = await axios.post(
            "https://correct-magnetic-cub.ngrok-free.app/prediction",
            imageBuffer,
            {
                headers: {
                    "Content-Type": "application/octet-stream",
                    "Content-Length": imageBuffer.length,
                },
            }
        );
        data_from_prediction = response.data;
        const detected_objects = data_from_prediction.detected_objects;
        const image_after_prediction = data_from_prediction.image;
        return { detected_objects, image_after_prediction };
    } catch (error) {
        console.error("Error:", error.message);
        console.log("Error processing image");
    }
}
async function sendimage_store_vercel(image_data) {
    try {
        if (!image_data) {
            throw new Error("image_data is undefined or null");
        }
        const imageBuffer = Buffer.from(image_data, "base64");
        const response = await axios.post("https://strawberrywebhook-ai.vercel.app/sendimg", imageBuffer, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Length": imageBuffer.length,
            },
        });
        let url_image = response.data;
        let url_imagepre = url_image.url
        console.log(url_imagepre);
        return { url_imagepre };
    } catch (error) {
        console.error('Error sending image to Vercel:', error.response ? error.response.data : error.message);
        throw error; // ขว้างข้อผิดพลาดเพื่อให้ฟังก์ชันต้นทางรับรู้
    }
}
async function replyImage_and_msg_ToLine(replyToken, accessToken, imageUrl, text) {
    try {
        // สร้าง payload สำหรับ LINE API
        const payload = {
            replyToken: replyToken,
            messages: [
                {
                    type: 'image',
                    originalContentUrl: imageUrl,
                    previewImageUrl: imageUrl
                },
                {
                    type: "text", text: text,

                }
            ]
        };

        // ส่งคำขอ HTTP POST ไปยัง LINE API
        const response = await axios.post('https://api.line.me/v2/bot/message/reply', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // แสดงผลลัพธ์
        console.log('Image replied successfully:', response.data);
    } catch (error) {
        console.error('Error replying image:', error.response ? error.response.data : error.message);
    }
}
module.exports = {
    reply_message,
    message_to_user,
    get_image,
    sendImage_to_prediction,
    sendimage_store_vercel, replyImage_and_msg_ToLine
};