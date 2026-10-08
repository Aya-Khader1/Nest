import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',

    filename: (req: Request, file: Express.Multer.File, callback: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.originalname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, callback: any) => {
    if (file.mimetype.match(/\/(jpg|png|pdf|jpeg)$/)) callback(null, true);
    else callback(new BadRequestException('Unsupported file format'), false);
  },
};
