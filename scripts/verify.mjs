import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {groupGigs,renderGroups} from '../model.mjs';
import {load} from '../vendor/js-yaml.mjs';
const raw=new TextDecoder('utf-8',{fatal:true}).decode(readFileSync(new URL('../gigs.yaml',import.meta.url)));
assert(!raw.includes('\r'),'CR line endings are forbidden');
const data=load(raw);
assert.equal(data.version,1);
assert(Array.isArray(data.gigs));assert(Array.isArray(data.entities));
assert.deepEqual(data.gigs.map(g=>g.date||'9999'),data.gigs.map(g=>g.date||'9999').sort(),'Gigs must be oldest to newest; undated gigs go last');
const ids=new Set();const entities=new Set();
function links(items){assert(Array.isArray(items));for(const l of items){assert.equal(typeof l.label,'string');assert(['http:','https:'].includes(new URL(l.url).protocol));}}
for(const e of data.entities){assert(e.id&&!entities.has(e.id));entities.add(e.id);assert.equal(typeof e.name,'string');assert.equal(typeof e.type,'string');links(e.links);}
for(const g of data.gigs){assert.equal(typeof g.text,'string');assert(g.id&&!ids.has(g.id));ids.add(g.id);assert(g.date===null || (/^\d{4}-\d{2}-\d{2}$/.test(g.date)&&new Date(g.date).toISOString().slice(0,10)===g.date));links(g.links);assert(Array.isArray(g.tags)&&g.tags.every(t=>typeof t==='string'));assert(Array.isArray(g.entityIds));for(const id of g.entityIds)assert(entities.has(id),`Missing entity ${id}`);assert.equal(typeof g.notes,'string');}
// Exercise the same renderer used by the page with a minimal DOM, inspecting every output row.
class Element {constructor(tag){this.tag=tag;this.childNodes=[];}append(...nodes){this.childNodes.push(...nodes);}replaceChildren(){this.childNodes=[];}}
const document={createElement:tag=>new Element(tag)};
function descendants(el){return [el,...el.childNodes.flatMap(descendants)];}
for(const order of ['asc','desc']){
 const root=new Element('div');renderGroups(document,root,groupGigs(data.gigs,{order}),data.entities);
 const rows=descendants(root).filter(e=>e.className==='gig');assert.equal(rows.length,data.gigs.length);
 assert.deepEqual(descendants(root).filter(e=>e.className==='original').map(e=>e.textContent).sort(),data.gigs.map(g=>g.text).sort());
}
const fixtures=[{id:'a',date:null,text:'Unparsed  ',tags:[],entityIds:[],notes:''},{id:'b',date:'2027-01-16',text:'future',tags:[],entityIds:[],notes:''}];
assert.deepEqual(groupGigs(fixtures,{today:new Date(2026,10,13)}).map(([key])=>key),['Upcoming','Other']);
assert.equal(groupGigs(fixtures,{query:'unparsed'})[0][1][0].text,'Unparsed  ');
assert.equal(groupGigs(fixtures,{query:'no match'}).length,0);
console.log(`Verified UTF-8, LF, metadata references, exact rendered text and ${data.gigs.length} rendered gigs in both sort orders.`);
