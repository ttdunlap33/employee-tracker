USE employees_db;

-- Department Array --
INSERT INTO department (name)
VALUES ("Finance"); 
INSERT INTO department (name)
VALUES ("Marketing");
INSERT INTO department (name)
VALUES ("Operations");
INSERT INTO department (name)
VALUES ("Purchase");

-- Role Array --
INSERT INTO role (title, salary, department_id)
VALUES ("CFO", 100000, 1);
-- Finance Department
INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 80000, 1);
-- Finance Department
INSERT INTO role (title, salary, department_id)
VALUES ("Partner", 150000, 2);
-- Marketing Department
INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Director", 120000, 2);
-- Marketing Department
INSERT INTO role (title, salary, department_id)
VALUES ("COO", 150000, 3);
-- Operations Department
INSERT INTO role (title, salary, department_id)
VALUES ("Operations Manager", 125000, 3);
-- Operations Department
INSERT INTO role (title, salary, department_id)
VALUES ("Buyer", 250000, 4);
-- Purchase Department


-- Employee Array --
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
-- Jaco Pastorius - CFO - Finance Department
VALUES (1, "Jaco", "Pastorius", 1, null); 
INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- Trey Anastasio - Account Manager - Finance Department
VALUES ("Trey", "Anastasio", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)

-- Victor Wooten - Partner - Marketing Department
VALUES ("Victor", "Wooten", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- Eddie Vedder - Marketing Director - Marketing Department
VALUES ("Eddie", "Vedder", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)

-- Kurt Cobain - COO-Operations Department
VALUES ("Kurt", "Cobain", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- Courtney Love - Operations Manager -Operations Department
VALUES ("Courtney", "Love", 6, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)

-- Dave Matthews - Legal Team Lead - Purchase Department
VALUES ("Dave", "Matthews", 7, 1);