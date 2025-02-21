import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(), // เปลี่ยนเป็น memoryStorage
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            cb(new Error('รองรับเฉพาะไฟล์ PDF เท่านั้น'), false)
        }
    }
})

export default upload