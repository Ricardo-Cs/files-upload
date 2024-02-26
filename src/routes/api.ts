import { Router } from 'express';
import multer from 'multer';

import * as ApiController from '../controllers/apiController';

const router = Router();

// Caso seja preciso ter um controle maior sobre os arquivos que estão vindo, basta usar esse diskStorage, e adicionar ao multer no multer({ storage: storageConfig })
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp');
    },
    filename: (req, file, cb) => {
        let randomName = Math.floor(Math.random() * 9999999);
        cb(null, `${randomName + Date.now()}`);
    }
});
// Também existe o multer.memoryStorage(), onde o arquivo não é salvo em nenhum lugar e é apenas deixado na memória, eu apenas lido com ele da forma que desejo e após isso é apagado da memória.

const upload = multer({
    dest: './tmp',
    fileFilter: (req, file, cb) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

        cb(null, allowed.includes(file.mimetype));
    },
    limits: { fieldSize: 2000000 } // Em bytes
});

router.post('/register', ApiController.register);
router.post('/login', ApiController.login);

router.get('/list', ApiController.list);

// Upload de arquivo
router.post('/uploadSingle', upload.single('avatar'), ApiController.uploadSingle);
router.post('/uploadArray', upload.array('avatars', 10), ApiController.uploadArray); // Segundo parâmetro de upload.array é opcional. 
router.post('/uploadFields', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 3 }
]), ApiController.uploadFields);
// Array serve para fazer upload de múltiplos arquivos, mas do mesmo tipo, como um campo 'avatars' com 5 arquivos. 
// Fields serve para fazer upload de múltiplos arquivos diferentes, ou seja, um campo 'avatar' com 1 arquivo, e um campo 'gallery' com 3.

export default router;