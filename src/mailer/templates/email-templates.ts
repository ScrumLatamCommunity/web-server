export enum EmailTemplateType {
  WELCOME_REGISTER = 'WELCOME_REGISTER',
  COMPLETED_REGISTER = 'COMPLETED_REGISTER',
  // Aquí puedes agregar más tipos de templates
}

interface EmailTemplate {
  subject: string;
  template: (params: { userName: string; url?: string }) => string;
}

export const emailTemplates: Record<EmailTemplateType, EmailTemplate> = {
  [EmailTemplateType.WELCOME_REGISTER]: {
    subject: '¡Bienvenido a Scrum Latam! - Completa tu Onboarding',
    template: ({ userName, url }) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a Scrum Latam Comunidad</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background: rgb(255,255,255);
                background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(242,92,68,1) 100%);
                font-family: Arial, sans-serif;
            }
        </style>
    </head>
    <body>
        <div style="max-width: 600px; margin: 40px auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://firebasestorage.googleapis.com/v0/b/scrum-latam-imgs.appspot.com/o/navbar%2FScrum%20logo%20principal.svg?alt=media&token=d8cce1e3-c821-4e52-9596-289f17c63203" alt="Scrum Latam Comunidad" style="width: 200px;">
            </div>
            <h1 style="color: #1d3557; font-size: 32px; text-align: center; margin-bottom: 30px;">¡Bienvenido a Scrum<br>Latam Comunidad!<br> ${userName.toUpperCase()}</h1>
            <div style=" padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                <p style="color: #1d3557; font-weight: bold; margin-bottom: 20px; text-align: center;">¡Estamos emocionados de tenerte con nosotros!</p>
                <p style="color: #1d3557; font-weight: bold; margin-bottom: 20px; text-align: center;">Para comenzar tu experiencia, necesitamos que completes un breve proceso de onboarding. Este paso es escencial para personalizar tu experiencia en nuestra plataforma.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background-color: #f25c44; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">COMENZAR ONBOARDING</a>
                </div>
                <p style="color: #1d3557; font-weight: bold; margin-top: 30px; text-align: center;">Si no solicitaste el registro, escríbenos al centro de ayuda:<br>scrumlatam@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
    `,
  },
  [EmailTemplateType.COMPLETED_REGISTER]: {
    subject: '¡Registro Completado con Éxito! - Scrum Latam',
    template: ({ userName, url }) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registro Completado - Scrum Latam Comunidad</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background: rgb(255,255,255);
                background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(242,92,68,1) 100%);
                font-family: Arial, sans-serif;
            }
        </style>
    </head>
    <body>
        <div style="max-width: 600px; margin: 40px auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://firebasestorage.googleapis.com/v0/b/scrum-latam-imgs.appspot.com/o/navbar%2FScrum%20logo%20principal.svg?alt=media&token=d8cce1e3-c821-4e52-9596-289f17c63203" alt="Scrum Latam Comunidad" style="width: 200px;">
            </div>
            <h1 style="color: #1d3557; font-size: 32px; text-align: center; margin-bottom: 30px;">¡Registro Completado!<br>${userName.toUpperCase()}</h1>
            <div style="padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                <p style="color: #1d3557; font-weight: bold; margin-bottom: 20px; text-align: center;">¡Felicitaciones! Has completado exitosamente tu registro en Scrum Latam Comunidad</p>
                <p style="color: #1d3557; font-weight: bold; margin-bottom: 20px; text-align: center;">Ya puedes acceder a la plataforma utilizando tus credenciales</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background-color: #f25c44; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">INICIAR SESIÓN</a>
                </div>
                <p style="color: #1d3557; font-weight: bold; margin-top: 30px; text-align: center;">¿Necesitas ayuda? Escríbenos al centro de ayuda:<br>scrumlatam@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
    `,
  },
};
