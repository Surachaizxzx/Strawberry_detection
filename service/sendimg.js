import { put } from "@vercel/blob";
import getRawBody from 'raw-body';
const sendimg = async (req, res) => {
    try {
        const imageBuffer = await getRawBody(req);
        const url_image = await uploadImage(imageBuffer);
        return res.json({ url: url_image });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งรูปภาพไปเก็บ:', error);
        // ส่งสถานะการตอบกลับเป็น 500 (Internal Server Error)
        return res.sendStatus(500);
    }
}

// ฟังก์ชันสำหรับอัปโหลดรูปภาพ
async function uploadImage(imageBuffer) {
    try {
        // อัปโหลดรูปภาพไปยัง Blob Storage ภายใต้โฟลเดอร์ 'predection'
        const { url } = await put('predection/photo.jpg', imageBuffer, { access: 'public' });

        // แสดง URL ของรูปภาพที่อัปโหลดสำเร็จ
        console.log('รูปภาพถูกอัปโหลดไปที่:', url);
        return url;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:', error);
        throw error; // ขว้างข้อผิดพลาดให้ฟังก์ชันต้นทางรับรู้
    }
}

module.exports = sendimg;
