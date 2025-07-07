interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}

interface CalendarLinks {
  google: string;
  outlook: string;
  apple: string;
}

export class CalendarLinksUtil {
  static generateCalendarLinks(event: CalendarEvent): CalendarLinks {
    const { title, description, startDate, endDate, location = '' } = event;

    // Formatear fechas para diferentes calendarios
    const formatDateForGoogle = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const formatDateForOutlook = (date: Date): string => {
      return date.toISOString();
    };

    // Google Calendar
    const googleParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
      details: description,
      location: location,
    });
    const googleLink = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;

    // Outlook Calendar
    const outlookParams = new URLSearchParams({
      subject: title,
      body: description,
      startdt: formatDateForOutlook(startDate),
      enddt: formatDateForOutlook(endDate),
      location: location,
    });
    const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`;

    // Apple Calendar (ICS format)
    const appleLink = this.generateICSLink(event);

    return {
      google: googleLink,
      outlook: outlookLink,
      apple: appleLink,
    };
  }

  private static generateICSLink(event: CalendarEvent): string {
    const { title, description, startDate, endDate, location = '' } = event;

    const formatDateForICS = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Scrum Latam//Activity Registration//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateForICS(startDate)}`,
      `DTEND:${formatDateForICS(endDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `UID:${Date.now()}@scrumlatam.com`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    // Crear data URL para el archivo ICS
    const dataUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
    return dataUrl;
  }

  static formatActivityTime(timeArray: string[]): string {
    if (timeArray.length === 0) return 'Hora por confirmar';
    if (timeArray.length === 1) return timeArray[0];
    if (timeArray.length === 2) return `${timeArray[0]} - ${timeArray[1]}`;
    return `${timeArray[0]} - ${timeArray[timeArray.length - 1]}`;
  }

  static formatActivityDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
