# Sheba Hospital: Supabase + GitHub Pages (sob free)

## Part 1: Supabase (database + login)
1. supabase.com e account kholo > New project (naam: hospital, ekta database password dao, region Singapore). 1-2 min opekkha koro.
2. Left menu > SQL Editor > New query. `sql/schema.sql` er puro lekha paste kore Run koro. "Success" dekhabe.
3. Authentication > Sign In / Providers: **Allow anonymous sign-ins** chalu koro (guest er jonno). Testing er somoy **Confirm email** bondho rakho, na hole signup e email confirm lagbe.
4. Project Settings > API: **Project URL** ar **anon public key** copy kore `js/config.js` e boshao. (service_role key kokhono na.)

## Part 2: Prothom admin, doctor, staff banano
Sobai app er "রোগী হিসেবে সাইন আপ" diye account kholbe, tarpor role Supabase SQL Editor e thik korba:

    -- admin
    update profiles set role='admin' where id=(select id from auth.users where email='tomar@email.com');
    -- doctor (doctor_id = doctors table er id, 1 = Dr. Rahim)
    update profiles set role='doctor', doctor_id=1 where id=(select id from auth.users where email='doctor@email.com');
    -- staff
    update profiles set role='staff' where id=(select id from auth.users where email='staff@email.com');

Role bodle logout kore abar login koro. Role shudhu admin ba SQL Editor theke bodlano jay, user nijer role bodlate parbe na.

## Part 3: GitHub Pages (link pawa)
1. github.com e account > New repository (naam: hospital, Public). 
2. "uploading an existing file" e click kore **folder er bhitorer sob file** (index.html, css, js, sql, README.md) drag kore daw. js/ ar css/ folder gulo-o drag korle folder structure thake. Commit changes.
3. Repository > Settings > Pages > Source: Deploy from a branch > Branch: main, folder: / (root) > Save.
4. 1-2 min por link hobe: `https://tomar-github-username.github.io/hospital/`. Oi link jake khushi dao.
5. Edit korle: GitHub e file khule pencil icon diye edit kore commit korle site nijei update hoy.

## Folder
index.html, css/style.css, js/config.js (key), js/data.js (state + Supabase load), js/auth.js (login), js/views.js (screen), js/actions.js (DB write), js/ai.js (AI), js/voice.js (chat+mic), sql/schema.sql

## Jante rakho
- Anon key public thake, shuroksha RLS policy (schema.sql) diye. RLS na dile keu-i sob data pore/mute dite parbe, tai schema.sql puro run korte bhulo na.
- Free Supabase project onek din na use korle pause hoy, Supabase dashboard theke Restore kora jay.
- Ekhane real rogir data rakhle privacy/aain mene chola dorkar. Eta ekhono project/demo level.
- Bill, prescription, lab, ward admit, staff list ekhono nei.
