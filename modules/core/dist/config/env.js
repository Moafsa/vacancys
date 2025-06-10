"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    POSTMARK_API_TOKEN: zod_1.z.string(),
    POSTMARK_FROM_EMAIL: zod_1.z.string().email(),
    POSTMARK_TEMPLATES: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
});
const parsedEnv = envSchema.safeParse({
    POSTMARK_API_TOKEN: process.env.POSTMARK_API_TOKEN,
    POSTMARK_FROM_EMAIL: process.env.POSTMARK_FROM_EMAIL,
    POSTMARK_TEMPLATES: process.env.POSTMARK_TEMPLATES ?
        JSON.parse(process.env.POSTMARK_TEMPLATES) : {},
});
if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    throw new Error('Invalid environment variables');
}
exports.env = parsedEnv.data;
//# sourceMappingURL=env.js.map