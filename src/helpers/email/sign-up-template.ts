export interface SignUpEmailTemplateParams {
  displayName: string;
  code: string;
}

/**
 * Generates a responsive HTML email template for sign-up verification code.
 * Styled based on theme tokens:
 * - Primary accent: #82301c
 * - Page background: #f4ebe4
 * - Card background: #fcf7f3
 * - Input/Code background: #fffdfb
 * - Text colors: #291e1b (dark), #61514d (secondary), #9c8c87 (muted)
 * - Border color: #dfccc1
 */
export const getSignUpEmailTemplate = (displayName: string, code: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Encoding" content="IE=edge">
  <title>Sign-up Verification Code</title>
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
      .code-box {
        font-size: 28px !important;
        letter-spacing: 6px !important;
        padding: 16px 12px !important;
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
                      Hi ${displayName},
                    </h1>
                    
                    <p style="color: #61514d; font-size: 15px; margin-bottom: 24px;">
                      Thank you for signing up! Please use the verification code below to complete your registration:
                    </p>

                    <!-- Code Display Box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td align="center" class="code-box" style="background-color: #fffdfb; border: 2px dashed #dfccc1; border-radius: 12px; padding: 20px; color: #82301c; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center;">
                          ${code}
                        </td>
                      </tr>
                    </table>

                    <p style="color: #61514d; font-size: 14px; margin-bottom: 8px;">
                      This code is valid for <strong>10 minutes</strong>.
                    </p>
                    <p style="color: #9c8c87; font-size: 13px; line-height: 1.5;">
                      For security reasons, please do not share this verification code with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 24px; color: #9c8c87; font-size: 12px; line-height: 1.5;">
              <p style="margin-bottom: 4px;">If you did not request this sign-up verification code, please ignore this email.</p>
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

export default getSignUpEmailTemplate;
