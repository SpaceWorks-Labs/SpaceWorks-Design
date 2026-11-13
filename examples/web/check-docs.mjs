import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import GithubSlugger from '../../site/node_modules/github-slugger/index.js';
const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync('docs/components/manifest.json','utf8'));
const placements=JSON.parse(fs.readFileSync('docs/adoption/sidebar-map.json','utf8')).pages;
const errors=[]; let linkCount=0, anchorCount=0;
const fail=message=>errors.push(message);
function cleanMarkdown(text) { return text.replace(/^(`{3}|~{3})[^\n]*\n[\s\S]*?^\1\s*$/gm,''); }
function anchors(file) {
  const content=cleanMarkdown(fs.readFileSync(file,'utf8')), result=new Set(), slugger=new GithubSlugger();
  for(const line of content.split(/\r?\n/)) { const m=line.match(/^#{1,6}\s+(.+)/); if(m)result.add(slugger.slug(m[1])); }
  for(const m of content.matchAll(/\bid=["']([^"']+)["']/g)) result.add(m[1]);
  return result;
}
const allPages=placements.map(x=>x.source).concat(['examples/web/README.md','examples/android/README.md','examples/ios/README.md']);
for(const file of allPages) {
  if(!fs.existsSync(file)){fail('Missing page '+file);continue;}
  const content=cleanMarkdown(fs.readFileSync(file,'utf8'));
  for(const m of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    let href=m[1]; if(/^(https?:|mailto:)/.test(href))continue;
    const [local,hash]=href.split('#'); const target=local?path.resolve(path.dirname(file),decodeURIComponent(local)):path.resolve(file);
    linkCount++;
    if(!fs.existsSync(target)){fail(file+': missing '+href);continue;}
    if(hash&&/\.(md|html)$/.test(target)){anchorCount++; if(!anchors(target).has(decodeURIComponent(hash)))fail(file+': missing anchor '+href);}
  }
}
const stateNames=['Default','Hover','Pressed','Focus-visible','Selected','Disabled','Read-only','Loading / pending','Empty','Filtered-empty','Error / retry','Offline','Success','Interrupted work'];
for(const c of manifest.components){
  const file='docs/components/'+c.slug+'.md', content=fs.readFileSync(file,'utf8');
  for(let i=1;i<=12;i++)if(!new RegExp('^## '+i+'\\. ','m').test(content))fail(file+': missing template section '+i);
  for(const state of stateNames)if(!content.includes('| '+state+' |'))fail(file+': missing state '+state);
  if(!content.includes('| Variant |')||!content.includes('| Key / input |'))fail(file+': missing variant/keyboard table');
}
const a11y=fs.readFileSync('docs/accessibility.md','utf8');
const criteria=[...a11y.matchAll(/^\| \[(\d\.\d\.\d+)/gm)].map(x=>x[1]);
if(criteria.length!==55||new Set(criteria).size!==55)fail('WCAG criterion count/uniqueness');
const patterns=fs.readFileSync('docs/patterns/README.md','utf8');
for(const letter of ['P','L'])for(let i=1;i<=(letter==='P'?30:10);i++)if(!patterns.includes('### '+letter+i+' — '))fail('Missing named pattern '+letter+i);
const baseline=JSON.parse(fs.readFileSync('docs/components/source-inventory.json','utf8'));
const preservation=[];
for(const source of baseline.sources){
  const body=fs.readFileSync(source.path,'utf8'), current=anchors(source.path);
  for(const h of source.headings)if(!current.has(h.anchor))fail('Lost source heading '+source.path+'#'+h.anchor);
  for(const row of source.tables)for(const cell of row.cells)if(cell&&!body.includes(cell))fail('Lost source table cell '+source.path+':'+row.line);
  for(const link of source.links)if(!body.includes(link.target))fail('Lost source URL '+source.path+':'+link.line);
  for(const block of source.code)if(!body.replaceAll('\r\n','\n').includes(block.body))fail('Lost source code block '+source.path+':'+block.line);
  preservation.push({source:source.path,headings:source.headings.length,tableRows:source.tables.length,links:source.links.length,codeBlocks:source.code.length,unchangedHash:crypto.createHash('sha256').update(body).digest('hex')===source.sha256});
}
const result={date:'2026-11-13',componentPages:manifest.components.length,templateSections:12,statesPerPage:14,criteria:criteria.length,patterns:30,layouts:10,pages:placements.length,localLinks:linkCount,fragmentLinks:anchorCount,preservation,errors};
fs.mkdirSync('examples/web/verification',{recursive:true});
fs.writeFileSync('examples/web/verification/docs-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
if(errors.length)process.exitCode=1;
