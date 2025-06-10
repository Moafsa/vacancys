"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostmarkConfigValidator = void 0;
const zod_1 = require("zod");
class PostmarkConfigValidator {
    static validate() {
        try {
            PostmarkConfigValidator.schema.parse({
                POSTMARK_API_TOKEN: process.env.POSTMARK_API_TOKEN,
                POSTMARK_FROM_EMAIL: process.env.POSTMARK_FROM_EMAIL,
                POSTMARK_TEMPLATES: process.env.POSTMARK_TEMPLATES
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const issues = error.issues.map(issue => `- ${issue.path.join('.')}: ${issue.message}`).join('\n');
                throw new Error(`Invalid Postmark configuration:\n${issues}`);
            }
            throw error;
        }
    }
    static getTemplateId(alias) {
        try {
            const templates = JSON.parse(process.env.POSTMARK_TEMPLATES || '{}');
            const templateId = templates[alias];
            if (!templateId) {
                throw new Error(`Template ID not found for alias: ${alias}`);
            }
            const numericId = Number(templateId);
            if (isNaN(numericId)) {
                throw new Error(`Invalid template ID format for alias ${alias}: expected a number but got ${templateId}`);
            }
            return numericId;
        }
        catch (error) {
            throw new Error(`Failed to get template ID: ${error.message}`);
        }
    }
}
exports.PostmarkConfigValidator = PostmarkConfigValidator;
PostmarkConfigValidator.templateSchema = zod_1.z.record(zod_1.z.string());
PostmarkConfigValidator.schema = zod_1.z.object({
    POSTMARK_API_TOKEN: zod_1.z.string().min(1, 'Postmark API token is required'),
    POSTMARK_FROM_EMAIL: zod_1.z.string().email('Invalid sender email address'),
    POSTMARK_TEMPLATES: zod_1.z.string().transform((str, ctx) => {
        try {
            const parsed = JSON.parse(str);
            return PostmarkConfigValidator.templateSchema.parse(parsed);
        }
        catch (error) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Invalid JSON format for template mapping'
            });
            return zod_1.z.NEVER;
        }
    })
});
//# sourceMappingURL=PostmarkConfigValidator.js.map