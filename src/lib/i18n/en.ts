const en = {
    // Home page
    "home.connecting": "Connecting to server...",
    "home.connected": "Connected",
    "home.disconnected": "Disconnected — reconnecting...",
    "home.blockageStatus": "BLOCKAGE STATUS",
    "home.waterLevelStatus": "WATER LEVEL STATUS",
    "home.weatherCondition": "WEATHER CONDITION",
    "home.clear": "Clear",
    "home.blocked": "Blocked",
    "home.changeRate": "Change Rate",
    "home.toWarning": "To Warning",
    "home.toCritical": "To Critical",
    "home.aboveCritical": "Above Critical",
    "home.cmRemaining": "cm remaining",
    "home.cmOver": "cm over",
    "home.precipitation": "Precipitation",
    "home.lastUpdated": "Last Updated",
    "home.waterLevelTrend": "WATER LEVEL TREND (24H)",

    // Alerts page
    "alerts.noAlerts": "No alerts",
    "alerts.allCaughtUp":
        "You're all caught up! New critical alerts, warnings, and announcements will appear here.",
    "alerts.noAlertsOfType":
        "No alerts of this type. Try changing the filter to see more alerts.",
    "alerts.fetchError": "Failed to fetch alerts. Please try again.",
    "alerts.acknowledged": "Acknowledged",
    "alerts.unacknowledged": "Unacknowledged",
    "alerts.pendingAcknowledgement": "PENDING ACKNOWLEDGEMENT",
    "alerts.leaveMessage": "Leave a message (optional)",
    "alerts.acknowledge": "Acknowledge",
    "alerts.placeholder": "Enter optional acknowledgment message...",
    "alerts.notes": "NOTES",
    "alerts.all": "All",
    "alerts.critical": "Critical",
    "alerts.warning": "Warning",
    "alerts.announcement": "Announcement",
    "alerts.loading": "Loading...",
    "alerts.loadMore": "Load more",

    // Profile page
    "profile.responderProfile": "RESPONDER PROFILE",
    "profile.online": "Online",
    "profile.offline": "Offline",
    "profile.connecting": "Connecting",
    "profile.reconnect": "Reconnect",
    "profile.pushNotifications": "PUSH NOTIFICATIONS",
    "profile.warningAlerts": "Warning Alerts",
    "profile.criticalAlerts": "Critical Alerts",
    "profile.blockageDetections": "Blockage Detections",
    "profile.announcements": "Announcements",
    "profile.language": "LANGUAGE",
    "profile.appearance": "APPEARANCE",
    "profile.light": "Light",
    "profile.dark": "Dark",
    "profile.system": "System",
    "profile.account": "ACCOUNT",
    "profile.registered": "Registered",
    "profile.activated": "Activated",
    "profile.assignedSite": "Assigned Site",
    "profile.logout": "Logout",
    "profile.prefError": "Failed to fetch notification preferences",

    // Verify page
    "verify.activateAccount": "Activate Your Account",
    "verify.activateSubtitle":
        "Enter your registered mobile number to receive your access code",
    "verify.mobileNumber": "Mobile Number",
    "verify.fullNumber": "Full number:",
    "verify.continue": "Continue",
    "verify.enterCode": "Enter Verification Code",
    "verify.enterCodeSubtitle":
        "We sent a 6-digit code to your phone number. Enter it below to verify your account.",
    "verify.verifying": "Verifying...",
    "verify.didntReceive": "Didn't receive the code?",
    "verify.resend": "Resend",
    "verify.sending": "Sending...",
    "verify.sendNewCode": "Send new code",
    "verify.newCodeSent": "A new verification code has been sent.",
    "verify.agreement":
        "By verifying, you agree to receive emergency SMS alerts from AGOS Flood Monitoring System.",

    // Navigation
    "nav.home": "Home",
    "nav.alerts": "Alerts",
    "nav.profile": "Profile",
} as const;

export type TranslationKey = keyof typeof en;
export default en;
