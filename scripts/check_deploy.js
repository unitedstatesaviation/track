const fetch = require('node-fetch');
const [,, base] = process.argv;
if(!base){
  console.error('Usage: node scripts/check_deploy.js <base-url>\nExample: node scripts/check_deploy.js https://your-pages-domain.pages.dev');
  process.exit(2);
}

async function probe(path){
  const url = new URL(path, base).toString();
  console.log('\n->', url);
  try{
    const res = await fetch(url, { method: 'GET' });
    console.log('Status:', res.status, res.statusText);
    console.log('Content-Type:', res.headers.get('content-type'));
    console.log('Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));
    const text = await res.text();
    console.log('Body preview:', text.slice(0, 400).replace(/\n/g,' '));
  }catch(e){
    console.error('Fetch failed:', e.message);
  }
}

(async ()=>{
  await probe('/proxy/controllers.json');
  await probe('/overrides.json');
})();
