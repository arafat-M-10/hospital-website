-- Supabase > SQL Editor e puro file ta paste kore Run koro.
create table doctors(id serial primary key,name text not null,spec text,bn text,room int,fee numeric default 0);
create table patients(id serial primary key,name text not null,age int default 0,user_id uuid references auth.users(id) on delete set null);
create table appointments(id serial primary key,patient_id int references patients(id) on delete cascade,doctor_id int references doctors(id) on delete cascade,date date not null,time text not null,status text not null default 'BOOKED' check(status in('BOOKED','COMPLETED','CANCELLED')));
create unique index uq_slot on appointments(doctor_id,date,time) where status='BOOKED';
create table wards(id serial primary key,name text,beds int,occupied int default 0,daily_charge numeric);
create table medicines(id serial primary key,name text,qty int default 0,price numeric default 0);
create table bills(id serial primary key,patient_id int references patients(id) on delete cascade,item text,amount numeric,paid numeric default 0);
create table profiles(id uuid primary key references auth.users(id) on delete cascade,role text not null default 'patient' check(role in('admin','doctor','staff','patient')),name text,doctor_id int references doctors(id));

create function my_role() returns text language sql stable security definer set search_path=public as $$ select role from profiles where id=auth.uid() $$;
create function my_doctor() returns int language sql stable security definer set search_path=public as $$ select doctor_id from profiles where id=auth.uid() $$;
create function my_patients() returns setof int language sql stable security definer set search_path=public as $$ select id from patients where user_id=auth.uid() $$;

-- notun user signup korle auto 'patient' profile
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into profiles(id,role,name) values(new.id,'patient',coalesce(new.raw_user_meta_data->>'name',case when new.is_anonymous then 'Guest' else split_part(new.email,'@',1) end)); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

alter table doctors enable row level security;alter table patients enable row level security;alter table appointments enable row level security;
alter table wards enable row level security;alter table medicines enable row level security;alter table bills enable row level security;alter table profiles enable row level security;

create policy p_doc_r on doctors for select to authenticated using(true);
create policy p_doc_w on doctors for all to authenticated using(my_role()='admin') with check(my_role()='admin');
create policy p_ward_r on wards for select to authenticated using(true);
create policy p_ward_w on wards for all to authenticated using(my_role()='admin') with check(my_role()='admin');
create policy p_med_r on medicines for select to authenticated using(true);
create policy p_med_w on medicines for all to authenticated using(my_role()='admin') with check(my_role()='admin');
create policy p_bill on bills for all to authenticated using(my_role()='admin') with check(my_role()='admin');
create policy p_prof_r on profiles for select to authenticated using(id=auth.uid() or my_role()='admin');
create policy p_prof_w on profiles for update to authenticated using(my_role()='admin') with check(my_role()='admin');
create policy p_pat_r on patients for select to authenticated using(my_role() in('admin','staff','doctor') or user_id=auth.uid());
create policy p_pat_i on patients for insert to authenticated with check(my_role() in('admin','staff') or user_id=auth.uid());
create policy p_pat_u on patients for update to authenticated using(my_role() in('admin','staff')) with check(my_role() in('admin','staff'));
create policy p_ap_r on appointments for select to authenticated using(my_role() in('admin','staff') or (my_role()='doctor' and doctor_id=my_doctor()) or patient_id in(select my_patients()));
create policy p_ap_i on appointments for insert to authenticated with check(my_role() in('admin','staff') or patient_id in(select my_patients()));
create policy p_ap_u on appointments for update to authenticated using(my_role() in('admin','staff') or (my_role()='doctor' and doctor_id=my_doctor()) or patient_id in(select my_patients()));

-- demo data
insert into doctors(name,spec,bn,room,fee) values('Dr. Rahim Uddin','Cardiology','হৃদরোগ',101,800),('Dr. Nusrat Jahan','Gynecology','গাইনি',102,700),('Dr. Kamal Hossain','Medicine','মেডিসিন',103,500),('Dr. Ayesha Siddika','Pediatrics','শিশু',104,600);
insert into wards(name,beds,occupied,daily_charge) values('General Ward',20,12,500),('ICU',6,5,3000),('Cabin',10,4,2000);
insert into medicines(name,qty,price) values('Napa',120,2),('Seclo',8,7),('Ace',40,2),('Histacin',25,3);
