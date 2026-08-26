import { initI18n, setLanguage, toggleLanguageMenu, closeLanguageMenu, getLanguage, t } from './i18n.js';

const $ = (s) => document.querySelector(s);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s-]{8,15}$/;

let mode = 'login';      // 'login' | 'register'
let method = 'email';    // 'email' | 'phone'
let status = 'idle';     // 'idle' | 'loading' | 'success'
let showPass = false;
let otpSent = false;
let countdown = 0;
let countdownTimer = null;
let sending = false;

/* ---------------- language dropdown (shared header pattern) ---------------- */
function bindLanguage() {
  const langSwitch = $('#langSwitch');
  const langTarget = $('#langTargetOption');
  langSwitch?.addEventListener('click', (e) => { e.stopPropagation(); toggleLanguageMenu(); });
  langTarget?.addEventListener('click', () => setLanguage(getLanguage() === 'fa' ? 'en' : 'fa'));
  document.addEventListener('click', (e) => {
    const dropdown = $('#langDropdown');
    if (dropdown && !dropdown.contains(e.target)) closeLanguageMenu();
  });
}

/* ---------------- mode / method switching ---------------- */
function applyModeUI() {
  const isLogin = mode === 'login';

  $('#loginTab').classList.toggle('active', isLogin);
  $('#loginTab').setAttribute('aria-selected', String(isLogin));
  $('#registerTab').classList.toggle('active', !isLogin);
  $('#registerTab').setAttribute('aria-selected', String(!isLogin));

  const ind = $('#tabInd');
  const rtl = document.documentElement.dir === 'rtl';
  const shift = isLogin ? 0 : 100;
  ind.style.transform = `translateX(${rtl ? -shift : shift}%)`;

  $('#authHeadline').textContent = t('auth.gatewayTitle');
  $('#authDescription').textContent = t(isLogin ? 'auth.loginDesc' : 'auth.registerDesc');

  const confirmField = $('#confirmField');
  confirmField.classList.toggle('hidden', isLogin || method !== 'email');

  $('#forgotRow').classList.toggle('hidden', !isLogin || method !== 'email');

  $('#submitLabel').textContent = t(isLogin ? 'auth.loginBtn' : 'auth.registerBtn');
  $('#footerQuestion').textContent = t(isLogin ? 'auth.noAccount' : 'auth.hasAccount');
  $('#footerSwitch').textContent = t(isLogin ? 'auth.switchToRegister' : 'auth.switchToLogin');

  clearErrors();
  hideBanners();
}

function applyMethodUI() {
  const isEmail = method === 'email';
  $('#methodEmailBtn').classList.toggle('active', isEmail);
  $('#methodEmailBtn').setAttribute('aria-pressed', String(isEmail));
  $('#methodPhoneBtn').classList.toggle('active', !isEmail);
  $('#methodPhoneBtn').setAttribute('aria-pressed', String(!isEmail));

  $('#emailField').classList.toggle('hidden', !isEmail);
  $('#phoneField').classList.toggle('hidden', isEmail);
  $('#passwordField').classList.toggle('hidden', !isEmail);
  $('#confirmField').classList.toggle('hidden', !isEmail || mode !== 'register');
  $('#forgotRow').classList.toggle('hidden', !isEmail || mode !== 'login');

  if (!isEmail) {
    $('#otpBlock').classList.toggle('hidden', !otpSent);
  } else {
    $('#otpBlock').classList.add('hidden');
  }

  clearErrors();
  hideBanners();
}

/* ---------------- error / banner helpers ---------------- */
function clearErrors() {
  ['emailErr', 'phoneErr', 'codeErr', 'passwordErr', 'confirmErr'].forEach((id) => {
    const el = $('#' + id);
    el.textContent = '';
    el.classList.add('hidden');
  });
  document.querySelectorAll('.field').forEach((f) => f.classList.remove('has-error'));
}

function setFieldError(fieldId, errId, message) {
  $('#' + fieldId).classList.add('has-error');
  const err = $('#' + errId);
  err.textContent = message;
  err.classList.remove('hidden');
}

function hideBanners() {
  $('#failBanner').classList.add('hidden');
  $('#successBanner').classList.add('hidden');
}

function showFail(message) {
  hideBanners();
  $('#failBannerText').textContent = message;
  $('#failBanner').classList.remove('hidden');
  shakeForm();
}

function showSuccess() {
  hideBanners();
  $('#successBanner').classList.remove('hidden');
}

function shakeForm() {
  const form = $('#authForm');
  form.classList.remove('shake');
  requestAnimationFrame(() => {
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
  });
}

/* ---------------- focus-line animation ---------------- */
function bindFocusLines() {
  document.querySelectorAll('.field input').forEach((input) => {
    input.addEventListener('focus', () => input.closest('.field')?.classList.add('focused'));
    input.addEventListener('blur', () => input.closest('.field')?.classList.remove('focused'));
  });
}

/* ---------------- password visibility ---------------- */
function bindEyeToggle() {
  $('#eyeBtn').addEventListener('click', () => {
    showPass = !showPass;
    const type = showPass ? 'text' : 'password';
    $('#auth-pass').type = type;
    $('#auth-confirm').type = type;
    $('#eyeBtn').setAttribute('aria-label', t(showPass ? 'auth.hidePass' : 'auth.showPass'));
    $('#eyeIcon').innerHTML = showPass
      ? '<path d="M4.5 4.5l15 15"/><path d="M9.9 6.3A9.8 9.8 0 0 1 12 5.8c5.8 0 9.2 6.2 9.2 6.2a17 17 0 0 1-3.3 3.9M6.1 8.4A16.6 16.6 0 0 0 2.8 12S6.2 18.2 12 18.2a9.4 9.4 0 0 0 3.9-.9"/><path d="M9.5 9.8a2.7 2.7 0 0 0 3.8 3.8"/>'
      : '<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12Z"/><circle cx="12" cy="12" r="2.7"/>';
  });
}

/* ---------------- OTP send / resend ---------------- */
function startCountdown() {
  countdown = 30;
  updateSendBtn();
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdown -= 1;
    updateSendBtn();
    if (countdown <= 0) clearInterval(countdownTimer);
  }, 1000);
}

function updateSendBtn() {
  const btn = $('#sendCodeBtn');
  if (sending) {
    btn.textContent = t('auth.sendingCode');
    btn.disabled = true;
  } else if (otpSent && countdown > 0) {
    btn.textContent = t('auth.resendIn').replace('{s}', countdown);
    btn.disabled = true;
  } else if (otpSent) {
    btn.textContent = t('auth.resend');
    btn.disabled = false;
  } else {
    btn.textContent = t('auth.sendCode');
    btn.disabled = false;
  }
}

function bindSendCode() {
  $('#sendCodeBtn').addEventListener('click', () => {
    const phone = $('#auth-phone').value.trim();
    if (!PHONE_RE.test(phone)) {
      clearErrors();
      setFieldError('phoneField', 'phoneErr', t('auth.errPhone'));
      shakeForm();
      return;
    }
    sending = true;
    updateSendBtn();
    setTimeout(() => {
      sending = false;
      otpSent = true;
      clearErrors();
      hideBanners();
      $('#otpBlock').classList.remove('hidden');
      startCountdown();
    }, 700);
  });
}

/* ---------------- tabs / methods bindings ---------------- */
function bindTabsAndMethods() {
  $('#loginTab').addEventListener('click', () => { if (mode !== 'login') { mode = 'login'; applyModeUI(); applyMethodUI(); } });
  $('#registerTab').addEventListener('click', () => { if (mode !== 'register') { mode = 'register'; applyModeUI(); applyMethodUI(); } });
  $('#footerSwitch').addEventListener('click', () => {
    mode = mode === 'login' ? 'register' : 'login';
    applyModeUI();
    applyMethodUI();
  });

  $('#methodEmailBtn').addEventListener('click', () => { if (method !== 'email') { method = 'email'; applyMethodUI(); } });
  $('#methodPhoneBtn').addEventListener('click', () => { if (method !== 'phone') { method = 'phone'; applyMethodUI(); } });
}

/* ---------------- submit ---------------- */
function setLoading(isLoading) {
  status = isLoading ? 'loading' : 'idle';
  const btn = $('#submitBtn');
  btn.disabled = isLoading;
  btn.classList.toggle('is-loading', isLoading);
  if (isLoading) {
    btn.innerHTML = '<span class="spin" aria-hidden="true"></span><span>' + t('auth.loading') + '</span>';
  } else {
    btn.innerHTML = '<span id="submitLabel">' + t(mode === 'login' ? 'auth.loginBtn' : 'auth.registerBtn') + '</span>';
  }
}

function bindSubmit() {
  $('#authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (status === 'loading' || sending) return;

    clearErrors();
    hideBanners();

    let hasError = false;

    if (method === 'email') {
      const email = $('#auth-email').value.trim();
      if (!EMAIL_RE.test(email)) {
        setFieldError('emailField', 'emailErr', t('auth.errEmail'));
        hasError = true;
      }
      const password = $('#auth-pass').value;
      if (password.length < 6) {
        setFieldError('passwordField', 'passwordErr', t('auth.errPassword'));
        hasError = true;
      }
      if (mode === 'register') {
        const confirm = $('#auth-confirm').value;
        if (confirm !== password) {
          setFieldError('confirmField', 'confirmErr', t('auth.errConfirm'));
          hasError = true;
        }
      }
    } else {
      const phone = $('#auth-phone').value.trim();
      if (!PHONE_RE.test(phone)) {
        setFieldError('phoneField', 'phoneErr', t('auth.errPhone'));
        hasError = true;
      }
      if (otpSent) {
        const code = $('#auth-code').value.trim();
        if (!/^\d{6}$/.test(code)) {
          setFieldError('codeField', 'codeErr', t('auth.errCode'));
          hasError = true;
        }
      }
    }

    if (hasError) {
      shakeForm();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccess();
      setTimeout(hideBanners, 2800);
    }, 950);
  });
}

/* ---------------- social buttons (demo) ---------------- */
function bindSocials() {
  document.querySelectorAll('.social-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (status === 'loading') return;
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        showSuccess();
        setTimeout(hideBanners, 2800);
      }, 800);
    });
  });
}

/* ---------------- code input: digits only ---------------- */
function bindCodeInput() {
  $('#auth-code').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
  });
}

/* ---------------- init ---------------- */
async function main() {
  await initI18n();
  bindLanguage();
  bindTabsAndMethods();
  bindFocusLines();
  bindEyeToggle();
  bindSendCode();
  bindSubmit();
  bindSocials();
  bindCodeInput();
  applyModeUI();
  applyMethodUI();
  updateSendBtn();
}

main().catch((err) => console.error('Auth init failed:', err));

window.addEventListener('pooritel:languagechange', () => {
  applyModeUI();
  applyMethodUI();
  updateSendBtn();
});
