import { ensureSchema, pool } from '../src/lib/db';
ensureSchema().then(()=>console.log('schema ready')).finally(()=>pool.end());
