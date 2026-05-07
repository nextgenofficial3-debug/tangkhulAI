const url = 'https://pfgmiwhjhforjejxgufr.supabase.co/rest/v1';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZ21pd2hqaGZvcmplanhndWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDg1NTYsImV4cCI6MjA5MzU4NDU1Nn0.qVsPmG7q5PpF5x8xH2rknmaOvWkZBlTiXFhD64vH_Mc';

async function check() {
  for (const table of ['words', 'corrections', 'learned_pairs', 'chat_corrections']) {
    try {
      const res = await fetch(`${url}/${table}?select=*`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Prefer': 'count=exact' }
      });
      console.log(table, res.headers.get('content-range'));
      const text = await res.text();
      console.log('Response sample:', text.substring(0, 100));
    } catch(e) {
      console.log(table, 'ERROR', e.message);
    }
  }
}
check();
