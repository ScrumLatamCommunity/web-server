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
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(90deg, #ffffff 0%, #f25c44 100%);">
            <tr>
                <td>
                    <table width="600" cellpadding="0" cellspacing="0" style="margin: 40px auto; background-color: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <img src="cid:logo" alt="Scrum Latam Comunidad" style="width: 200px;">
                                
                                <h1 style="color: #1d3557; font-size: 32px; margin-bottom: 30px;">¡Bienvenido a Scrum<br>Latam Comunidad!<br> ${userName.toUpperCase()}</h1>
                                
                                <div style="padding: 30px;">
                                    <p style="color: #1d3557; font-weight: bold; margin-bottom: 20px; text-align: center;">¡Estamos emocionados de tenerte con nosotros!</p>
                                    
                                    <p style="color: #1d3557; font-weight: bold; margin-bottom: 20px; text-align: center;">Para comenzar tu experiencia, necesitamos que completes un breve proceso de onboarding. Este paso es escencial para personalizar tu experiencia en nuestra plataforma.</p>
                                    
                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="${url}" style="background-color: #f25c44; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">COMENZAR ONBOARDING</a>
                                    </div>
                                    
                                    <p style="color: #1d3557; font-weight: bold; margin-top: 30px; text-align: center;">Si no solicitaste el registro, escríbenos al centro de ayuda:<br>scrumlatam@gmail.com</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
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
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(90deg, #ffffff 0%, #f25c44 100%); font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; padding: 20px; text-align: center;">
            <img src="https://appwiseinnovations.dev/scrumlatam/scumlatam.png" alt="Scrum Latam Comunidad" style="width: 400px; height: 100px; margin-bottom: 30px;">
            
            <h1 style="color: #1d3557; font-size: 32px; margin-bottom: 30px;">¡Registro Completado!<br>${userName.toUpperCase()}</h1>
            
            <p style="color: #1d3557; font-weight: bold; margin-bottom: 20px;">¡Felicitaciones! Has completado exitosamente tu registro en Scrum Latam Comunidad</p>
            
            <p style="color: #1d3557; font-weight: bold; margin-bottom: 20px;">Ya puedes acceder a la plataforma utilizando tus credenciales</p>
            
            <div style="margin: 30px 0;">
                <a href="${url}" style="background-color: #f25c44; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">INICIAR SESIÓN</a>
            </div>

            <div style="background-color: rgba(29, 53, 87, 0.05); padding: 25px; border-radius: 15px; margin: 30px 0;">
                <h2 style="color: #1d3557; font-size: 24px; margin-bottom: 20px;">¡Tu KIT de Bienvenida está aquí! 🎉</h2>
                
                <p style="color: #1d3557; font-weight: bold; margin-bottom: 15px;">Adjunto a este correo encontrarás recursos exclusivos de la comunidad:</p>
                
                <ul style="list-style: none; padding: 0; margin: 0 0 20px 0; color: #1d3557;">
                    <li style="margin-bottom: 10px;">🎨 Fondos personalizados para tus reuniones virtuales</li>
                    <li style="margin-bottom: 10px;">🏷️ Logo oficial de Scrum Latam en alta calidad</li>
                </ul>

                <p style="color: #1d3557; font-weight: bold; margin-bottom: 15px;">¡Personaliza tu presencia en la comunidad!</p>
                <ul style="list-style: none; padding: 0; margin: 0 0 20px 0; color: #1d3557;">
                    <li style="margin-bottom: 10px;">👕 Imprime el logo en tu remera favorita</li>
                    <li style="margin-bottom: 10px;">🎯 Úsalo como fondo en tus presentaciones</li>
                    <li style="margin-bottom: 10px;">💻 Personaliza tu espacio de trabajo virtual</li>
                </ul>

                <p style="color: #1d3557; font-style: italic; margin-bottom: 15px;">¡Muestra con orgullo que eres parte de la comunidad Scrum Latam!</p>
            </div>
            
            <p style="color: #1d3557; font-weight: bold; margin-top: 30px;">¿Necesitas ayuda? Escríbenos al centro de ayuda:<br><a href="mailto:scrumlatam@gmail.com" style="color: #1d3557;">scrumlatam@gmail.com</a></p>
        </div>
    </body>
    </html>
    `,
  },
};
