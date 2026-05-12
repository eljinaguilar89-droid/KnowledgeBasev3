const payload = {
  title: 'Test Server ID 3',
  excerpt: 'x',
  content: 'x',
  author: 'Tester',
  date: 'now',
  views: 0,
  category: 'Audit Logs',
  categoryColor: 'bg',
  categoryIcon: 'FileText',
  badge: '',
  status: 'Draft',
  accessLevel: 'Public'
};

(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.text();
    try {
      console.log('RESPONSE:', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('RESPONSE RAW:', data);
    }
  } catch (e) {
    console.error('ERR', e);
  }
})();
