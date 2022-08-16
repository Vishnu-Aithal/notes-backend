namespace NodeJS {
    interface ProcessEnv {
        TOKEN_SECRET: string;
        MONGO_PASSWORD: string;
        MONGO_URL: string;
    }
}
declare namespace Express {
    import { UserModelType } from "./Models/User";

    export interface Request {
        user: UserModelType;
    }
}
namespace globalThis {
    interface Error {
        statusCode?: number;
    }
}
