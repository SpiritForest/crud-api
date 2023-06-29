import 'dotenv/config';

type configType = {
    PORT: string;
}

export default {
    PORT: process.env.PORT,
} as configType;
