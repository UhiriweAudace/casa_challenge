import multer from 'multer';
import path from 'path';
import fs from 'fs';

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = 'images' ;
        if(!fs.existsSync(path.resolve(destination))){
            fs.mkdirSync(path.resolve(destination), {recursive:true})
        }
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname.split(' ').join('_'));
    },
});

const fileFilter = (req, file, cb) => {
    const extensions = ['png', 'jpg','jpeg']
    const fileExt = file.mimetype.split(/[\/]/).pop()
    if (extensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export default multer({ storage: fileStorage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });
