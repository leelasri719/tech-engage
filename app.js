/**
 * TechEngage – Main Engineering Quiz Application Controller
 * Full-featured: Practice, Exam, Rapid Fire modes
 * KaTeX math, SVG diagrams, code blocks, bookmarks, certificate
 */

(function () {
  'use strict';

  // ─── Branch metadata ───────────────────────────────────────────────────────
  const BRANCHES = {
    all:  { name: 'All Disciplines',                icon: '⚡', color: '#00F2FE' },
    cse:  { name: 'Computer Science & Engg',        icon: '💻', color: '#3B82F6' },
    eee:  { name: 'Electrical & Electronics',       icon: '⚡', color: '#F59E0B' },
    me:   { name: 'Mechanical Engineering',         icon: '🔧', color: '#EF4444' },
    ce:   { name: 'Civil Engineering',              icon: '🏗️', color: '#10B981' },
    ece:  { name: 'Electronics & Communication',   icon: '📡', color: '#8B5CF6' },
    math: { name: 'Engineering Mathematics',       icon: '🧮', color: '#EC4899' }
  };

  // ─── App state ─────────────────────────────────────────────────────────────
  const State = {
    screen: 'screen-dashboard',
    mode: 'practice',
    branch: 'all',
    questions: [],
    idx: 0,
    answers: {},           // { qIdx: chosenOptionIdx }
    flagged: new Set(),
    timerInterval: null,
    timeRemaining: 0,
    timeSpent: 0,
    quizRecord: null
  };

  // ─── Utility: render KaTeX inside an element ───────────────────────────────
  function renderMath(el) {
    if (!el) return;
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(el, {
          delimiters: [
            { left: '\\(', right: '\\)',  display: false },
            { left: '\\[', right: '\\]',  display: true  },
            { left: '$',   right: '$',    display: false }
          ],
          throwOnError: false,
          strict: false
        });
      } catch (e) {
        // silent – rendering best-effort
      }
    }
  }

  // ─── Screen routing ────────────────────────────────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) { el.classList.add('active'); State.screen = id; }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  function renderDashboard() {
    const stats   = QuizStorage.getAnalytics();
    const profile = QuizStorage.getProfile();
    setText('stat-total-quizzes',    stats.totalQuizzes);
    setText('stat-overall-accuracy', stats.accuracy + '%');
    setText('stat-user-xp',          profile.xp + ' XP');
    setText('stat-saved-bookmarks',  QuizStorage.getBookmarks().length);
    setText('user-badge-text',       `${profile.name} · Lvl ${profile.level}`);
  }

  function renderBranchCards() {
    const grid = document.getElementById('branches-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const all = window.ENGINEERING_QUESTIONS || [];

    Object.entries(BRANCHES).forEach(([key, b]) => {
      if (key === 'all') return;
      const count = all.filter(q => q.branch === key).length;
      const card = document.createElement('div');
      card.className = 'branch-card';
      card.setAttribute('data-branch', key);
      card.innerHTML = `
        <div class="branch-header">
          <div class="branch-icon-box" style="background:${b.color}22;color:${b.color};">${b.icon}</div>
          <span class="branch-badge">${count} Q&amp;A</span>
        </div>
        <h3 class="branch-name">${b.name}</h3>
        <p class="branch-desc">Core concepts, formulas, derivations &amp; exam-style problems.</p>
        <div class="branch-footer">
          <span>Practice Mode →</span>
          <span style="font-size:0.8rem;color:var(--text-dim);">&amp; Exam</span>
        </div>`;
      card.addEventListener('click', () => { SoundEffects.click(); startQuiz(key, 'practice'); });
      grid.appendChild(card);
    });
  }

  // ─── Quiz engine ───────────────────────────────────────────────────────────
  function startQuiz(branch = 'all', mode = 'practice', opts = null) {
    clearInterval(State.timerInterval);

    State.branch   = branch;
    State.mode     = mode;
    State.idx      = 0;
    State.answers  = {};
    State.flagged  = new Set();
    State.timeSpent = 0;

    let pool = [...(window.ENGINEERING_QUESTIONS || [])];
    if (branch !== 'all') pool = pool.filter(q => q.branch === branch);
    if (opts?.branches?.length) pool = (window.ENGINEERING_QUESTIONS || []).filter(q => opts.branches.includes(q.branch));

    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const count = opts?.questionCount ?? (mode === 'rapid' ? 5 : 10);
    State.questions = pool.slice(0, Math.min(count, pool.length));

    if (!State.questions.length) {
      showToast('No questions found for the selected criteria.', 'error');
      return;
    }

    const secs = opts?.timerMinutes ? opts.timerMinutes * 60
               : mode === 'rapid'  ? 60
               : mode === 'exam'   ? State.questions.length * 90   // 1.5 min/q
               : State.questions.length * 120;                      // 2 min/q practice
    State.timeRemaining = secs;

    showScreen('screen-quiz-arena');
    renderPalette();
    renderQuestion();
    startTimer();
  }

  // ─── Timer ────────────────────────────────────────────────────────────────
  function startTimer() {
    clearInterval(State.timerInterval);
    updateTimerUI();
    State.timerInterval = setInterval(() => {
      State.timeRemaining--;
      State.timeSpent++;
      updateTimerUI();
      if (State.timeRemaining <= 0) {
        clearInterval(State.timerInterval);
        showToast("⏰ Time's up! Submitting quiz…", 'warning');
        setTimeout(finishQuiz, 1500);
      }
    }, 1000);
  }

  function updateTimerUI() {
    const el = document.getElementById('quiz-timer-display');
    if (!el) return;
    const m = Math.floor(State.timeRemaining / 60);
    const s = State.timeRemaining % 60;
    el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const wrap = el.closest('.quiz-timer');
    if (wrap) wrap.classList.toggle('urgent', State.timeRemaining <= 60);
    if (State.timeRemaining <= 60 && State.timeRemaining > 0) SoundEffects.tick();
  }

  // ─── Question Renderer ────────────────────────────────────────────────────
  function renderQuestion() {
    const q = State.questions[State.idx];
    if (!q) return;

    // Header
    setText('q-counter', `Question ${State.idx + 1} of ${State.questions.length}`);
    setText('q-topic-badge', `${BRANCHES[q.branch]?.name || q.branch}  •  ${q.topic}`);

    // Difficulty pip
    const diffEl = document.getElementById('q-difficulty');
    if (diffEl) {
      const colors = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' };
      diffEl.textContent = q.difficulty ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1) : '';
      diffEl.style.background = `${colors[q.difficulty] || '#6B7280'}22`;
      diffEl.style.color = colors[q.difficulty] || '#6B7280';
    }

    // Bookmark
    const bmBtn = document.getElementById('btn-bookmark-q');
    if (bmBtn) bmBtn.classList.toggle('active', QuizStorage.isBookmarked(q.id));

    // Question text
    const textEl = document.getElementById('question-text');
    if (textEl) textEl.innerHTML = q.question;

    // Code block
    const codeEl = document.getElementById('question-code-block');
    if (codeEl) {
      codeEl.style.display = q.codeSnippet ? 'block' : 'none';
      if (q.codeSnippet) codeEl.textContent = q.codeSnippet;
    }

    // SVG diagram
    const svgEl = document.getElementById('question-svg-container');
    if (svgEl) {
      svgEl.style.display = q.svgDiagram ? 'block' : 'none';
      if (q.svgDiagram) svgEl.innerHTML = q.svgDiagram;
    }

    // Options
    renderOptions(q);

    // Solution box (practice mode only, after answering)
    renderSolutionBox(q);

    // Progress bar
    const progressEl = document.getElementById('quiz-progress-bar');
    if (progressEl) {
      progressEl.style.width = `${((State.idx + 1) / State.questions.length) * 100}%`;
    }

    // KaTeX render entire arena
    renderMath(document.getElementById('screen-quiz-arena'));
    updatePaletteNodes();
  }

  function renderOptions(q) {
    const container = document.getElementById('options-list');
    if (!container) return;
    container.innerHTML = '';

    const answered    = State.answers[State.idx] !== undefined;
    const isPractice  = State.mode === 'practice';
    const letters     = ['A', 'B', 'C', 'D'];

    q.options.forEach((text, idx) => {
      const chosen = State.answers[State.idx] === idx;
      const item   = document.createElement('div');
      item.className = 'option-item';
      if (chosen) item.classList.add('selected');

      // Colour-code only in practice mode after answering
      if (isPractice && answered) {
        if (idx === q.correctAnswer) item.classList.add('correct');
        else if (chosen)             item.classList.add('incorrect');
      }

      const letterDiv = document.createElement('div');
      letterDiv.className = 'option-letter';
      letterDiv.textContent = letters[idx];

      const textDiv = document.createElement('div');
      textDiv.className = 'option-text';
      textDiv.innerHTML = text; // allow LaTeX in option text

      item.appendChild(letterDiv);
      item.appendChild(textDiv);

      // Disable clicks after answering in practice, or allow re-answer in exam
      if (!(isPractice && answered)) {
        item.addEventListener('click', () => selectOption(idx, q));
      }

      container.appendChild(item);
    });

    // Render math inside options
    renderMath(container);
  }

  function renderSolutionBox(q) {
    const box     = document.getElementById('solution-box');
    const content = document.getElementById('solution-content');
    const hint    = document.getElementById('hint-content');
    if (!box) return;

    const answered   = State.answers[State.idx] !== undefined;
    const isPractice = State.mode === 'practice';

    if (isPractice && answered) {
      box.classList.add('show');
      if (content) { content.innerHTML = q.explanation || 'No explanation available.'; renderMath(content); }
    } else {
      box.classList.remove('show');
    }

    // Hint box (always available in practice)
    if (hint) {
      hint.textContent = q.hint || '';
    }
  }

  function selectOption(optionIdx, q) {
    SoundEffects.select();
    State.answers[State.idx] = optionIdx;

    if (State.mode === 'practice') {
      if (optionIdx === q.correctAnswer) SoundEffects.correct();
      else SoundEffects.wrong();
    }

    renderQuestion();
  }

  // ─── Question Palette ─────────────────────────────────────────────────────
  function renderPalette() {
    const grid = document.getElementById('palette-grid');
    if (!grid) return;
    grid.innerHTML = '';

    State.questions.forEach((_, idx) => {
      const node = document.createElement('div');
      node.className = 'p-node';
      node.textContent = idx + 1;
      node.addEventListener('click', () => { SoundEffects.click(); State.idx = idx; renderQuestion(); });
      grid.appendChild(node);
    });
    updatePaletteNodes();
  }

  function updatePaletteNodes() {
    document.querySelectorAll('.p-node').forEach((node, idx) => {
      node.className = 'p-node';
      if (idx === State.idx)               node.classList.add('current');
      if (State.answers[idx] !== undefined) node.classList.add('answered');
      if (State.flagged.has(idx))           node.classList.add('flagged');
    });
  }

  // ─── Submit / Finish ──────────────────────────────────────────────────────
  function finishQuiz() {
    clearInterval(State.timerInterval);
    SoundEffects.fanfare();

    let score = 0;
    const breakdown = {};

    State.questions.forEach((q, i) => {
      if (!breakdown[q.branch]) breakdown[q.branch] = { correct: 0, total: 0 };
      breakdown[q.branch].total++;
      if (State.answers[i] === q.correctAnswer) { score++; breakdown[q.branch].correct++; }
    });

    const total    = State.questions.length;
    const pct      = total ? Math.round((score / total) * 100) : 0;
    const grade    = pct >= 90 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
    const gradeClr = pct >= 75 ? 'var(--accent-emerald)' : pct >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)';

    const record = {
      branch: State.branch, mode: State.mode,
      score, totalQuestions: total, accuracyPercentage: pct,
      timeSpentSeconds: State.timeSpent, branchBreakdown: breakdown,
      questions: State.questions, userAnswers: { ...State.answers }
    };
    State.quizRecord = QuizStorage.saveQuizResult(record);
    updateUserNavBadge();

    // Fill results screen
    setText('result-score-num', score);
    setText('result-score-max', `/ ${total}`);
    const accEl = document.getElementById('result-accuracy-val');
    if (accEl) { accEl.textContent = `${pct}%`; accEl.style.color = gradeClr; }
    setText('result-grade-val',   grade);
    setText('result-time-val',    `${Math.floor(State.timeSpent/60)}m ${State.timeSpent%60}s`);
    setText('result-correct-val', score);
    setText('result-wrong-val',   total - score);
    setText('result-mode-val',    State.mode.charAt(0).toUpperCase() + State.mode.slice(1));

    // Radial ring animation
    const ring = document.getElementById('score-ring-fill');
    if (ring) {
      const circ = 2 * Math.PI * 54;
      ring.style.strokeDasharray  = circ;
      ring.style.strokeDashoffset = circ - (pct / 100) * circ;
      ring.style.stroke = gradeClr;
    }

    // Branch breakdown pills
    renderBreakdownPills(breakdown);

    // Show/hide cert button
    const certBtn = document.getElementById('btn-claim-certificate');
    if (certBtn) certBtn.style.display = pct >= 80 ? 'inline-flex' : 'none';

    // Review wrong answers
    renderReviewList();

    renderDashboard();
    showScreen('screen-quiz-results');
  }

  function renderBreakdownPills(breakdown) {
    const container = document.getElementById('branch-breakdown-pills');
    if (!container) return;
    container.innerHTML = '';
    Object.entries(breakdown).forEach(([branch, data]) => {
      const pct = data.total ? Math.round((data.correct / data.total) * 100) : 0;
      const b   = BRANCHES[branch] || { name: branch, color: '#6B7280', icon: '📚' };
      const pill = document.createElement('div');
      pill.className = 'r-stat-box';
      pill.style.borderColor = data.correct === data.total ? 'var(--accent-emerald)' : 'var(--border-color)';
      pill.innerHTML = `
        <div style="font-size:1.5rem;margin-bottom:0.25rem;">${b.icon}</div>
        <div class="r-stat-val" style="color:${b.color};font-size:1.1rem;">${pct}%</div>
        <div class="stat-label">${b.name}</div>
        <div style="font-size:0.75rem;color:var(--text-dim);">${data.correct}/${data.total} correct</div>`;
      container.appendChild(pill);
    });
  }

  function renderReviewList() {
    const list = document.getElementById('review-list');
    if (!list) return;
    list.innerHTML = '';

    State.questions.forEach((q, i) => {
      const chosen  = State.answers[i];
      const correct = chosen === q.correctAnswer;
      if (correct) return; // Only show wrong/skipped

      const letters = ['A', 'B', 'C', 'D'];
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = `
        <div class="review-q-text" style="font-weight:600;margin-bottom:0.5rem;">
          <span style="color:var(--accent-rose);font-size:0.8rem;margin-right:0.5rem;">✗ Q${i+1}</span>
          ${q.question}
        </div>
        <div style="font-size:0.85rem;margin-bottom:0.35rem;">
          ${chosen !== undefined
            ? `<span style="color:var(--accent-rose);">Your answer: ${letters[chosen]} – ${q.options[chosen]}</span>`
            : `<span style="color:var(--text-muted);">Skipped</span>`}
        </div>
        <div style="font-size:0.85rem;color:var(--accent-emerald);">
          Correct: ${letters[q.correctAnswer]} – ${q.options[q.correctAnswer]}
        </div>`;
      list.appendChild(item);
    });

    if (!list.children.length) {
      list.innerHTML = `<div style="text-align:center;color:var(--accent-emerald);padding:2rem;font-size:1.1rem;">🎉 Perfect score! All answers correct.</div>`;
    }

    // Render math inside review list
    renderMath(list);
  }

  // ─── Analytics Screen ─────────────────────────────────────────────────────
  function renderAnalytics() {
    const stats   = QuizStorage.getAnalytics();
    const history = QuizStorage.getHistory();

    setText('an-total-quizzes', stats.totalQuizzes);
    setText('an-accuracy',       stats.accuracy + '%');
    setText('an-questions',      stats.totalQuestions);

    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!history.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">No quiz history yet. Start your first quiz!</td></tr>`;
      return;
    }

    history.forEach(item => {
      const bInfo  = BRANCHES[item.branch] || { name: item.branch, icon: '📚' };
      const pct    = item.accuracyPercentage;
      const clr    = pct >= 75 ? 'var(--accent-emerald)' : pct >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)';
      const row    = document.createElement('tr');
      row.style.borderBottom = '1px solid var(--border-color)';
      row.innerHTML = `
        <td style="padding:0.85rem 0.75rem;">${item.dateStr}</td>
        <td style="padding:0.85rem 0.75rem;"><span class="q-topic-badge">${bInfo.icon} ${bInfo.name}</span></td>
        <td style="padding:0.85rem 0.75rem;text-transform:capitalize;">${item.mode}</td>
        <td style="padding:0.85rem 0.75rem;"><strong>${item.score}/${item.totalQuestions}</strong> <span style="color:${clr};">(${pct}%)</span></td>
        <td style="padding:0.85rem 0.75rem;"><button class="icon-btn" style="width:auto;padding:0.3rem 0.75rem;" data-id="${item.id}">🔄 Retry</button></td>`;
      tbody.appendChild(row);
    });

    // Retry buttons
    tbody.querySelectorAll('[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rec = history.find(h => h.id === btn.dataset.id);
        if (rec) startQuiz(rec.branch, rec.mode);
      });
    });
  }

  // ─── Certificate ──────────────────────────────────────────────────────────
  function openCertificate() {
    const profile  = QuizStorage.getProfile();
    const rec      = State.quizRecord;
    const branchLbl = rec ? (BRANCHES[rec.branch]?.name || rec.branch) : 'Engineering';

    setText('cert-student-name', profile.name);
    setText('cert-branch-label', branchLbl);
    setText('cert-score-label',  rec ? `${rec.accuracyPercentage}% Accuracy  •  ${rec.score}/${rec.totalQuestions} Correct` : '');
    setText('cert-issue-date',   new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }));

    document.getElementById('certificate-modal').classList.add('active');
  }

  // ─── Toast ────────────────────────────────────────────────────────────────
  function showToast(msg, type = 'info') {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      document.body.appendChild(toast);
    }
    const colors = { info: '#3B82F6', error: '#EF4444', warning: '#F59E0B', success: '#10B981' };
    toast.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
      background:${colors[type] || colors.info};color:#fff;
      padding:0.75rem 1.5rem;border-radius:50px;font-weight:600;
      font-size:0.95rem;z-index:9999;box-shadow:0 8px 25px rgba(0,0,0,0.3);
      opacity:0;transition:opacity 0.3s;pointer-events:none;`;
    toast.textContent = msg;
    setTimeout(() => { toast.style.opacity = '1'; }, 50);
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function updateUserNavBadge() {
    const p = QuizStorage.getProfile();
    setText('user-badge-text', `${p.name} · Lvl ${p.level}`);
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  function init() {
    // Load saved theme & sound settings
    const settings = QuizStorage.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
    if (settings.muted) { SoundEffects.toggleMute(true); updateMuteBtnUI(true); }

    renderDashboard();
    renderBranchCards();
    updateUserNavBadge();
    bindEvents();
  }

  function updateMuteBtnUI(muted) {
    const btn = document.getElementById('nav-mute-toggle');
    if (btn) btn.innerHTML = muted ? '🔇 Muted' : '🔊 Sound';
  }

  // ─── Event Binding ────────────────────────────────────────────────────────
  function bindEvents() {
    // Nav
    on('nav-home-btn',       () => { SoundEffects.click(); renderDashboard(); showScreen('screen-dashboard'); });
    on('nav-analytics-btn',  () => { SoundEffects.click(); renderAnalytics(); showScreen('screen-analytics'); });
    on('nav-bookmarks-btn',  () => { SoundEffects.click(); renderBookmarksScreen(); showScreen('screen-bookmarks'); });
    on('nav-theme-toggle',   () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const nxt = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nxt);
      QuizStorage.saveSettings({ theme: nxt });
      SoundEffects.click();
    });
    on('nav-mute-toggle', () => {
      const m = SoundEffects.toggleMute(!SoundEffects.isMuted());
      updateMuteBtnUI(m);
      QuizStorage.saveSettings({ muted: m });
    });

    // Quiz arena navigation
    on('btn-next-q', () => {
      SoundEffects.click();
      if (State.idx < State.questions.length - 1) { State.idx++; renderQuestion(); }
    });
    on('btn-prev-q', () => {
      SoundEffects.click();
      if (State.idx > 0) { State.idx--; renderQuestion(); }
    });
    on('btn-flag-q', () => {
      SoundEffects.click();
      if (State.flagged.has(State.idx)) State.flagged.delete(State.idx);
      else State.flagged.add(State.idx);
      const flagBtn = document.getElementById('btn-flag-q');
      if (flagBtn) flagBtn.classList.toggle('active', State.flagged.has(State.idx));
      updatePaletteNodes();
    });
    on('btn-bookmark-q', () => {
      SoundEffects.click();
      const q = State.questions[State.idx];
      if (q) {
        const saved = QuizStorage.toggleBookmark(q.id);
        const btn = document.getElementById('btn-bookmark-q');
        if (btn) btn.classList.toggle('active', saved);
        showToast(saved ? '📌 Question bookmarked!' : 'Bookmark removed', 'success');
        renderDashboard();
      }
    });
    on('btn-submit-quiz', () => {
      SoundEffects.click();
      const unanswered = State.questions.length - Object.keys(State.answers).length;
      const msg = unanswered > 0
        ? `You have ${unanswered} unanswered question(s). Submit anyway?`
        : 'Submit your quiz now?';
      if (confirm(msg)) finishQuiz();
    });

    // Hint toggle
    on('btn-show-hint', () => {
      const box = document.getElementById('hint-box');
      if (box) box.classList.toggle('show');
    });

    // Results actions
    on('btn-claim-certificate',   openCertificate);
    on('btn-retry-quiz',          () => startQuiz(State.branch, State.mode));
    on('btn-new-quiz',            () => { showScreen('screen-dashboard'); renderDashboard(); });
    on('btn-close-cert-modal',    () => document.getElementById('certificate-modal').classList.remove('active'));
    on('btn-print-cert',          () => window.print());

    // Clear history
    on('btn-clear-history', () => {
      if (confirm('Clear all quiz history?')) {
        QuizStorage.clearHistory();
        renderAnalytics();
        showToast('History cleared.', 'info');
      }
    });

    // Hero CTA buttons
    on('hero-btn-practice', () => { SoundEffects.click(); startQuiz('all', 'practice'); });
    on('hero-btn-exam',     () => { SoundEffects.click(); startQuiz('all', 'exam'); });
    on('hero-btn-rapid',    () => { SoundEffects.click(); startQuiz('all', 'rapid'); });
  }

  function on(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  // ─── Bookmarks screen ─────────────────────────────────────────────────────
  function renderBookmarksScreen() {
    const container = document.getElementById('bookmarks-list');
    if (!container) return;
    container.innerHTML = '';
    const ids  = QuizStorage.getBookmarks();
    const all  = window.ENGINEERING_QUESTIONS || [];
    const saved = all.filter(q => ids.includes(q.id));

    if (!saved.length) {
      container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:3rem;">No bookmarked questions yet.<br>Click 📌 on any question during a quiz to save it here.</div>`;
      return;
    }

    saved.forEach(q => {
      const b    = BRANCHES[q.branch] || { name: q.branch, icon: '📚', color: '#6B7280' };
      const card = document.createElement('div');
      card.className = 'question-card';
      card.style.marginBottom = '1rem';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;flex-wrap:wrap;">
          <span class="q-topic-badge">${b.icon} ${b.name}</span>
          <span class="branch-badge">${q.topic}</span>
        </div>
        <div style="font-size:1.05rem;font-weight:600;margin-bottom:1rem;">${q.question}</div>
        <details style="cursor:pointer;">
          <summary style="color:var(--accent-cyan);font-weight:600;font-size:0.9rem;">Show Answer &amp; Explanation</summary>
          <div style="margin-top:0.75rem;padding:0.75rem;background:rgba(16,185,129,0.08);border-radius:var(--radius-md);border:1px solid var(--accent-emerald);">
            <strong style="color:var(--accent-emerald);">✓ ${['A','B','C','D'][q.correctAnswer]} – ${q.options[q.correctAnswer]}</strong><br><br>
            <span style="color:var(--text-muted);font-size:0.9rem;">${q.explanation}</span>
          </div>
        </details>
        <button class="icon-btn" style="margin-top:0.75rem;width:auto;padding:0.3rem 0.75rem;color:var(--accent-rose);" data-qid="${q.id}">🗑 Remove Bookmark</button>`;
      container.appendChild(card);
    });

    // Bind remove buttons
    container.querySelectorAll('[data-qid]').forEach(btn => {
      btn.addEventListener('click', () => {
        QuizStorage.toggleBookmark(btn.dataset.qid);
        renderBookmarksScreen();
        renderDashboard();
        showToast('Bookmark removed', 'info');
      });
    });

    renderMath(container);
  }

  // ─── Expose globally for inline HTML & outside calls ─────────────────────
  window.startQuizFromApp = startQuiz;

  // ─── Boot ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

})();
