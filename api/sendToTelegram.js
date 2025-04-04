const { createReadStream } = require('fs');
const { Readable } = require('stream');
const FormData = require('form-data');
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { botToken, chatId, caption, fileData, fileName } = req.body;

    // تحويل البيانات إلى Stream
    const fileStream = new Readable();
    fileStream.push(Buffer.from(fileData, 'base64'));
    fileStream.push(null);

    // إنشاء FormData
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('document', fileStream, fileName);
    form.append('caption', caption);

    // إرسال إلى التليجرام
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      form,
      {
        headers: form.getHeaders()
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    res.status(500).json({ error: 'Failed to send to Telegram' });
  }
};
