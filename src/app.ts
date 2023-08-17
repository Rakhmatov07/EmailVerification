import 'dotenv/config';
import express, { Application } from "express";
const app: Application = express();
import { connect } from "mongoose";
import routes from './routes';
import Redis from "ioredis";


export const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
});

const bootstrap = async(): Promise<void> => {
    await connect('mongodb://127.0.0.1:27017/sample');

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(routes);

    app.listen(process.env.PORT, (): void => {
        console.log(`Server is listening on port: ${process.env.PORT}`);
    })
};

bootstrap();

