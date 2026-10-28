/**
 * TechEngage - LocalStorage & State Manager
 */

window.QuizStorage = (function () {
  const KEYS = {
    USER_PROFILE: 'techengage_user_profile',
    QUIZ_HISTORY: 'techengage_quiz_history',
    BOOKMARKS: 'techengage_bookmarks',
    SETTINGS: 'techengage_settings'
  };

  const DEFAULT_PROFILE = {
    name: 'Engineer Student',
    targetBranch: 'all',
    xp: 0,
    level: 1,
    joinedDate: new Date().toLocaleDateString()
  };

  const DEFAULT_SETTINGS = {
    theme: 'dark',
    muted: false
  };

  return {
    // User Profile
    getProfile: function () {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : { ...DEFAULT_PROFILE };
    },

    saveProfile: function (profile) {
      const current = this.getProfile();
      const updated = { ...current, ...profile };
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(updated));
      return updated;
    },

    addXP: function (points) {
      const profile = this.getProfile();
      profile.xp += points;
      profile.level = Math.floor(profile.xp / 100) + 1;
      this.saveProfile(profile);
      return profile;
    },

    // Settings
    getSettings: function () {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : { ...DEFAULT_SETTINGS };
    },

    saveSettings: function (settings) {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    },

    // Quiz History
    getHistory: function () {
      const data = localStorage.getItem(KEYS.QUIZ_HISTORY);
      return data ? JSON.parse(data) : [];
    },

    saveQuizResult: function (resultRecord) {
      const history = this.getHistory();
      const newRecord = {
        id: 'quiz_' + Date.now(),
        timestamp: Date.now(),
        dateStr: new Date().toLocaleString(),
        ...resultRecord
      };
      history.unshift(newRecord); // newest first
      localStorage.setItem(KEYS.QUIZ_HISTORY, JSON.stringify(history));

      // Calculate XP bonus (10 XP per correct answer)
      const xpEarned = (resultRecord.score || 0) * 10;
      this.addXP(xpEarned);

      return newRecord;
    },

    clearHistory: function () {
      localStorage.removeItem(KEYS.QUIZ_HISTORY);
    },

    // Bookmarks
    getBookmarks: function () {
      const data = localStorage.getItem(KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    },

    isBookmarked: function (questionId) {
      const bookmarks = this.getBookmarks();
      return bookmarks.includes(questionId);
    },

    toggleBookmark: function (questionId) {
      let bookmarks = this.getBookmarks();
      if (bookmarks.includes(questionId)) {
        bookmarks = bookmarks.filter(id => id !== questionId);
      } else {
        bookmarks.push(questionId);
      }
      localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      return bookmarks.includes(questionId);
    },

    // Analytics Helper
    getAnalytics: function () {
      const history = this.getHistory();
      if (!history || history.length === 0) {
        return {
          totalQuizzes: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          accuracy: 0,
          avgTimePerQuestion: 0,
          branchStats: {}
        };
      }

      let totalQuestions = 0;
      let totalCorrect = 0;
      let totalTime = 0;
      const branchStats = {}; // { cse: { correct: 5, total: 10 }, ... }

      history.forEach(item => {
        totalQuestions += item.totalQuestions || 0;
        totalCorrect += item.score || 0;
        totalTime += item.timeSpentSeconds || 0;

        if (item.branchBreakdown) {
          Object.keys(item.branchBreakdown).forEach(branch => {
            if (!branchStats[branch]) {
              branchStats[branch] = { correct: 0, total: 0 };
            }
            branchStats[branch].correct += item.branchBreakdown[branch].correct || 0;
            branchStats[branch].total += item.branchBreakdown[branch].total || 0;
          });
        }
      });

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

      return {
        totalQuizzes: history.length,
        totalQuestions,
        totalCorrect,
        accuracy,
        avgTimePerQuestion,
        branchStats
      };
    }
  };
})();
