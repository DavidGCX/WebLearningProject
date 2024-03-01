const { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `WebEmailTest <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			return 1;
		}
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(template, subject) {
		const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject,
		});

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html),
		};

		await this.newTransport().sendMail(mailOptions);
	}

	// Send the welcome email
	async sendWelcome() {
		await this.send('welcome', 'Welcome to the Natours Family!');
	}

	async sendPasswordReset() {
		await this.send(
			'passwordReset',
			'Your password reset token (valid for only 10 minutes)',
		);
	}
};
