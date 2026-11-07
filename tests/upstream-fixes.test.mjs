import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

function dates(timezone) {
  const source = read('src/utils/date-utils.ts').replace(/^import .*;\r?\n/, '');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {}, siteConfig: { lang: 'en', timezone } };
  vm.runInNewContext(js, context);
  return context.exports;
}

test('timestamps follow site timezone across year boundaries', () => {
  assert.equal(dates('Asia/Shanghai').formatDateToYYYYMMDD('2026-12-31T18:30:00Z'), '2027-01-01');
  assert.equal(dates('America/Los_Angeles').formatDateToYYYYMMDD('2027-01-01T02:30:00Z'), '2026-12-31');
  assert.equal(dates('Asia/Shanghai').formatDynamicDate('2026-12-31T18:30:00Z'), '2027-01-01 02:30:00');
});

test('calendar dates do not shift in western timezones; invalid input is safe', () => {
  const api = dates('America/Los_Angeles');
  for (const input of ['2027-01-01', new Date('2027-01-01')]) {
    assert.equal(api.formatDateToYYYYMMDD(input), '2027-01-01');
    assert.equal(api.formatDynamicDate(input), '2027-01-01 00:00:00');
    assert.equal(api.formatDateI18n(input), 'January 1, 2027');
  }
  assert.equal(api.formatDateToYYYYMMDD('invalid'), '');
  assert.equal(api.formatDynamicDate('invalid'), '');
});

class AudioMock extends EventTarget {
  paused = true;
  duration = 200;
  currentTime = 0;
  volume = 0.7;
  muted = false;
  style = {};
  play() { this.paused = false; this.dispatchEvent(new Event('play')); return Promise.resolve(); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}

function music(withMediaSession = true) {
  const audio = new AudioMock();
  const actions = {};
  const mediaSession = { setActionHandler: (name, fn) => { actions[name] = fn; }, setPositionState: (state) => { mediaSession.position = state; } };
  const window = new EventTarget();
  window.location = { href: 'https://www.minciallo.top/' };
  window.MediaMetadata = class { constructor(data) { Object.assign(this, data); } };
  const context = {
    window, navigator: withMediaSession ? { mediaSession } : {}, MediaMetadata: window.MediaMetadata,
    document: { createElement: () => audio, body: { appendChild() {} } },
    localStorage: { getItem: () => null, setItem() {} }, CustomEvent, URL, console,
    managerConfigStr: JSON.stringify({ mode: 'local', localPlaylist: [
      { name: 'First', artist: 'Artist', url: '/first.mp3', pic: '/cover.jpg' },
      { name: 'Second', url: '/second.mp3' },
    ], i18n: {}, siteTitle: 'Test blog' }),
  };
  const script = read('src/components/features/MusicManager.astro').match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script, context);
  return { api: window.__fireflyMusic, audio, actions, mediaSession, window };
}

test('system controls and native audio events synchronize playback, metadata and seek', async () => {
  const { api, audio, actions, mediaSession } = music();
  await api.init();
  assert.equal(mediaSession.metadata.title, 'First');
  assert.equal(mediaSession.metadata.artwork[0].src, 'https://www.minciallo.top/cover.jpg');
  actions.play();
  assert.equal(api.getState().isPlaying, true);
  assert.equal(mediaSession.playbackState, 'playing');
  actions.pause();
  assert.equal(api.getState().isPlaying, false);
  assert.equal(mediaSession.playbackState, 'paused');
  actions.seekto({ seekTime: 50 });
  assert.equal(audio.currentTime, 50);
  assert.equal(mediaSession.position.position, 50);
  actions.nexttrack();
  assert.equal(mediaSession.metadata.title, 'Second');
  audio.muted = true;
  audio.volume = 0.25;
  audio.dispatchEvent(new Event('volumechange'));
  assert.equal(api.getState().isMuted, true);
  assert.equal(api.getState().volume, 0.25);
});

test('playback works without Media Session and ignores unknown stream duration', async () => {
  const { api, audio } = music(false);
  await api.init();
  api.togglePlay();
  assert.equal(api.getState().isPlaying, true);
  api.togglePlay();
  assert.equal(api.getState().isPlaying, false);
  audio.duration = Infinity;
  api.seek(0.5);
  assert.equal(audio.currentTime, 0);
});

test('sliders capture drag, clamp values, cancel cleanly and support keyboard input', () => {
  const source = read('src/components/features/MusicPlayer.astro');
  const start = source.indexOf('    function bindSlider(');
  const end = source.indexOf('    bindSlider(ui.volContainer', start);
  const bindSlider = vm.runInNewContext('(' + source.slice(start, end).trim() + ')');
  const listeners = {};
  let captured = null;
  let value = 0;
  const element = {
    addEventListener: (type, fn) => { listeners[type] = fn; },
    getBoundingClientRect: () => ({ left: 10, width: 100 }),
    setPointerCapture: (id) => { captured = id; },
    hasPointerCapture: (id) => captured === id,
    releasePointerCapture: () => { captured = null; },
  };
  bindSlider(element, (next) => { value = next; }, () => value, () => 0.05);
  const emit = (type, data = {}) => listeners[type]({ type, pointerId: 1, isPrimary: true, button: 0, preventDefault() {}, ...data });
  emit('pointerdown', { clientX: 60 });
  assert.equal(value, 0.5);
  assert.equal(captured, 1);
  emit('pointermove', { clientX: 200 });
  assert.equal(value, 1);
  emit('pointercancel');
  assert.equal(captured, null);
  emit('pointermove', { clientX: 10 });
  assert.equal(value, 1);
  emit('keydown', { key: 'Home' });
  emit('keydown', { key: 'ArrowRight' });
  assert.equal(value, 0.05);
  emit('keydown', { key: 'End' });
  assert.equal(value, 1);
});
