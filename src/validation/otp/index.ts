import moment from "moment";

// Function to check if OTP has expired
export function isOTPExpired(otpCreatedAt:any, otpExpiryMinutes:number) {
  const currentTime = moment();
  const otpTime = moment(otpCreatedAt);
  console.log("cureent time --------->",currentTime)
  console.log("otpTime time --------->",otpTime)
  const otpExpiryTime = otpTime.add(otpExpiryMinutes, "minutes");
  console.log("otpExpiryTime time --------->",otpExpiryTime)

  return currentTime.isAfter(otpExpiryTime);
}

