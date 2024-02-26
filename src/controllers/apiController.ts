import { Request, Response } from 'express';
import { User } from '../models/User';
import sharp from 'sharp';

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}

export const register = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
        let { email, password } = req.body;

        let hasUser = await User.findOne({ where: { email } });
        if (!hasUser) {
            let newUser = await User.create({ email, password });

            res.status(201);
            res.json({ id: newUser.id });
        } else {
            res.json({ error: 'E-mail já existe.' });
        }
    }

    res.json({ error: 'E-mail e/ou senha não enviados.' });
}

export const login = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({
            where: { email, password }
        });

        if (user) {
            res.json({ status: true });
            return;
        }
    }

    res.json({ status: false });
}

export const list = async (req: Request, res: Response) => {
    let users = await User.findAll();
    let list: string[] = [];

    for (let i in users) {
        list.push(users[i].email);
    }

    res.json({ list });
}

export const uploadSingle = async (req: Request, res: Response) => {
    if (req.file) {
        await sharp(req.file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .toFile(`./public/media/${req.file.filename}.jpg`);

        res.json({ image: `${req.file.filename}.jpg` });
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