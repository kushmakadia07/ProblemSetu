import { NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var __problemSetuOtpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}

if (!global.__problemSetuOtpStore) {
  global.__problemSetuOtpStore = new Map();
}
const otpStore = global.__problemSetuOtpStore;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const aadhaar = String(body.aadhaar || "").replace(/\D/g, "");

    // 1. Aadhaar: accepts any 12-digit number (independent from phone)
    if (aadhaar.length !== 12) {
      return NextResponse.json(
        { success: false, error: "Aadhaar Card number must be exactly 12 digits." },
        { status: 400 }
      );
    }

    // 2. Phone validation: valid 10-digit Indian mobile number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.",
        },
        { status: 400 }
      );
    }

    let smsSent = false;
    let twilioError: string | null = null;

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioVerifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

    // Try Twilio Verify API first for real SMS delivery
    if (twilioSid && twilioAuthToken && twilioVerifySid) {
      try {
        const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");
        const verifyRes = await fetch(
          `https://verify.twilio.com/v2/Services/${twilioVerifySid}/Verifications`,
          {
            method: "POST",
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              To: `+91${phone}`,
              Channel: "sms",
            }).toString(),
          }
        );

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && (verifyData.status === "pending" || verifyData.status === "approved")) {
          smsSent = true;
          console.log(`[OTP SERVICE] Real SMS dispatched via Twilio Verify to +91 ${phone}`);
        } else {
          twilioError = verifyData.message || "Twilio verification request failed.";
          console.warn("[OTP SERVICE] Twilio Verify response error:", verifyData);
        }
      } catch (err: any) {
        twilioError = err.message || "Network error reaching Twilio.";
        console.warn("[OTP SERVICE] Twilio fetch error:", err);
      }
    }

    // Fallback in-memory generated OTP for testing
    const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(phone, { otp: fallbackOtp, expiresAt });

    console.log(`=========================================`);
    console.log(`[OTP SERVICE] Mobile: +91 ${phone}`);
    console.log(`[OTP SERVICE] SMS Sent to handset: ${smsSent}`);
    console.log(`[OTP SERVICE] Fallback / Demo OTP: ${fallbackOtp}`);
    console.log(`=========================================`);

    return NextResponse.json({
      success: true,
      phone,
      smsSent,
      otp: smsSent ? undefined : fallbackOtp,
      expiresInSeconds: 300,
      message: smsSent
        ? `SMS OTP has been sent to +91 ${phone}. Please check your phone messages.`
        : `OTP generated for +91 ${phone}. (Demo test code 123456 is active).`,
      errorDetail: twilioError,
    });
  } catch (err: any) {
    console.error("[OTP SERVICE ERROR]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error while sending OTP." },
      { status: 500 }
    );
  }
}
