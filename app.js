import {groupGigs, renderGroups} from './model.mjs';
const $ = id => document.getElementById(id);
try {
  const response = await fetch('data/gigs.json');
  if (!response.ok) throw new Error('Archive unavailable');
  const data = await response.json();
  $('title').textContent = data.title;
  $('count').textContent = data.gigs.length;
  function render() {
    const groups=groupGigs(data.gigs,{query:$('search').value,order:$('order').value,entities:data.entities});
    renderGroups(document,$('archive'),groups,data.entities);
    const count=groups.reduce((sum,[,gigs])=>sum+gigs.length,0);
    $('status').textContent=count===data.gigs.length?`The complete archive · ${count} shows`:`${count} of ${data.gigs.length} shows${count?'':' — try another search'}`;
  }
  $('search').addEventListener('input',render); $('order').addEventListener('change',render); render();
} catch(error) { $('status').textContent='Could not load the archive. Please reload or view the raw list above.'; console.error(error); }
