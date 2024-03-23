import postmark from "postmark";

export async function sendLicenseEmail(email, license) {
    try {
        const mail = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

        const response = await mail.sendEmailWithTemplate({
            "From": process.env.POSTMARK_FROM_EMAIL,
            "To": email,
            "TemplateAlias": "thinkmachine-purchase-license",
            "TemplateModel": {
                "product_url": "https://thinkmachine.com",
                "product_name": "Think Machine",
                "company_name": "The Maximalist",
                "company_address": "123 The Maximalist Lane, Silicon Forest, OR 12345",
                "license": license,
            }
        });

        if (response.ErrorCode !== 0) {
            console.log("ERROR SENDING MAIL", response);
            return false;
        }

        if (response.Message !== "OK") {
            console.log("ERROR SENDING MAIL", response);
            return false;
        }

        console.log("EMAIL SENT");
        return true;
    } catch (e) {
        console.log("ERROR SENDING MAIL", e);
        return false;
    }
}
