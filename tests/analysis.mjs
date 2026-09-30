// Run: node tests/analysis.mjs. Tests are isolated: no secrets, network or saved reports.
import assert from 'node:assert/strict';
import {mkdtempSync, symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const root = fileURLToPath(new URL('..', import.meta.url));
const output = mkdtempSync(path.join(tmpdir(), 'jan-seva-analysis-'));
execFileSync(process.execPath, [fileURLToPath(import.meta.resolve('typescript/bin/tsc')), 'app/api/analyse/route.ts', '--outDir', output, '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck', '--esModuleInterop'], {cwd: root, stdio: 'pipe'});
symlinkSync(path.join(root, 'node_modules'), path.join(output, 'node_modules'), 'dir');
const {GET, POST} = await import(pathToFileURL(path.join(output, 'app/api/analyse/route.js')));
const {analyse, areas, seed, districtsFor, ranked} = await import(pathToFileURL(path.join(output, 'lib/model.js')));
const names = ['VERTEX_API_KEY', 'VERTEX_MODEL', 'GEMINI_API_KEY', 'GEMINI_MODEL'];
for (const name of names) delete process.env[name];
const text = 'बारिश के बाद नाली और सड़क का पानी स्कूल के सामने भर जाता है।';
const input = (body, origin = 'http://localhost:3000') => new Request('http://localhost:3000/api/analyse', {method: 'POST', headers: {origin, 'Content-Type': 'application/json'}, body: typeof body === 'string' ? body : JSON.stringify(body)});
const successful = () => Response.json({candidates: [{finishReason: 'STOP', content: {parts: [{text: 'private reasoning', thought: true}, {text: 'Rainwater floods the road outside the school.'}]}}]});
(async () => {
  let calls = 0;
  global.fetch = async () => {calls++; throw Error('Unexpected network request');};
  assert.deepEqual(await (await GET()).json(), {configured: false, provider: 'Built-in rules'});
  assert.equal((await POST(input('{'))).status, 400);
  assert.equal((await POST(input({text: 'short'}))).status, 400);
  assert.equal((await POST(input({text: ' '.repeat(15)}))).status, 400);
  assert.equal((await POST(input({text: 'x'.repeat(2001)}))).status, 400);
  assert.equal((await POST(input({text}, 'https://other.example'))).status, 403);
  const rules = await (await POST(input({text}))).json();
  assert.equal(rules.aiUsed, false);
  assert.equal(rules.summary, text);
  assert.equal(calls, 0);
  process.env.GEMINI_API_KEY = 'test-developer-key';
  process.env.GEMINI_MODEL = 'test-model';
  global.fetch = async (url, options) => {
    calls++;
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/test-model:generateContent');
    assert.equal(options.headers['x-goog-api-key'], 'test-developer-key');
    const request = JSON.parse(options.body);
    assert.equal(request.contents[0].parts[0].text, text);
    assert(request.systemInstruction);
    return successful();
  };
  const ai = await (await POST(input({text}))).json();
  assert.equal(ai.aiUsed, true);
  assert.equal(ai.summary, 'Rainwater floods the road outside the school.');
  assert.equal(ai.category, analyse(text).category);
  assert.equal(ai.severity, analyse(text).severity);
  process.env.VERTEX_API_KEY = 'test-vertex-key';
  // Partial Vertex configuration must not call the Developer API.
  assert.equal((await (await GET()).json()).configured, false);
  assert.equal((await (await POST(input({text}))).json()).aiUsed, false);
  assert.equal(calls, 1);
  process.env.VERTEX_MODEL = 'test-cloud-model';
  const status = await (await GET()).json();
  assert.equal(status.provider, 'Google Cloud Vertex AI');
  assert(!JSON.stringify(status).includes('test-vertex-key'));
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://aiplatform.googleapis.com/v1/publishers/google/models/test-cloud-model:generateContent');
    assert.equal(options.headers['x-goog-api-key'], 'test-vertex-key');
    return successful();
  };
  assert.equal((await (await POST(input({text}))).json()).aiUsed, true);
  for (const response of [new Response('', {status: 429}), Response.json({}), Response.json({candidates: [{finishReason: 'MAX_TOKENS', content: {parts: [{text: 'Partial'}]}}]}), Response.json({candidates: [{finishReason: 'STOP', content: {parts: [{text: '  '}]}}]})]) {
    global.fetch = async () => response;
    const fallback = await (await POST(input({text}))).json();
    assert.equal(fallback.aiUsed, false);
    assert.equal(fallback.summary, text);
    assert.match(fallback.engine, /unavailable/);
  }
  global.fetch = async () => {throw Error('Timeout');};
  assert.equal((await (await POST(input({text}))).json()).aiUsed, false);
  assert.equal(districtsFor('India').length, 75);
  const projects = ranked(seed).filter(a => a.country === 'India');
  assert.equal(projects.length, 11);
  assert.equal(new Set(projects.map(a => a.district)).size, 6);
  assert.equal(new Set(areas.map(a => a.country)).size, 11);
  console.log('PASS: validation, rules-only mode, Gemini/Vertex routing, provider precedence, secret-free status, summary parsing, unchanged severity, safe fallbacks and India pilot coverage. No live API calls.');
})().catch(error => {console.error(error); process.exitCode = 1;});
