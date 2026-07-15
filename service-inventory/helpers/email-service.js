import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_ENABLE_SSL === 'true',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    async sendEmailVerification(email, username, token) {
        const verificationUrl = `http://localhost:5173/verify-email?token=${token}`;

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Verifica tu correo electrónico',
            html: `
                <h1>¡Bienvenido, ${username}!</h1>
                <p>Gracias por registrarte. Por favor verifica tu correo haciendo clic en el siguiente enlace:</p>
                <a href="${verificationUrl}" style="padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Verificar Email</a>
                <p>Este enlace expira en 24 horas.</p>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendPasswordReset(email, username, token) {
        const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
                <h1>Hola, ${username}</h1>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
                <a href="${resetUrl}" style="padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                <p>Este enlace expira en 1 hora.</p>
                <p>Si no solicitaste esto, ignora este mensaje.</p>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendWelcomeEmail(email, username) {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: '¡Bienvenido!',
            html: `
                <h1>¡Bienvenido, ${username}!</h1>
                <p>Tu cuenta ha sido verificada exitosamente.</p>
                <p>Ya puedes iniciar sesión y disfrutar de nuestros servicios.</p>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }
}

export const emailService = new EmailService();
