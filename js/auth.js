/* ==========================================================================
   ANANYA PIGMENT ATELIER · ANDHRA - CLIENT AUTHENTICATION MODULE
   ========================================================================== */

const DEMO_CLIENT = {
  id: "AS-CLIENT-8821",
  name: "Alia Sharma",
  email: "alia.sharma@example.com",
  phone: "+91 98450 12345",
  avatar: "image/make%20(1).jpg",
  tier: "VIP Atelier Member",
  joinDate: "January 2026",
  skinProfile: {
    fitzpatrickType: "Type III (Wheatish - Warm Undertone)",
    skinType: "Combination / Normal",
    sensitivity: "Low Sensitivity",
    patchTestStatus: "Passed (12 Jan 2026)",
    emergencyContact: "Rohan Sharma (+91 98450 98765)"
  },
  upcomingAppointment: {
    id: "APT-9942",
    service: "Microblading & Ombré Combo",
    type: "BROW TOUCH-UP",
    date: "14 OCT 2026",
    time: "11:30 AM",
    artist: "Maya Lin",
    artistRole: "Senior Brow Architect",
    artistAvatar: "image/make%20(20).jpg",
    status: "Action Required: Please Confirm",
    confirmed: false,
    location: "Studio 2, Andhra Atelier"
  },
  healingProgress: {
    procedureName: "Lip Blush & Velvet Neutralization",
    procedureDate: "10 Sep 2026",
    daysElapsed: 7,
    totalDays: 42,
    currentStage: 2, // 1: Day 1-3, 2: Day 4-10, 3: Week 3-4, 4: Week 6
    stages: [
      { id: 1, name: "Intense Tone", days: "Day 1–3", desc: "Color appears 30% darker. Keep dry, apply sterile balm.", completed: true },
      { id: 2, name: "Micro-Flaking", days: "Day 4–10", desc: "Natural shedding of superficial crust. DO NOT pick or scrub.", completed: false, current: true },
      { id: 3, name: "Ghosting Phase", days: "Week 3–4", desc: "Pigment appears muted or milky while new epidermis forms.", completed: false },
      { id: 4, name: "True Tone & Touch-Up", days: "Week 6", desc: "Final rich tone blooms. Perfecting touch-up session scheduled.", completed: false }
    ]
  },
  historyRecords: [
    {
      id: "REC-2026-01",
      date: "12 Jan 2026",
      service: "Microblading Precision Feathering",
      artist: "Ananya",
      pigmentFormula: "PhiBrows Espresso #4 + Warm Ochre #2 (Retain 85%)",
      needleGauge: "0.18mm 18-U Nano Blade",
      beforeImg: "image/before%20after.jpg",
      afterImg: "image/before%20after1.jpg",
      notes: "Client has slight asymmetry on right arch. Restructured tail with 22 manual micro-strokes. Perfect retention."
    }
  ],
  invoices: [
    {
      invoiceNo: "INV-2026-089",
      date: "12 Jan 2026",
      treatment: "Master Microblading Procedure + Healing Kit",
      amount: "₹38,000",
      status: "Paid",
      paymentMethod: "Razorpay / UPI •• 4892"
    },
    {
      invoiceNo: "INV-2026-114",
      date: "10 Sep 2026",
      treatment: "Lip Blush & Undertone Neutralization (Session 1)",
      amount: "₹28,000",
      status: "Paid",
      paymentMethod: "HDFC Credit Card •• 7712"
    }
  ],
  notifications: [
    {
      id: 1,
      title: "Touch-Up Confirmation Reminder",
      time: "2 hours ago",
      text: "Your Brow Touch-up appointment with Maya Lin is scheduled for 14 OCT 2026 at 11:30 AM. Please confirm your attendance.",
      unread: true
    },
    {
      id: 2,
      title: "Aftercare Day 7 Milestone",
      time: "1 day ago",
      text: "You are currently in the micro-flaking stage for Lip Blush. Remember to keep applying your sterile recovery balm.",
      unread: true
    },
    {
      id: 3,
      title: "Invoice Generated (INV-2026-114)",
      time: "7 days ago",
      text: "Receipt of ₹28,000 for Lip Blush Neutralization is ready for download.",
      unread: false
    }
  ]
};

// Authentication State Helpers
function getAuthenticatedClient() {
  const session = localStorage.getItem("as_atelier_client");
  if (session) {
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function setAuthenticatedClient(clientData) {
  localStorage.setItem("as_atelier_client", JSON.stringify(clientData));
}

function logoutClient() {
  localStorage.removeItem("as_atelier_client");
  window.location.href = "login.html";
}

function loginDemoAccount() {
  setAuthenticatedClient(DEMO_CLIENT);
  window.location.href = "dashboard.html";
}

// Protected Route Guard (Call on private pages like dashboard.html)
function checkAuthGuard() {
  const client = getAuthenticatedClient();
  if (!client) {
    window.location.href = "login.html?redirect=dashboard";
    return null;
  }
  return client;
}
