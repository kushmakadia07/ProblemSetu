import { NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var __problemSetuOtpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const otp = String(body.otp || "").trim();

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { verified: false, error: "Invalid mobile number provided." },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { verified: false, error: "Please enter the OTP code." },
        { status: 400 }
      );
    }

    // Always accept universal test codes for immediate fail-safe testing
    if (otp === "123456" || otp === "12345") {
      return NextResponse.json({
        verified: true,
        message: "OTP successfully verified (demo bypass).",
      });
    }

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioVerifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

    // Verify using Twilio Verify API if configured
    if (twilioSid && twilioAuthToken && twilioVerifySid) {
      try {
        const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");
        const checkRes = await fetch(
          `https://verify.twilio.com/v2/Services/${twilioVerifySid}/VerificationCheck`,
          {
            method: "POST",
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              To: `+91${phone}`,
              Code: otp,
            }).toString(),
          }
        );

        const checkData = await checkRes.json();
        if (checkRes.ok && checkData.status === "approved") {
          return NextResponse.json({
            verified: true,
            message: "Phone number successfully verified with Twilio OTP.",
          });
        } else if (checkRes.ok && checkData.status !== "approved") {
          // If Twilio explicitly says invalid, check fallback code or return error
          console.warn("[VERIFY OTP] Twilio check status:", checkData.status);
        }
      } catch (twilioErr) {
        console.warn("[VERIFY OTP] Twilio verify API error, checking local store:", twilioErr);
      }
    }

    // Check local store fallback
    const otpStore = global.__problemSetuOtpStore;
    const record = otpStore?.get(phone);

    if (record && Date.now() <= record.expiresAt && record.otp === otp) {
      otpStore?.delete(phone);
      return NextResponse.json({
        verified: true,
        message: "Phone number successfully verified with OTP.",
      });
    }

    return NextResponse.json(
      {
        verified: false,
        error: "Incorrect OTP code. Please enter the OTP code sent to your phone or demo code 123456.",
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("[VERIFY OTP ERROR]", err);
    return NextResponse.json(
      { verified: false, error: "Failed to verify OTP due to a server error." },
      { status: 500 }
    );
  }
}
