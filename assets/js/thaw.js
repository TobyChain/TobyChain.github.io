(function () {
  'use strict';

  // 2024–2050 年春节公历日期（北京时间，农历正月初一）
  var CNY = [
    [2024, 2, 10],
    [2025, 1, 29],
    [2026, 2, 17],
    [2027, 2, 6],
    [2028, 1, 26],
    [2029, 2, 13],
    [2030, 2, 3],
    [2031, 1, 23],
    [2032, 2, 11],
    [2033, 1, 31],
    [2034, 2, 19],
    [2035, 2, 8],
    [2036, 1, 28],
    [2037, 2, 15],
    [2038, 2, 4],
    [2039, 1, 24],
    [2040, 2, 12],
    [2041, 2, 1],
    [2042, 1, 22],
    [2043, 2, 10],
    [2044, 1, 30],
    [2045, 2, 17],
    [2046, 2, 6],
    [2047, 1, 26],
    [2048, 2, 14],
    [2049, 2, 2],
    [2050, 1, 23]
  ];

  var DAY_MS = 86400000;
  var SHANGHAI_OFFSET = 8 * 3600000;
  var MELT_LEVELS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  var els = {
    countdownLabel: document.getElementById('thaw-countdown-label'),
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
    meltA: document.getElementById('thaw-melt-a'),
    meltB: document.getElementById('thaw-melt-b'),
    sound: document.getElementById('thaw-sound'),
    audio: document.getElementById('thaw-audio')
  };

  if (!els.meltA) return;

  var meltBase = els.meltA.getAttribute('data-melt-base') || '/assets/img/thaw/';

  var dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  function shanghaiDate(now) {
    var parts = dateParts.formatToParts(now);
    var values = {};
    for (var i = 0; i < parts.length; i += 1) {
      if (parts[i].type !== 'literal') values[parts[i].type] = parts[i].value;
    }
    return {
      year: Number(values.year),
      month: Number(values.month),
      day: Number(values.day)
    };
  }

  function dayNumber(year, month, day) {
    return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS);
  }

  function shanghaiTimestamp(year, month, day) {
    return Date.UTC(year, month - 1, day) - SHANGHAI_OFFSET;
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  var records = CNY.map(function (item) {
    return {
      year: item[0],
      month: item[1],
      day: item[2],
      dayNumber: dayNumber(item[0], item[1], item[2]),
      timestamp: shanghaiTimestamp(item[0], item[1], item[2])
    };
  });

  function findWindow(today) {
    var exact = null;
    for (var i = 0; i < records.length; i += 1) {
      if (records[i].dayNumber === today) {
        exact = records[i];
        break;
      }
    }
    if (exact) return { prev: exact, next: exact, isToday: true };

    var prev = null;
    var next = null;
    for (var j = 0; j < records.length; j += 1) {
      if (records[j].dayNumber < today) prev = records[j];
      if (records[j].dayNumber > today && !next) next = records[j];
    }
    return {
      prev: prev || records[0],
      next: next || records[records.length - 1],
      isToday: false
    };
  }

  var frontLayer = els.meltA;
  var backLayer = els.meltB;
  var currentMelt = -1;
  var meltToken = 0;

  function meltSrc(level) {
    return meltBase + 'melt-' + pad2(level) + '.jpg';
  }

  function setMelt(progress, initial) {
    var index = Math.min(MELT_LEVELS.length - 1, Math.max(0, Math.round(progress * (MELT_LEVELS.length - 1))));
    if (index === currentMelt) return;
    currentMelt = index;

    var src = meltSrc(MELT_LEVELS[index]);
    var token = ++meltToken;
    var next = backLayer;
    var previous = frontLayer;
    var done = false;

    function swap() {
      if (done || token !== meltToken) return;
      done = true;
      next.classList.add('is-visible');
      previous.classList.remove('is-visible');
      frontLayer = next;
      backLayer = previous;
    }

    if (initial && previous.getAttribute('src') === src) {
      previous.classList.add('is-visible');
      return;
    }

    next.onload = swap;
    next.src = src;
    if (next.decode) {
      next.decode().then(swap).catch(function () {});
    }
  }

  function preloadMelt() {
    for (var i = 0; i < MELT_LEVELS.length; i += 1) {
      var image = new Image();
      image.src = meltSrc(MELT_LEVELS[i]);
    }
  }

  var nextYearEl = document.getElementById('thaw-next-year');

  function render(initial) {
    var now = new Date();
    var todayParts = shanghaiDate(now);
    var today = dayNumber(todayParts.year, todayParts.month, todayParts.day);
    var windowInfo = findWindow(today);
    var prev = windowInfo.prev;
    var next = windowInfo.next;
    var isToday = windowInfo.isToday;

    var total = next.dayNumber - prev.dayNumber;
    var progress = isToday ? 1 : (today - prev.dayNumber) / Math.max(1, total);
    progress = Math.min(1, Math.max(0, progress));
    setMelt(progress, initial);

    var remaining = isToday ? 0 : Math.max(0, next.timestamp - now.getTime());
    var days = Math.floor(remaining / DAY_MS);
    var hours = Math.floor((remaining % DAY_MS) / 3600000);
    var minutes = Math.floor((remaining % 3600000) / 60000);
    var seconds = Math.floor((remaining % 60000) / 1000);

    els.days.textContent = String(days);
    els.hours.textContent = pad2(hours);
    els.minutes.textContent = pad2(minutes);
    els.seconds.textContent = pad2(seconds);

    if (nextYearEl) {
      nextYearEl.textContent = String(next.year);
    } else {
      els.countdownLabel.innerHTML = '距离 <b id="thaw-next-year">' + next.year + '</b> 年春节还有';
      nextYearEl = document.getElementById('thaw-next-year');
    }
  }

  var soundOn = false;
  var fadeFrame = 0;
  var gestureArmed = false;

  function setSoundUI(on) {
    soundOn = on;
    if (!els.sound) return;
    els.sound.classList.toggle('is-playing', on);
    els.sound.setAttribute('aria-pressed', on ? 'true' : 'false');
    els.sound.setAttribute('aria-label', on ? '关闭恭喜发财音乐' : '开启恭喜发财音乐');
  }

  function fadeTo(target, duration, done) {
    if (!els.audio) return;
    window.cancelAnimationFrame(fadeFrame);
    var start = els.audio.volume;
    var started = performance.now();
    function step(now) {
      var elapsed = Math.min(1, (now - started) / Math.max(1, duration));
      var eased = 1 - Math.pow(1 - elapsed, 3);
      els.audio.volume = Math.min(1, Math.max(0, start + (target - start) * eased));
      if (elapsed < 1) {
        fadeFrame = window.requestAnimationFrame(step);
      } else if (done) {
        done();
      }
    }
    fadeFrame = window.requestAnimationFrame(step);
  }

  function startSound() {
    if (!els.audio || soundOn) return;
    els.audio.muted = false;
    els.audio.volume = 0;
    var promise = els.audio.play();

    function success() {
      setSoundUI(true);
      fadeTo(0.55, 3000);
    }

    function failure() {
      setSoundUI(false);
    }

    if (promise && promise.then) {
      promise.then(success).catch(failure);
    } else {
      success();
    }
  }

  function stopSound() {
    if (!els.audio) return;
    setSoundUI(false);
    fadeTo(0, 600, function () {
      if (!soundOn) {
        els.audio.pause();
        els.audio.muted = true;
      }
    });
  }

  function armGestureUnmute() {
    if (gestureArmed) return;
    gestureArmed = true;

    function cleanup() {
      document.removeEventListener('pointerdown', onGesture, true);
      document.removeEventListener('keydown', onGesture, true);
      gestureArmed = false;
    }

    function onGesture(event) {
      if (event.target && event.target.closest && event.target.closest('#thaw-sound')) {
        cleanup();
        return;
      }
      cleanup();
      startSound();
    }

    document.addEventListener('pointerdown', onGesture, true);
    document.addEventListener('keydown', onGesture, true);
  }

  function bootSound() {
    if (!els.audio) return;
    els.audio.muted = false;
    els.audio.volume = 0;
    var promise = els.audio.play();

    if (!promise || !promise.then) {
      setSoundUI(true);
      fadeTo(0.55, 3000);
      return;
    }

    promise
      .then(function () {
        setSoundUI(true);
        fadeTo(0.55, 3000);
      })
      .catch(function () {
        els.audio.muted = true;
        els.audio.volume = 0;
        var muted = els.audio.play();
        if (muted && muted.then) {
          muted
            .then(function () {
              setSoundUI(false);
              armGestureUnmute();
            })
            .catch(function () {
              setSoundUI(false);
              armGestureUnmute();
            });
        } else {
          setSoundUI(false);
          armGestureUnmute();
        }
      });
  }

  if (els.sound && els.audio) {
    els.sound.addEventListener('click', function (event) {
      event.stopPropagation();
      if (soundOn) stopSound();
      else startSound();
    });

    els.audio.addEventListener('error', function () {
      setSoundUI(false);
    });

    if (document.readyState === 'complete') {
      bootSound();
    } else {
      window.addEventListener('load', bootSound, { once: true });
    }
  }

  if (document.readyState === 'complete') {
    preloadMelt();
  } else {
    window.addEventListener('load', preloadMelt, { once: true });
  }

  render(true);
  window.setInterval(function () {
    render(false);
  }, 1000);
})();
