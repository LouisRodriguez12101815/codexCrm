import { ensureSchema,q,pool } from '../src/lib/db';
async function main(){ await ensureSchema(); for(const l of [['Avery Sample','Sunrise Tours','+15550101001','avery@example.invalid'],['Jordan Demo','Gulf Coast Supply','+15550101002','jordan@example.invalid']]){ await q('INSERT INTO leads(name,company,phone,email,source) VALUES($1,$2,$3,$4,$5)',[...l,'sample-seed']); } console.log('seeded sample leads'); }
main().finally(()=>pool.end());
