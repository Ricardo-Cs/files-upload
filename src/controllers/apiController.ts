import { Request, Response } from 'express';
import sharp from 'sharp';
import { unlink } from 'fs/promises';

export const uploadSingle = async (req: Request, res: Response) => {
    if (req.file) {
        const filename: string = `${req.file.filename}.jpg`
        await sharp(req.file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .toFile(`./public/media/${filename}`);

        await unlink(req.file.path);

        res.json({ image: filename });
    } else {
        res.status(400);
        res.json({ error: 'Arquivo inválido' })
    }


    // console.log('Arquivo: ', req.file);
    // res.json('Sucesso');
}

export const uploadArray = async (req: Request, res: Response) => {
    console.log('Arquivos:', req.files);
    res.json('Sucesso');
}

export const uploadFields = async (req: Request, res: Response) => {
    // Caso esse type não seja criado, o typescript acusará erro, pois não encontraria nenhum tipo após o req.files.
    // req.files as { [fieldname: string ]: Express.Multer.File[] } também funcionaria, porém, o tipo não estaria bem definido, qualquer coisa vinda depois de req.file seria aceita.
    type UploadTypes = {
        avatar: Express.Multer.File[],
        gallery: Express.Multer.File[]
    }
    const files = req.files as UploadTypes;

    console.log('Avatar: ', files.avatar);
    console.log('Gallery: ', files.gallery);
    res.json('Sucesso');
}