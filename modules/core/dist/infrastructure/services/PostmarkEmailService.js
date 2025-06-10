"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostmarkEmailService = void 0;
const postmark_1 = require("postmark");
const PostmarkConfigValidator_1 = require("../config/PostmarkConfigValidator");
class PostmarkEmailService {
    constructor() {
        PostmarkConfigValidator_1.PostmarkConfigValidator.validate();
        this.client = new postmark_1.ServerClient(process.env.POSTMARK_API_TOKEN);
    }
    async sendTemplatedEmail(to, templateAlias, templateData) {
        try {
            const templateId = PostmarkConfigValidator_1.PostmarkConfigValidator.getTemplateId(templateAlias);
            await this.client.sendEmailWithTemplate({
                From: process.env.POSTMARK_FROM_EMAIL,
                To: to,
                TemplateId: templateId,
                TemplateModel: templateData
            });
        }
        catch (error) {
            throw new Error(`Failed to send template email: ${error.message}`);
        }
    }
    async sendEmail(to, subject, htmlBody) {
        try {
            await this.client.sendEmail({
                From: process.env.POSTMARK_FROM_EMAIL,
                To: to,
                Subject: subject,
                HtmlBody: htmlBody
            });
        }
        catch (error) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}
exports.PostmarkEmailService = PostmarkEmailService;
//# sourceMappingURL=PostmarkEmailService.js.map