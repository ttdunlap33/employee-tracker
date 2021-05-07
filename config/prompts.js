module.exports = {
    promptOne: {
        type: 'list',
        name: 'task',
        message: 'Please make a selection.',
        choices: [
            // View //
            'View Employees',
            'View Employees by Department',
            'View Employees by Manager',
            'View Departments',
            'View Budget',
            'View Roles',
            // Add //
            'Add Department',
            'Add Role',
            'Add Employee',
            // Update //
            'Update Employee Manager',
            'Update Employee Role',
            // Remove //
            'Remove Department',
            'Remove Role',
            'Remove Employee',
            // end
            'End Program'
        ]
    },

    promptManager: (managerChoices) => [
        {
            type: 'list',
            name: 'managerName',
            message: 'Please select a manager.',
            choices: managerChoices
        }
    ],

    promptDept: (deptChoices) => [
        {
            type: 'list',
            name: 'deptName',
            message: 'Please select a department.',
            choices: deptChoices
        }
    ],

	addDepartment: {
		name: "department",
		type: "input",
		message: "Please tell me the name of the department",
	},    

	addRole: (deptChoices) => [
		// Create Role's Name
		{
			type: "input",
			name: "roleName",
			message: "What is the name of the role?",
		},
		// Create Role's Salary Budget
		{
			type: "input",
			name: "roleSalary",
			message: "What is the role's salary?",
		},
		// Select Role's Department
		{
			type: "list",
			name: "departmentId",
			message: " Which department?",
			choices: deptChoices,
		}
	],
	
    addEmployee: (departmentArray, roleArray, managerArray) => [
		// Employee's First Name
		{
			name: "firstName",
			type: "input",
			message: "Please enter employee's first name:",
		},
		// Employee's Last Name
		{
			name: "lastName",
			type: "input",
			message: "Please enter employee's last name:",
		},
		// Select Employee's Department
		{
			name: "department",
			type: "list",
			message: "Please select employee's department",
			choices: departmentArray,
		},
		// Employee's Role
		{
			name: "role",
			type: "list",
			message: "Please select employee's role",
			choices: roleArray,
		},
		// Employee's Manager
		{
			name: "manager",
			type: "list",
			message: "Please select the manager of this employee:",
			choices: managerArray
		}
	],

    updateRole: (employees, job) => [
        {
            name: 'Update',
            type: 'list',
            message: "Which employee's role is to be updated?",
            choices: employees, 
        },
        {
            name: 'role',
            type: 'list',
            message: "Please pick employee's new role",
            choices: job,
        }
    ],

    updateManager: (employees) => [
        {
			name: "update",
			type: "list",
			message: "Please select the employee whose manager is to be updated:",
			choices: employees            
        },
        {
            name: 'manager',
            type: 'list',
            message: "Please select employee's new manager",
            choices: employes
        }
    ],

    deleteEmployeePrompt: (deleteEmployeeChoices) => [
		{
			type: "list",
			name: "employeeId",
			message: "Which employee do you want to remove?",
			choices: deleteEmployeeChoices,
		},
	],

	deleteDepartmentPrompt: (deleteDeptChoices) => [
		{
			type: "list",
			name: "departmentId",
			message: "Which department do you want to remove?",
			choices: deleteDeptChoices,
		},
	],
	
    deleteRolePrompt: (deleteRoleChoices) => [
		{
			type: "list",
			name: "roleId",
			message: "Which role do you want to remove?",
			choices: deleteRoleChoices,
		},
	],
};

