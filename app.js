import {load} from './vendor/js-yaml.mjs';
import {groupGigs, renderGroups} from './model.mjs';
const $ = id => document.getElementById(id);
$('theme').value = document.documentElement.dataset.theme || 'system';
$('theme').addEventListener('change', () => {
  const theme = $('theme').value;
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('gig-log-theme', theme); } catch {}
});
try {
  const response = await fetch('gigs.yaml');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = load(await response.text());
  function render() {
    const groups = groupGigs(data.gigs, {query: $('search').value, order: $('order').value, entities: data.entities});
    renderGroups(document, $('archive'), groups, data.entities, {upcoming: $('archive').dataset.upcoming, other: $('archive').dataset.other});
    const count = groups.reduce((sum, [, gigs]) => sum + gigs.length, 0);
    $('count').textContent = count === data.gigs.length ? count : `${count} / ${data.gigs.length}`;
  }
  $('search').addEventListener('input', render);
  $('order').addEventListener('change', render);
  render();
  $('loading').hidden = true;
  $('results').hidden = false;
} catch (error) {
  $('loading').hidden = true;
  $('error').hidden = false;
  console.error(error);
}
