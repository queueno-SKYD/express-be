const moment = require("moment");

// Function to check if OTP has expired
function isOTPExpired(otpCreatedAt, otpExpiryMinutes) {
  const currentTime = moment();
  const otpTime = moment(otpCreatedAt);
  console.log("cureent time --------->",currentTime)
  console.log("otpTime time --------->",otpTime)
  const otpExpiryTime = otpTime.add(otpExpiryMinutes, "minutes");
  console.log("otpExpiryTime time --------->",otpExpiryTime)

  return currentTime.isAfter(otpExpiryTime);
}

console.log("time --------> ", isOTPExpired("2024-02-24 16:36:39", 3));
