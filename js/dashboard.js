/* ==========================================================================
   ANANYA PIGMENT ATELIER · ANDHRA - PRIVATE CLIENT DASHBOARD CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure authenticated client exists or fallback to demo
  let client = getAuthenticatedClient();
  if (!client) {
    client = DEMO_CLIENT;
    setAuthenticatedClient(client);
  }

  initDashboardSidebar();
  renderClientHeader(client);
  renderDashboardOverview(client);
  renderAppointmentsModule(client);
  renderHealingTimelineModule(client);
  renderBeforeAfterHistoryModule(client);
  renderInvoicesModule(client);
  renderNotificationsModule(client);
  initBookingForms(client);
  initTouchUpCalculator(client);
});

/* Sidebar Navigation & Tab Switching */
function initDashboardSidebar() {
  const navBtns = document.querySelectorAll(".sidebar-nav-item button");
  const tabPanes = document.querySelectorAll(".dashboard-tab-pane");
  const pageTitle = document.querySelector(".topbar-page-title");
  const mobileToggle = document.querySelector(".topbar-mobile-toggle");
  const sidebar = document.querySelector(".dashboard-sidebar");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.getAttribute("data-tab");
      if (!targetTabId) return;

      // Update active nav button
      document.querySelectorAll(".sidebar-nav-item").forEach(item => item.classList.remove("active"));
      btn.parentElement.classList.add("active");

      // Show target tab pane
      tabPanes.forEach(pane => {
        if (pane.id === targetTabId) {
          pane.classList.add("active");
        } else {
          pane.classList.remove("active");
        }
      });

      // Update page title
      const tabTitle = btn.querySelector("span:not(.nav-icon):not(.sidebar-badge)");
      if (pageTitle && tabTitle) {
        pageTitle.textContent = tabTitle.textContent;
      }

      // Close mobile sidebar if open
      if (sidebar) sidebar.classList.remove("mobile-open");
    });
  });

  if (mobileToggle && sidebar) {
    let backdrop = document.querySelector(".dashboard-sidebar-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "dashboard-sidebar-backdrop";
      backdrop.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);backdrop-filter:blur(3px);z-index:1040;opacity:0;pointer-events:none;transition:opacity 0.3s ease;";
      document.body.appendChild(backdrop);
      backdrop.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open");
        backdrop.style.opacity = "0";
        backdrop.style.pointerEvents = "none";
      });
    }

    mobileToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("mobile-open");
      if (backdrop) {
        backdrop.style.opacity = isOpen ? "1" : "0";
        backdrop.style.pointerEvents = isOpen ? "auto" : "none";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("mobile-open")) {
        sidebar.classList.remove("mobile-open");
        if (backdrop) {
          backdrop.style.opacity = "0";
          backdrop.style.pointerEvents = "none";
        }
      }
    });
  }

  // Logout button
  const logoutBtn = document.querySelector(".btn-sidebar-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out of your private atelier portal?")) {
        logoutClient();
      }
    });
  }
}

/* Render Client Header & Profile Info */
function renderClientHeader(client) {
  const nameEl = document.querySelector(".sidebar-client-info h5");
  const tierEl = document.querySelector(".sidebar-client-tier");
  const avatarEl = document.querySelector(".sidebar-client-avatar");

  if (nameEl) nameEl.textContent = client.name;
  if (tierEl) tierEl.innerHTML = `<span style="color:var(--color-champagne)">★</span> ${client.tier}`;
  if (avatarEl && client.avatar) avatarEl.src = client.avatar;

  // Profile Tab Inputs
  const profName = document.getElementById("profileName");
  const profEmail = document.getElementById("profileEmail");
  const profPhone = document.getElementById("profilePhone");
  const profSkin = document.getElementById("profileSkinType");
  const profPatch = document.getElementById("profilePatchTest");
  const profEmergency = document.getElementById("profileEmergency");

  if (profName) profName.value = client.name;
  if (profEmail) profEmail.value = client.email;
  if (profPhone) profPhone.value = client.phone;
  if (profSkin) profSkin.value = client.skinProfile.skinType + " - " + client.skinProfile.fitzpatrickType;
  if (profPatch) profPatch.value = client.skinProfile.patchTestStatus;
  if (profEmergency) profEmergency.value = client.skinProfile.emergencyContact;
}

/* Dashboard Overview Module */
function renderDashboardOverview(client) {
  const aptCard = document.getElementById("overviewAppointmentCard");
  if (!aptCard) return;

  const apt = client.upcomingAppointment;
  if (!apt) {
    aptCard.innerHTML = `<p class="text-muted">No upcoming appointments scheduled.</p>`;
    return;
  }

  const isConfirmed = apt.confirmed;
  const statusBadge = isConfirmed 
    ? `<span class="appointment-status-badge" style="background:rgba(72,187,120,0.15); color:#276749;">CONFIRMED</span>`
    : `<span class="appointment-status-badge" style="background:rgba(237,137,54,0.15); color:#C05621;">ACTION REQUIRED: CONFIRM</span>`;

  aptCard.innerHTML = `
    <div class="appointment-card-header">
      <span class="appointment-service-tag">${apt.type}</span>
      ${statusBadge}
    </div>
    <h3 class="appointment-card-title font-serif">${apt.service}</h3>
    <div class="appointment-details-grid">
      <div class="appointment-detail-cell">
        <span class="label">Date & Time</span>
        <span class="value">${apt.date} · ${apt.time}</span>
      </div>
      <div class="appointment-detail-cell">
        <span class="label">Assigned Master Artist</span>
        <span class="value">${apt.artist} (${apt.artistRole})</span>
      </div>
      <div class="appointment-detail-cell">
        <span class="label">Studio Location</span>
        <span class="value">${apt.location}</span>
      </div>
    </div>
    <div class="appointment-actions-bar">
      ${!isConfirmed ? `<button type="button" class="btn-luxury btn-rose" id="btnConfirmAppointment">Confirm Appointment</button>` : `<button type="button" class="btn-luxury btn-outline" disabled style="opacity:0.75;">✓ Appointment Confirmed</button>`}
      <button type="button" class="btn-luxury btn-outline" id="btnRescheduleApt">Reschedule</button>
      <button type="button" class="btn-luxury btn-champagne" id="btnAddToCalendar">Add to Calendar (.ics)</button>
    </div>
  `;

  // Attach confirmation button event
  const confirmBtn = document.getElementById("btnConfirmAppointment");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      client.upcomingAppointment.confirmed = true;
      setAuthenticatedClient(client);
      renderDashboardOverview(client);
      renderAppointmentsModule(client);
      showToast("Appointment confirmed with Master Artist Maya Lin!");
    });
  }

  const calBtn = document.getElementById("btnAddToCalendar");
  if (calBtn) {
    calBtn.addEventListener("click", () => {
      showToast("Calendar invite (.ics) generated and downloaded.");
    });
  }

  const reschedBtn = document.getElementById("btnRescheduleApt");
  if (reschedBtn) {
    reschedBtn.addEventListener("click", () => {
      alert("To reschedule your appointment within 48 hours without fee loss, please contact the atelier concierge at +91 98450 12345 or select a new consultation slot.");
    });
  }
}

/* Appointments Module */
function renderAppointmentsModule(client) {
  const container = document.getElementById("appointmentsListContainer");
  if (!container) return;

  const apt = client.upcomingAppointment;
  if (!apt) {
    container.innerHTML = `<div class="dash-stat-card"><p>You have no active appointments booked.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="appointment-card">
      <div class="appointment-card-header">
        <div>
          <span class="appointment-service-tag">${apt.type}</span>
          <span style="font-size:0.8rem; color:var(--color-taupe-dark); margin-left:12px;">ID: ${apt.id}</span>
        </div>
        <span class="appointment-status-badge">${apt.confirmed ? 'CONFIRMED' : 'PENDING CONFIRMATION'}</span>
      </div>
      <h3 class="appointment-card-title">${apt.service}</h3>
      <div class="appointment-details-grid">
        <div class="appointment-detail-cell">
          <span class="label">Date</span>
          <span class="value">${apt.date}</span>
        </div>
        <div class="appointment-detail-cell">
          <span class="label">Time</span>
          <span class="value">${apt.time}</span>
        </div>
        <div class="appointment-detail-cell">
          <span class="label">Artist</span>
          <span class="value">${apt.artist}</span>
        </div>
        <div class="appointment-detail-cell">
          <span class="label">Preparation</span>
          <span class="value">No caffeine 12 hrs prior</span>
        </div>
      </div>
      <p style="font-size:0.88rem; color:var(--color-text-muted); margin-bottom:20px;">
        <strong>Pre-Procedure Note:</strong> Avoid blood thinners, alcohol, and direct sunlight 24 hours prior. Arrive 10 minutes early for topical numbing ointment application.
      </p>
      <div class="appointment-actions-bar">
        ${!apt.confirmed ? `<button type="button" class="btn-luxury btn-rose" onclick="confirmAppointmentDirect()">Confirm Attendance</button>` : ``}
        <button type="button" class="btn-luxury btn-outline" onclick="showToast('Concierge notified for rescheduling')">Request Reschedule</button>
      </div>
    </div>
  `;
}

window.confirmAppointmentDirect = function() {
  const client = getAuthenticatedClient() || DEMO_CLIENT;
  client.upcomingAppointment.confirmed = true;
  setAuthenticatedClient(client);
  renderDashboardOverview(client);
  renderAppointmentsModule(client);
  showToast("Appointment confirmed successfully!");
};

/* Healing Timeline & Aftercare Module */
function renderHealingTimelineModule(client) {
  const hp = client.healingProgress;
  const nodesContainer = document.getElementById("healingNodesContainer");
  const trackFill = document.getElementById("healingTrackFill");
  const currentStageName = document.getElementById("currentStageName");
  const currentStageDesc = document.getElementById("currentStageDesc");

  if (!nodesContainer || !hp) return;

  if (trackFill) {
    trackFill.style.width = "40%";
  }

  if (currentStageName && currentStageDesc) {
    const current = hp.stages.find(s => s.current) || hp.stages[1];
    currentStageName.textContent = `Current: Stage ${current.id} — ${current.name} (${current.days})`;
    currentStageDesc.textContent = current.desc;
  }

  nodesContainer.innerHTML = hp.stages.map(stage => `
    <div class="stage-node ${stage.completed ? 'completed' : ''} ${stage.current ? 'current' : ''}">
      <div class="stage-node-circle">${stage.completed ? '✓' : stage.id}</div>
      <span class="stage-node-label">${stage.name}</span>
      <span class="stage-node-day">${stage.days}</span>
    </div>
  `).join("");

  // Setup Checkboxes
  const checkItems = document.querySelectorAll(".aftercare-check-item input[type='checkbox']");
  checkItems.forEach(chk => {
    chk.addEventListener("change", () => {
      const parent = chk.closest(".aftercare-check-item");
      if (chk.checked) {
        parent.classList.add("checked");
        showToast("Aftercare milestone checked for today!");
      } else {
        parent.classList.remove("checked");
      }
    });
  });
}

/* Private Before & After History Module */
function renderBeforeAfterHistoryModule(client) {
  const recordWrap = document.getElementById("historyRecordContainer");
  if (!recordWrap) return;

  const rec = client.historyRecords[0];
  if (!rec) return;

  recordWrap.innerHTML = `
    <div style="background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--border-radius-lg); padding:32px; margin-bottom:30px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--color-border-light); padding-bottom:16px;">
        <div>
          <h4 style="font-family:var(--font-serif-display); font-size:1.4rem; color:var(--color-espresso); text-transform:none; letter-spacing:normal;">${rec.service}</h4>
          <span style="font-size:0.82rem; color:var(--color-taupe-dark);">${rec.date} · Master Artist: ${rec.artist}</span>
        </div>
        <span class="badge-lab"><span class="dot"></span> Verified Studio Result</span>
      </div>

      <div class="before-after-container" id="privateSlider" style="margin-bottom:24px; max-height:450px;">
        <div class="ba-image-wrapper ba-image-before">
          <img src="${rec.beforeImg}" alt="Before Procedure">
          <span class="ba-label ba-label-before">Before Session</span>
        </div>
        <div class="ba-image-wrapper ba-image-after" style="width: 50%;">
          <img src="${rec.afterImg}" alt="After Healed Procedure">
          <span class="ba-label ba-label-after">Healed Result</span>
        </div>
        <div class="ba-slider-handle" style="left: 50%;">
          <div class="ba-handle-button">↔</div>
        </div>
      </div>

      <div class="appointment-details-grid" style="margin-top:0;">
        <div class="appointment-detail-cell">
          <span class="label">Custom Pigment Formula</span>
          <span class="value">${rec.pigmentFormula}</span>
        </div>
        <div class="appointment-detail-cell">
          <span class="label">Needle Configuration</span>
          <span class="value">${rec.needleGauge}</span>
        </div>
        <div class="appointment-detail-cell">
          <span class="label">Retention Score</span>
          <span class="value">96% Pigment Hold</span>
        </div>
      </div>
      <p style="font-size:0.9rem; color:var(--color-text-muted); background:var(--bg-porcelain-light); padding:16px; border-radius:var(--border-radius-md); border-left:3px solid var(--color-champagne);">
        <strong>Artist Clinical Notes:</strong> ${rec.notes}
      </p>
    </div>
  `;

  // Re-initialize slider for private gallery
  const container = document.getElementById("privateSlider");
  if (container) {
    const afterImgWrapper = container.querySelector(".ba-image-after");
    const handle = container.querySelector(".ba-slider-handle");
    const afterImg = container.querySelector(".ba-image-after img");
    let isDragging = false;

    function syncImgWidth() {
      const w = container.offsetWidth;
      if (afterImg && w > 0) {
        afterImg.style.width = `${w}px`;
        afterImg.style.maxWidth = `${w}px`;
        afterImg.style.minWidth = `${w}px`;
      }
    }
    syncImgWidth();
    setTimeout(syncImgWidth, 100);

    function updatePos(clientX) {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      const pct = (offsetX / rect.width) * 100;
      afterImgWrapper.style.width = `${pct}%`;
      handle.style.left = `${pct}%`;
    }

    container.addEventListener("mousedown", (e) => { isDragging = true; syncImgWidth(); updatePos(e.clientX); });
    window.addEventListener("mousemove", (e) => { if (isDragging) updatePos(e.clientX); });
    window.addEventListener("mouseup", () => { isDragging = false; });

    container.addEventListener("touchstart", (e) => { isDragging = true; syncImgWidth(); if (e.touches.length > 0) updatePos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchmove", (e) => { if (isDragging && e.touches.length > 0) updatePos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchend", () => { isDragging = false; });
  }
}

/* Invoices & Receipts Module */
function renderInvoicesModule(client) {
  const tbody = document.getElementById("invoicesTableBody");
  if (!tbody) return;

  tbody.innerHTML = client.invoices.map(inv => `
    <tr>
      <td style="font-weight:600; color:var(--color-espresso);">${inv.invoiceNo}</td>
      <td>${inv.date}</td>
      <td>${inv.treatment}</td>
      <td style="font-weight:700; color:var(--color-espresso);">${inv.amount}</td>
      <td><span class="invoice-status-paid">${inv.status}</span></td>
      <td>${inv.paymentMethod}</td>
      <td>
        <button type="button" class="btn-luxury btn-outline" style="padding:6px 14px; font-size:0.76rem;" onclick="viewInvoiceReceipt('${inv.invoiceNo}', '${inv.treatment}', '${inv.amount}', '${inv.date}')">Download Receipt</button>
      </td>
    </tr>
  `).join("");
}

window.viewInvoiceReceipt = function(no, treatment, amount, date) {
  alert(`=== ANANYA PIGMENT ATELIER OFFICIAL TAX INVOICE ===\nInvoice: ${no}\nDate: ${date}\nTreatment: ${treatment}\nTotal Paid: ${amount} (Incl. 18% GST)\nPayment Status: PAID & VERIFIED\n\nA PDF receipt has been sent to your registered email.`);
};

/* Notifications Module */
function renderNotificationsModule(client) {
  const container = document.getElementById("notificationsListContainer");
  const badgeEl = document.querySelector(".sidebar-badge");
  if (!container) return;

  const unreadCount = client.notifications.filter(n => n.unread).length;
  if (badgeEl) badgeEl.textContent = unreadCount;

  container.innerHTML = client.notifications.map(n => `
    <div style="background:var(--color-surface); border:1px solid ${n.unread ? 'var(--color-rose)' : 'var(--color-border)'}; border-radius:var(--border-radius-md); padding:20px; margin-bottom:14px; display:flex; gap:16px; align-items:flex-start;">
      <div style="width:10px; height:10px; border-radius:50%; background:${n.unread ? 'var(--color-rose)' : 'var(--color-taupe)'}; margin-top:6px; flex-shrink:0;"></div>
      <div style="flex-grow:1;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <h5 style="font-size:0.95rem; color:var(--color-espresso); margin:0;">${n.title}</h5>
          <span style="font-size:0.75rem; color:var(--color-taupe-dark);">${n.time}</span>
        </div>
        <p style="font-size:0.86rem; color:var(--color-text-muted); margin:0;">${n.text}</p>
      </div>
    </div>
  `).join("");
}

/* Booking Forms in Dashboard */
function initBookingForms(client) {
  const consultForm = document.getElementById("dashConsultationForm");
  if (consultForm) {
    consultForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const service = document.getElementById("dashBookService").value;
      const artist = document.getElementById("dashBookArtist").value;
      const date = document.getElementById("dashBookDate").value;
      const time = document.getElementById("dashBookTime").value;

      client.upcomingAppointment = {
        id: "APT-" + Math.floor(1000 + Math.random() * 9000),
        service: service,
        type: "IN-STUDIO CONSULTATION",
        date: date || "20 OCT 2026",
        time: time || "02:00 PM",
        artist: artist || "Ananya",
        artistRole: "Master Artist",
        artistAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        status: "Confirmed",
        confirmed: true,
        location: "Private Atelier Suite"
      };

      setAuthenticatedClient(client);
      renderDashboardOverview(client);
      renderAppointmentsModule(client);
      showToast("Consultation booked! Check your upcoming appointments.");
      
      // Switch to appointments tab
      document.querySelector("[data-tab='tab-appointments']").click();
    });
  }
}

/* Touch-Up Rate Calculator */
function initTouchUpCalculator(client) {
  const timeSelect = document.getElementById("touchUpIntervalSelect");
  const priceDisplay = document.getElementById("calculatedTouchUpPrice");
  const bookBtn = document.getElementById("btnBookCalculatedTouchUp");

  if (!timeSelect || !priceDisplay) return;

  const rates = {
    "6weeks": "₹0 (Complimentary Included)",
    "6months": "₹8,000",
    "12months": "₹12,500",
    "18months": "₹18,000",
    "24months": "₹22,000"
  };

  timeSelect.addEventListener("change", () => {
    priceDisplay.textContent = rates[timeSelect.value] || "₹12,500";
  });

  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      showToast(`Touch-Up reserved for ${timeSelect.options[timeSelect.selectedIndex].text}! Confirmation sent.`);
    });
  }
}

/* Toast Message Utility */
function showToast(message) {
  let toast = document.getElementById("dashboardToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "dashboardToast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.background = "var(--color-espresso)";
    toast.style.color = "var(--bg-porcelain-light)";
    toast.style.padding = "14px 24px";
    toast.style.borderRadius = "var(--border-radius-pill)";
    toast.style.boxShadow = "var(--shadow-lg)";
    toast.style.zIndex = "3000";
    toast.style.fontSize = "0.9rem";
    toast.style.fontWeight = "500";
    toast.style.border = "1px solid var(--color-champagne)";
    toast.style.transition = "all 0.3s ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
  }, 3500);
}
