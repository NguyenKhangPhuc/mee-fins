import { formatToUserTimezone } from "../timezone-formatter";

interface BookedEmailInterface {
  slotTitle: string,
  ownerName: string,
  exchangeUserName: string,
  duration: number,
  startTime: string,
  endTime: string,
  provideLang: string,
  exchangeLang: string
}

/**
 * Generates a responsive HTML email template notifying slot owner that their slot has been booked.
 * Supports both object payload and positional arguments.
 */
export const getSlotBookedEmailTemplate = (
  { slotTitle, ownerName, exchangeUserName, duration, startTime, endTime, provideLang, exchangeLang }: BookedEmailInterface
): string => {


  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Encoding" content="IE=edge">
  <title>Slot Booked Notification</title>
  <style>
    /* Reset styles */
    body, p, h1, h2, h3, div, td {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #f4ebe4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #61514d;
      line-height: 1.6;
    }
    /* Mobile responsive overrides */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 16px 12px !important;
      }
      .card-body {
        padding: 24px 18px !important;
      }
      .detail-row {
        flex-direction: column !important;
      }
    }
  </style>
</head>
<body style="background-color: #f4ebe4; margin: 0; padding: 24px 0;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; padding: 20px;">
          
          <!-- Header Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #82301c; color: #ffffff; font-weight: 700; font-size: 20px; padding: 10px 20px; border-radius: 12px; letter-spacing: 0.5px;">
                    MeeFins
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fcf7f3; border: 1px solid #dfccc1; border-radius: 16px; box-shadow: 0 10px 25px rgba(130, 48, 28, 0.05); overflow: hidden;">
                <tr>
                  <td class="card-body" style="padding: 36px 32px;">
                    <!-- Greeting -->
                    <h1 style="color: #291e1b; font-size: 22px; font-weight: 700; margin-bottom: 12px; line-height: 1.3;">
                      Hi ${ownerName},
                    </h1>
                    
                    <p style="color: #61514d; font-size: 15px; margin-bottom: 24px;">
                      Great news! Your slot <strong style="color: #291e1b;">"${slotTitle}"</strong> has been booked by <strong style="color: #82301c;">${exchangeUserName}</strong>.
                    </p>

                    <!-- Slot Details Box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffdfb; border: 1px solid #dfccc1; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <tr>
                        <td>
                          <h2 style="color: #82301c; font-size: 16px; font-weight: 700; margin-bottom: 16px; border-bottom: 1px dashed #dfccc1; padding-bottom: 8px;">
                            Slot Session Details
                          </h2>

                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #61514d;">
                            <tr>
                              <td style="padding: 6px 0; font-weight: 600; width: 140px; color: #291e1b;">Title:</td>
                              <td style="padding: 6px 0;">${slotTitle}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-weight: 600; color: #291e1b;">Booked By:</td>
                              <td style="padding: 6px 0; color: #82301c; font-weight: 600;">${exchangeUserName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-weight: 600; color: #291e1b;">You Teach:</td>
                              <td style="padding: 6px 0;">${provideLang}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-weight: 600; color: #291e1b;">You Learn:</td>
                              <td style="padding: 6px 0;">${exchangeLang}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-weight: 600; color: #291e1b;">Start Time:</td>
                              <td style="padding: 6px 0;">${startTime}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-weight: 600; color: #291e1b;">End Time:</td>
                              <td style="padding: 6px 0;">${endTime}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-weight: 600; color: #291e1b;">Duration:</td>
                              <td style="padding: 6px 0;">${duration} minutes</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #9c8c87; font-size: 13px; line-height: 1.5;">
                      Please log in to MeeFins at the scheduled time to start your language exchange room.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 24px; color: #9c8c87; font-size: 12px; line-height: 1.5;">
              <p style="margin-bottom: 4px;">Thank you for using MeeFins to learn and share languages!</p>
              <p>© MeeFins. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export default getSlotBookedEmailTemplate;
