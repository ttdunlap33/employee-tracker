const inquirer = require("inquirer");
const table = require("console.table");
const connection = require("./config/connection");
const prompt = require("./config/prompts");
require("console.table");
console.log(`-----Employee Tracker-----`);

var toTitleCase = function (str) {
	str = str.toLowerCase().split(' ');
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
};

promptOne();
function promptOne() {
    inquirer.prompt(prompt.promptOne).then(function ({ task }) {
        switch (task) {
            case 'View Employees':
                viewEmployee();
                break;
            case "View Employees by Department":
                viewEmployeeByDepartment();
                break;
            case 'View Employees by Manager':
                viewEmployeeByManager();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Budget":
                viewBudget();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                insertEmployee();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Remove Department":
                deleteDepartment();
                break;
            case "Remove Role":
                deleteRole();
                break;
            case "Remove Employee":
                deleteEmployee();
                break;
            case "End Program":
                console.log(
                    "Goodbye!"
                );
                connection.end();
                break;
            default:
                console.log("DEFAULT");
                break;
        }
    });
};

function viewEmployee() {
    console.log("View Employees");

    var query =
        `SELECT e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
	ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
	ON m.id = e.manager_id`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);

        promptOne();
    });
};

function viewEmployeeByDepartment() {
    console.log("View employees by department");

    var query =
        `SELECT d.id, d.name
	FROM employee e
	LEFT JOIN role r
	ON e.role_id = r.id
	LEFT JOIN department d
	ON d.id = r.department_id
	GROUP BY d.id, d.name`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        // Select department
        const deptChoices = res.map((data) => ({
            value: data.id,
            name: data.name,
        }));

        inquirer
            .prompt(prompt.promptDept(deptChoices))
            .then(function (answer) {
                var query =
                    `SELECT e.first_name, e.last_name, r.title, d.name AS department 
			    FROM employee e
			    JOIN role r
				ON e.role_id = r.id
			    JOIN department d
			    ON d.id = r.department_id
			    WHERE d.id = ?`;

                connection.query(query, answer.deptName, function (err, res) {
                    if (err) throw err;

                    console.table("Department", res);
                    promptOne();
                });
            });
    });
}

function viewEmployeeByManager() {
    var query =
        `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r
	ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
	ON m.id = e.manager_id GROUP BY e.manager_id`;


    connection.query(query, function (err, res) {
        if (err) throw err;
        const managerChoices = res
            // Filter NULL
            .filter((mgr) => mgr.manager_id)
            .map(({ manager_id, manager }) => ({
                value: manager_id,
                name: manager,
            }));

        inquirer
            .prompt(prompt.promptManager(managerChoices))
            .then(function (answer) {
                var query =
                    `SELECT e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager
			FROM employee e
			JOIN role r
			ON e.role_id = r.id
			JOIN department d
			ON d.id = r.department_id
			LEFT JOIN employee m
			ON m.id = e.manager_id
			WHERE m.id = ?`;

                connection.query(query, answer.managerName, function (err, res) {
                    if (err) throw err;

                    console.table("\nManager's subordinates:", res);

                    promptOne();
                });
            });
    });
};

function viewDepartments() {
    var query = "SELECT name FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        promptOne();
    });
};

function viewBudget() {
    var query =
        `SELECT d.name, 
		r.salary, sum(r.salary) AS budget
		FROM employee e 
		JOIN role r ON e.role_id = r.id
		JOIN department d ON r.department_id = d.id
		group by d.name`;

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        promptOne();
    });
};

function viewRoles() {
    var query = "SELECT r.title, r.salary, d.name FROM role r JOIN department d ON d.id = r.department_id;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        promptOne();
    });
};

function addDepartment() {
    inquirer.prompt(prompt.addDepartment).then(function (answer) {
        var query = "INSERT INTO department (name) values ( ? )";
        var titleDepartment = toTitleCase(answer.department);
        connection.query(query, titleDepartment, function (err, res) {
            if (err) throw err;
            console.log(
                `\nYou added this department: ${titleDepartment}.\n`,
            );
        });
        viewDepartments();
    });
};

function addRole() {
    var query = `SELECT id, name FROM department`;

    connection.query(query, function (err, res) {
        if (err) throw err;
        // Select department for role
        const deptChoices = res.map(({ id, name }) => ({
            value: id,
            name: `${id}) ${name}`,
        }));

        inquirer
            .prompt(prompt.addRole(deptChoices))
            .then(function (answer) {
                var query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                titleRoleName = toTitleCase(answer.roleName);
                // Insert Title, Salary and Department into Role Array
                connection.query(
                    query,
                    [titleRoleName, answer.roleSalary, answer.departmentId],
                    function (err, res) {
                        if (err) throw err;

                        console.log(
                            `\nYou added this role: ${titleRoleName}.\n`,
                        );

                        viewRoles();
                    },
                );
            });
    });
}

const insertEmployee = () => {
    connection.query(`SELECT id, title FROM role`, (err, res) => {
        if (err) throw err;

        const roleChoices = res.map(({ id, title }) => ({
            value: id,
            name: `${id}) ${title}`,
        }));
        connection.query(
            `SELECT id, first_name, last_name FROM employee`,
            (err, res) => {
                if (err) throw err;

                const managerChoices = res.map(({ id, first_name, last_name }) => ({
                    value: id,
                    name: `${id}) ${first_name} ${last_name}`,
                }));

                managerChoices.unshift({value: null, name: '0) No Manager'});

                // Create New Employee
                inquirer
                    .prompt(
                        prompt.addEmployee(roleChoices, managerChoices),
                    )
                    .then((response) => {
                        // Insert chosen elements into employee array
                        let roleCode = parseInt(response.role);
                        let managerCode = parseInt(response.manager);
                        titleFirstName = toTitleCase(response.firstName);
                        titleLastName = toTitleCase(response.lastName);
                        const values = {
                            first_name: titleFirstName,
                            last_name: titleLastName,
                            role_id: roleCode,
                        }
                        if (managerCode) {
                            values['manager_id'] = managerCode;
                        }
                        connection.query(
                            "INSERT INTO employee SET ?",
                            values,
                            (err, res) => {
                                if (err) throw err;
                                console.log(
                                    `\nYou added this employee: ${titleFirstName} ${titleLastName}.\n`,
                                );
                                viewEmployee();
                            },
                        );
                    });
            },
        );
    });
};

const updateEmployeeManager = () => {
    // Select Employee to update
    connection.query(
        `SELECT id, first_name, last_name
        FROM employee`,
        (err, res) => {
            const employeeChoices = res.map(({ id, first_name, last_name }) => ({
                value: id,
                name: `${id}) ${first_name} ${last_name}`,
            }));

            // Select employee's manager
            inquirer.prompt(prompt.updateManager(employeeChoices)).then((answer) => {
                // parseInt prompt answers
                let idCode = parseInt(answer.update);
                let managerCode = parseInt(answer.manager);
                connection.query(
                    // replace employee's mgr_ID with emp_ID of manager
                    `UPDATE employee SET manager_id = ${managerCode} WHERE id = ${idCode}`,
                    (err, res) => {
                        if (err) throw err;

                        console.log(
                            "\n" + "\n" + res.affectedRows + " Updated successfully!",
                        );
                        promptOne();
                    },
                );
            });
        },
    );
};

const updateEmployeeRole = () => {
	// Select Employee to update
	connection.query(
		`SELECT id, first_name, last_name
        FROM employee`,
		(err, res) => {
			if (err) throw err;

			const employeeChoices = res.map(({ id, first_name, last_name }) => ({
                value: id,
                name: `${id}) ${first_name} ${last_name}`,
            }));

			// Select employee's role
			let job = [];
			connection.query(`SELECT id, title FROM role`, (err, res) => {
				if (err) throw err;

				const roleChoices = res.map(({ id, title }) => ({
                    value: id,
                    name: `${id}) ${title}`,
                }));

				inquirer.prompt(prompt.updateRole(employeeChoices, roleChoices)).then((response) => {
					// Update Employee with Role
					let idCode = parseInt(response.update);
					let roleCode = parseInt(response.role);
					connection.query(
						`UPDATE employee SET role_id = ${roleCode} WHERE id = ${idCode}`,
						(err, res) => {
							if (err) throw err;

							console.log(
								"\n" + "\n" + res.affectedRows + " Updated successfully!",
							);
							promptOne();
						},
					);
				});
			});
		},
	);
};

function deleteDepartment() {
	console.log("\nRemove a Department:\n");

	var query = 
    `SELECT d.id, d.name FROM department d`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		// Select Department to delete
		const deleteDepartmentChoices = res.map(({ id, name }) => ({
			value: id,
			name: `${id}) ${name}`,
		}));

		inquirer
			.prompt(prompt.deleteDepartmentPrompt(deleteDepartmentChoices))
			.then(function (answer) {
				var query = `DELETE FROM department WHERE ?`;
				// after prompting, delete item from the db
				connection.query(query, { id: answer.departmentId }, function (
					err,
					res,
				) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + " department deleted\n");

					viewDepartments();
				});
			});
	});
};

function deleteRole() {
	console.log("Delete a role");

	var query = 
    `SELECT e.id, e.title, e.salary, e.department_id FROM role e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		// Select Role to delete
		const deleteRoleChoices = res.map(({ id, title }) => ({
			value: id,
			name: `${id}) ${title}`,
		}));

		inquirer
			.prompt(prompt.deleteRolePrompt(deleteRoleChoices))
			.then(function (answer) {
				var query = `DELETE FROM role WHERE ?`;
				// after prompting, delete item from the db
				connection.query(query, { id: answer.roleId }, function (err, res) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + " role deleted\n");

					viewRoles();
				});
			});
	});
};

function deleteEmployee() {
	console.log("Delete an employee");

	var query = 
        `SELECT e.id, e.first_name, e.last_name
        FROM employee e`;

	connection.query(query, function (err, res) {
		if (err) throw err;
		// Select Employee to remove
		const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
			value: id,
			name: `${id}) ${first_name} ${last_name}`,
		}));

		inquirer
			.prompt(prompt.deleteEmployeePrompt(deleteEmployeeChoices))
			.then(function (answer) {
				var query = `DELETE FROM employee WHERE ?`;
				// remove item from the db
				connection.query(query, { id: answer.employeeId }, function (err, res) {
					if (err) throw err;

					console.log("\n" + res.affectedRows + "  employee deleted\n");

					promptOne();
				});
			});
	});
};