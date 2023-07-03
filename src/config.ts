import 'dotenv/config';

type configType = {
    PORT: string;
    RUNNING_MODE: string | undefined;
}

export default {
    PORT: process.env.PORT,
    RUNNING_MODE: process.env.mode
} as configType;
