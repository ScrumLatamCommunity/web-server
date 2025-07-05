export enum EmailTemplateType {
  WELCOME_REGISTER = 'WELCOME_REGISTER',
  COMPLETED_REGISTER = 'COMPLETED_REGISTER',
  ACTIVITY_REGISTRATION = 'ACTIVITY_REGISTRATION',
  // Aquí puedes agregar más tipos de templates
}

interface EmailTemplate {
  subject: string;
  template: (params: any) => string;
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
  [EmailTemplateType.ACTIVITY_REGISTRATION]: {
    subject: '¡Confirmación de Registro! - {{activityTitle}}',
    template: ({
      userName,
      activityTitle,
      activityDescription,
      activityDate,
      activityTime,
      activityLink,
      userProfileUrl,
      calendarLinks,
    }) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Registro - ${activityTitle}</title>
        <style>
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
                .content { padding: 10px !important; }
                .button { width: 100% !important; display: block !important; }
                .calendar-buttons { flex-direction: column !important; }
                .calendar-button { width: 100% !important; margin: 5px 0 !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(90deg, #ffffff 0%, #f25c44 100%); font-family: Arial, sans-serif;">
        <div class="container" style="max-width: 600px; margin: 40px auto; padding: 20px; text-align: center;">
            
            <!-- Header -->
            <div style="background-color: white; border-radius: 10px 10px 0 0; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <img src="https://appwiseinnovations.dev/scrumlatam/scumlatam.png" alt="Scrum Latam Comunidad" style="width: 300px; height: auto; margin-bottom: 20px;">
                
                <h1 style="color: #1d3557; font-size: 28px; margin-bottom: 10px;">¡Registro Confirmado! 🎉</h1>
                <p style="color: #1d3557; font-size: 18px; margin-bottom: 0;">Hola ${userName},</p>
            </div>
            
            <!-- Activity Details -->
            <div style="background-color: white; padding: 30px; border-left: 4px solid #f25c44;">
                <h2 style="color: #1d3557; font-size: 24px; margin-bottom: 20px;">${activityTitle}</h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
                    <p style="color: #1d3557; margin-bottom: 10px;"><strong>📅 Fecha:</strong> ${activityDate}</p>
                    <p style="color: #1d3557; margin-bottom: 10px;"><strong>🕐 Hora:</strong> ${activityTime}</p>
                    <p style="color: #1d3557; margin-bottom: 10px;"><strong>📋 Descripción:</strong> ${activityDescription}</p>
                    <p style="color: #1d3557; margin-bottom: 0;"><strong>🔗 Enlace de acceso:</strong> <a href="${activityLink}" style="color: #f25c44; text-decoration: none;">${activityLink}</a></p>
                </div>
                
                <!-- Calendar Buttons -->
                <div style="margin: 25px 0;">
                    <h3 style="color: #1d3557; font-size: 18px; margin-bottom: 15px;">📅 Agregar a tu Calendario</h3>
                    <div class="calendar-buttons" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                        <a href="${calendarLinks.google}" class="calendar-button" style="background-color: #4285f4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px;">📅 Google Calendar</a>
                        <a href="${calendarLinks.outlook}" class="calendar-button" style="background-color: #0078d4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px;">📅 Outlook</a>
                        <a href="${calendarLinks.apple}" class="calendar-button" style="background-color: #333; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px;">📅 Apple Calendar</a>
                    </div>
                </div>
                
                <!-- Access Link -->
                <div style="margin: 25px 0;">
                    <h3 style="color: #1d3557; font-size: 18px; margin-bottom: 15px;">🎯 Acceso Directo al Evento</h3>
                    <a href="${activityLink}" class="button" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin-bottom: 10px;">🚀 Unirse al Evento</a>
                </div>
                
                <!-- Profile Link -->
                <div style="margin: 25px 0;">
                    <h3 style="color: #1d3557; font-size: 18px; margin-bottom: 15px;">👤 Gestionar Mis Actividades</h3>
                    <p style="color: #666; margin-bottom: 15px;">Ve a tu perfil para gestionar todas tus actividades registradas.</p>
                    <a href="${userProfileUrl}" class="button" style="background-color: #f25c44; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Ver Mi Perfil</a>
                </div>
            </div>
            
            <!-- Important Info -->
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #856404; font-size: 16px; margin-bottom: 10px;">ℹ️ Información Importante</h3>
                <ul style="color: #856404; text-align: left; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 5px;">Guarda el enlace de acceso para el día del evento</li>
                    <li style="margin-bottom: 5px;">Te recomendamos conectarte 5 minutos antes</li>
                    <li style="margin-bottom: 5px;">Si tienes problemas técnicos, contacta al soporte</li>
                    <li style="margin-bottom: 5px;">Puedes agregar el evento a tu calendario usando los botones de arriba</li>
                </ul>
            </div>
            
            <!-- Footer -->
            <div style="background-color: white; border-radius: 0 0 10px 10px; padding: 30px; text-align: center;">
                <p style="color: #666; margin-bottom: 15px;">¿Necesitas ayuda o tienes preguntas?</p>
                <p style="color: #1d3557; font-weight: bold;">
                    📧 <a href="mailto:scrumlatam@gmail.com" style="color: #1d3557;">scrumlatam@gmail.com</a>
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                
                <p style="color: #999; font-size: 12px; margin: 0;">
                    © 2024 Scrum Latam Comunidad. Todos los derechos reservados.<br>
                    Este correo fue enviado porque te registraste en una actividad.
                </p>
            </div>
        </div>
    </body>
    </html>
    `,
  },
};
