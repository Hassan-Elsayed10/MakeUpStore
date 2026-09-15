const postgres = require('postgres');

async function testConnections() {
  try {
    const neonSql = postgres('postgresql://neondb_owner:npg_UmYH6Ejw1PNJ@ep-cool-snow-alhnnwy0-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require');
    const neonRes = await neonSql`SELECT 1 as connected`;
    console.log('Neon connection successful:', neonRes);
    await neonSql.end();
  } catch (err) {
    console.error('Neon connection failed:', err);
  }

  try {
    const supabaseUrl = 'postgresql://postgres:' + encodeURIComponent('E(h70669k\\1.') + '@db.jbgvvmpfeyqcvlfpxpop.supabase.co:5432/postgres';
    console.log('Testing Supabase with URL (password encoded)');
    const supabaseSql = postgres(supabaseUrl);
    const supabaseRes = await supabaseSql`SELECT 1 as connected`;
    console.log('Supabase connection successful:', supabaseRes);
    await supabaseSql.end();
  } catch (err) {
    console.error('Supabase connection failed:', err);
  }
}

testConnections();
