export function groupGigs(gigs, {query = '', order = 'desc', today = new Date(), entities = []} = {}) {
  const now = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const names = new Map(entities.map(e => [e.id, e.name]));
  const visible = gigs.filter(g => [g.text,g.notes,...g.tags,...g.entityIds.map(id=>names.get(id)||'')].join(' ').toLowerCase().includes(query.toLowerCase()));
  visible.sort((a,b) => (order === 'asc' ? 1 : -1)*(a.date||'').localeCompare(b.date||''));
  const groups = new Map();
  for (const gig of visible) {
    const key = !gig.date ? 'Other' : gig.date > now ? 'Upcoming' : gig.date.slice(0,4);
    if (!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(gig);
  }
  return [...groups].sort(([a],[b])=>a==='Upcoming'?-1:b==='Upcoming'?1:a==='Other'?1:b==='Other'?-1:(order==='asc'?1:-1)*a.localeCompare(b));
}
export function renderGroups(document, target, groups, entities) {
  target.replaceChildren();
  const entityMap = new Map(entities.map(e=>[e.id,e]));
  function link(parent, item) {
    try { if (!['https:','http:'].includes(new URL(item.url).protocol)) return; } catch { return; }
    const a=document.createElement('a'); a.href=item.url; a.textContent=item.label; a.rel='noopener noreferrer'; parent.append(a);
  }
  for (const [name,gigs] of groups) {
    const section=document.createElement('section'); section.className=name==='Upcoming'?'year upcoming':'year';
    const h=document.createElement('h2'); h.textContent=`${name} / ${gigs.length}`; section.append(h);
    const list=document.createElement('ol');
    for (const gig of gigs) {
      const item=document.createElement('li'); item.id=gig.id; item.className='gig';
      const p=document.createElement('p'); p.className='original'; p.textContent=gig.text; item.append(p);
      if (gig.notes) { const note=document.createElement('p'); note.className='note'; note.textContent=gig.notes; item.append(note); }
      const meta=document.createElement('div'); meta.className='meta';
      for (const id of gig.entityIds) { const e=entityMap.get(id); if(e) {const span=document.createElement('span'); span.textContent=`${e.type}: ${e.name}`; meta.append(span); for(const l of e.links||[])link(meta,l);} }
      for(const tag of gig.tags) {const span=document.createElement('span');span.textContent=`#${tag}`;meta.append(span);}
      for(const l of gig.links)link(meta,l);
      if(meta.childNodes.length)item.append(meta);
      list.append(item);
    }
    section.append(list);target.append(section);
  }
}
