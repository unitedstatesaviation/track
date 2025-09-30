export async function onRequest(context) {
  const upstream = 'https://live.env.vnas.vatsim.net/data-feed/controllers.json';
  try {
    const res = await fetch(upstream, { cf: { cacheEverything: false } });
    const body = await res.text();
    const headers = new Headers();
    headers.set('Content-Type', res.headers.get('content-type') || 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    return new Response(body, { status: res.status, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'upstream fetch failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
