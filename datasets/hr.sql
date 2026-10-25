-- HR: a 300-person company with a five-level reporting hierarchy, salary
-- history, and projects staffed across departments. Generated deterministically.
SELECT setseed(0.17);

CREATE TABLE departments (
  department_id int PRIMARY KEY,
  name          text NOT NULL UNIQUE,
  location      text NOT NULL,
  budget        numeric(12,2) NOT NULL
);

CREATE TABLE employees (
  employee_id      int PRIMARY KEY,
  first_name       text NOT NULL,
  last_name        text NOT NULL,
  email            text NOT NULL UNIQUE,
  job_title        text NOT NULL,
  department_id    int NOT NULL REFERENCES departments,
  manager_id       int REFERENCES employees,
  salary           numeric(10,2) NOT NULL CHECK (salary > 0),
  hire_date        date NOT NULL,
  termination_date date CHECK (termination_date > hire_date)
);

CREATE TABLE salary_history (
  employee_id    int NOT NULL REFERENCES employees,
  salary         numeric(10,2) NOT NULL,
  effective_from date NOT NULL,
  PRIMARY KEY (employee_id, effective_from)
);

CREATE TABLE projects (
  project_id    int PRIMARY KEY,
  name          text NOT NULL UNIQUE,
  department_id int NOT NULL REFERENCES departments,
  start_date    date NOT NULL,
  end_date      date CHECK (end_date >= start_date),
  budget        numeric(12,2) NOT NULL
);

CREATE TABLE assignments (
  employee_id int NOT NULL REFERENCES employees,
  project_id  int NOT NULL REFERENCES projects,
  role        text NOT NULL CHECK (role IN ('lead', 'contributor', 'reviewer')),
  hours       numeric(6,1) NOT NULL CHECK (hours > 0),
  PRIMARY KEY (employee_id, project_id)
);

INSERT INTO departments VALUES
  (1, 'Executive', 'New York', 2500000), (2, 'Engineering', 'Berlin', 9000000),
  (3, 'Sales', 'New York', 5000000), (4, 'Marketing', 'London', 2200000),
  (5, 'Finance', 'New York', 1800000), (6, 'People', 'London', 1200000),
  (7, 'Support', 'Manila', 2000000), (8, 'Operations', 'Chicago', 2600000),
  (9, 'Legal', 'New York', 1500000), (10, 'Research', 'Toronto', 800000);

-- Name pools shared by every level.
CREATE TEMP TABLE _names AS SELECT
  ARRAY['Aaliyah','Ben','Carmen','Dev','Elif','Felix','Gita','Hassan','Ines','Jonas','Keiko','Luis','Mei','Nadia',
        'Oscar','Pia','Quentin','Rosa','Samir','Tara','Umar','Vera','Wen','Ximena','Yusuf','Zoe','Arjun','Bianca',
        'Caleb','Dalia','Emeka','Freya','Gabriel','Hana','Isaac','Julia','Kwame','Lena','Marco','Noor'] AS first,
  ARRAY['Abara','Bauer','Castillo','Dimitrov','Eriksen','Fischer','Gupta','Horvat','Iyer','Johansson','Kaur',
        'Lindqvist','Mahlangu','Nakamura','Oyelaran','Petrov','Quinn','Ramos','Schultz','Takahashi','Usman','Varga',
        'Walsh','Xu','Yilmaz','Zielinski','Adeyemi','Brennan','Chowdhury','Delgado'] AS last;

-- Level 0 and 1: the CEO and one head per department (2-9; Research has nobody yet).
INSERT INTO employees VALUES
  (1, 'Margaret', 'Okonkwo', 'margaret.okonkwo@acme.example', 'Chief Executive Officer', 1, NULL, 350000, '2012-03-01', NULL);

INSERT INTO employees
SELECT d.department_id, s.fn, s.ln,
       lower(s.fn || '.' || s.ln) || d.department_id || '@acme.example',
       CASE d.name WHEN 'Finance' THEN 'Chief Financial Officer' WHEN 'Legal' THEN 'General Counsel'
                   ELSE 'VP of ' || d.name END,
       d.department_id, 1,
       round((190000 + s.r * 60000) / 1000) * 1000,
       date '2013-01-01' + floor(s.h * 2000)::int,
       NULL
FROM departments d
JOIN (
  SELECT department_id,
         n.first[1 + floor(random() * 40)::int] AS fn, n.last[1 + floor(random() * 30)::int] AS ln,
         random() AS r, random() AS h
  FROM departments, _names n
  ORDER BY department_id
) s USING (department_id)
WHERE d.department_id BETWEEN 2 AND 9;

-- Level 2: three managers per department, 10-33.
INSERT INTO employees
SELECT id, fn, ln, lower(fn || '.' || ln) || id || '@acme.example',
       (ARRAY['Engineering Manager','Sales Manager','Marketing Manager','Finance Manager','People Manager',
              'Support Manager','Operations Manager','Legal Manager'])[dept - 1],
       dept, dept,
       round((115000 + r * 55000) / 500) * 500,
       date '2015-01-01' + floor(h * 2400)::int,
       NULL
FROM (
  SELECT id, 2 + (id - 10) % 8 AS dept,
         n.first[1 + floor(random() * 40)::int] AS fn, n.last[1 + floor(random() * 30)::int] AS ln,
         random() AS r, random() AS h
  FROM generate_series(10, 33) AS id, _names n
  ORDER BY id
) m;

-- Level 3: individual contributors, 34-259, spread unevenly across departments.
CREATE TEMP TABLE _titles(dept, titles, base) AS VALUES
  (2, ARRAY['QA Engineer','Software Engineer','Data Engineer','Senior Software Engineer','Staff Engineer'], 95000),
  (3, ARRAY['Sales Development Rep','Account Executive','Account Manager','Senior Account Executive'], 70000),
  (4, ARRAY['Content Writer','Designer','Marketing Specialist','Senior Marketing Specialist'], 68000),
  (5, ARRAY['Accountant','Financial Analyst','Senior Financial Analyst'], 75000),
  (6, ARRAY['HR Coordinator','Recruiter','HR Business Partner'], 62000),
  (7, ARRAY['Support Specialist','Support Engineer','Senior Support Engineer'], 52000),
  (8, ARRAY['Logistics Coordinator','Operations Analyst','Senior Operations Analyst'], 60000),
  (9, ARRAY['Paralegal','Counsel','Senior Counsel'], 90000);

INSERT INTO employees
SELECT s.id, s.fn, s.ln, lower(s.fn || '.' || s.ln) || s.id || '@acme.example',
       t.titles[1 + floor(s.tr * array_length(t.titles, 1))::int],
       s.dept,
       10 + (s.dept - 2) + 8 * floor(s.mr * 3)::int,
       round(t.base * (0.85 + 0.2 * floor(s.tr * array_length(t.titles, 1)) + 0.15 * s.r) / 500) * 500,
       s.hire,
       CASE WHEN s.q < 0.09 THEN least(s.hire + 180 + floor(s.r * 1000)::int, date '2025-12-15') END
FROM (
  SELECT id,
         CASE WHEN d < 0.36 THEN 2 WHEN d < 0.56 THEN 3 WHEN d < 0.70 THEN 7 WHEN d < 0.80 THEN 8
              WHEN d < 0.88 THEN 4 WHEN d < 0.93 THEN 5 WHEN d < 0.97 THEN 6 ELSE 9 END AS dept,
         fn, ln, tr, mr, r, q, date '2016-01-01' + floor(h * 3580)::int AS hire
  FROM (
    SELECT id, random() AS d, n.first[1 + floor(random() * 40)::int] AS fn, n.last[1 + floor(random() * 30)::int] AS ln,
           random() AS tr, random() AS mr, random() AS r, random() AS q, random() AS h
    FROM generate_series(34, 259) AS id, _names n
    ORDER BY id
  ) x
) s
JOIN _titles t ON t.dept = s.dept;

-- Level 4: juniors, 260-300, each reporting to an individual contributor in their department.
INSERT INTO employees
SELECT s.id, s.fn, s.ln, lower(s.fn || '.' || s.ln) || s.id || '@acme.example',
       'Junior ' || t.titles[1],
       s.dept,
       (SELECT e.employee_id FROM employees e
        WHERE e.department_id = s.dept AND e.employee_id BETWEEN 34 AND 259
        ORDER BY e.employee_id
        OFFSET floor(s.mr * (SELECT count(*) FROM employees c WHERE c.department_id = s.dept AND c.employee_id BETWEEN 34 AND 259))::int
        LIMIT 1),
       round(t.base * (0.6 + 0.1 * s.r) / 500) * 500,
       s.hire,
       CASE WHEN s.q < 0.05 THEN least(s.hire + 120 + floor(s.r * 300)::int, date '2025-12-15') END
FROM (
  SELECT id,
         CASE WHEN d < 0.45 THEN 2 WHEN d < 0.65 THEN 3 WHEN d < 0.80 THEN 7 WHEN d < 0.90 THEN 8 ELSE 4 END AS dept,
         fn, ln, mr, r, q, date '2023-06-01' + floor(h * 880)::int AS hire
  FROM (
    SELECT id, random() AS d, n.first[1 + floor(random() * 40)::int] AS fn, n.last[1 + floor(random() * 30)::int] AS ln,
           random() AS mr, random() AS r, random() AS q, random() AS h
    FROM generate_series(260, 300) AS id, _names n
    ORDER BY id
  ) x
) s
JOIN _titles t ON t.dept = s.dept;

-- A raise roughly every 18 months, about 5% each; the latest row is the current salary.
INSERT INTO salary_history
SELECT e.employee_id,
       CASE WHEN k = n - 1 THEN e.salary ELSE round(e.salary * power(0.95, n - 1 - k) / 100) * 100 END,
       e.hire_date + k * 540
FROM (
  SELECT *, least(5, 1 + (least(coalesce(termination_date, date '2025-12-31'), date '2025-12-31') - hire_date) / 540) AS n
  FROM employees
) e
CROSS JOIN generate_series(0, 4) AS k
WHERE k < e.n;

INSERT INTO projects VALUES
  (1, 'Checkout Rewrite', 2, '2023-02-01', '2024-03-31', 1200000),
  (2, 'Mobile App v3', 2, '2024-01-15', NULL, 1800000),
  (3, 'Data Platform', 2, '2022-09-01', '2024-12-20', 2400000),
  (4, 'Search Relevance', 2, '2025-03-01', NULL, 650000),
  (5, 'Payments Migration', 2, '2024-06-01', '2025-05-30', 900000),
  (6, 'Enterprise Push', 3, '2024-01-01', '2024-12-31', 400000),
  (7, 'Partner Channel', 3, '2025-02-01', NULL, 350000),
  (8, 'Renewals Desk', 3, '2023-05-01', '2023-12-15', 150000),
  (9, 'Brand Refresh', 4, '2023-09-01', '2024-04-30', 300000),
  (10, 'Spring Campaign', 4, '2025-02-15', '2025-05-31', 220000),
  (11, 'Annual Audit 2024', 5, '2025-01-06', '2025-03-28', 120000),
  (12, 'Budget Tooling', 5, '2024-04-01', NULL, 180000),
  (13, 'Hiring Pipeline', 6, '2024-02-01', '2024-09-30', 90000),
  (14, 'Engagement Survey', 6, '2025-04-01', NULL, 40000),
  (15, 'Help Center', 7, '2023-03-01', '2023-10-31', 160000),
  (16, 'Chat Support', 7, '2024-08-01', NULL, 210000),
  (17, 'Warehouse Automation', 8, '2023-01-10', '2024-06-30', 1500000),
  (18, 'Carrier Integration', 8, '2024-09-01', NULL, 380000),
  (19, 'Contract Repository', 9, '2024-03-01', '2024-11-29', 110000),
  (20, 'Privacy Program', 9, '2025-01-15', NULL, 140000),
  (21, 'Quantum Pricing', 10, '2025-06-01', NULL, 500000);

-- Staffing is a deterministic hash of (employee, project): about a fifth of each
-- department, plus a few people borrowed from other departments.
INSERT INTO assignments
SELECT e.employee_id, p.project_id,
       CASE WHEN e.employee_id BETWEEN 10 AND 33 THEN 'lead'
            WHEN (e.employee_id + p.project_id) % 5 = 0 THEN 'reviewer' ELSE 'contributor' END,
       20 + (e.employee_id * 31 + p.project_id * 17) % 220
FROM employees e
JOIN projects p ON (e.department_id = p.department_id AND (e.employee_id * 7 + p.project_id * 13) % 10 < 2)
               OR (e.department_id <> p.department_id AND e.employee_id > 33 AND (e.employee_id + p.project_id * 3) % 41 = 0)
WHERE e.hire_date < coalesce(p.end_date, date '2025-12-31')
  AND (e.termination_date IS NULL OR e.termination_date > p.start_date);

DROP TABLE _names, _titles;
