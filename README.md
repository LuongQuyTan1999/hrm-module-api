# HRM Module - NestJS with MikroORM & AI Integration

A comprehensive Human Resource Management module built with NestJS, MikroORM, PostgreSQL, and integrated with LangChain for AI-powered features.

## 🛠 Technology Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: PostgreSQL with MikroORM
- **Authentication**: JWT with Passport
- **AI Integration**: LangChain with OpenAI
- **Validation**: Class-validator
- **Security**: Helmet, bcrypt for password hashing

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

## ⚙️ Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hrm-module
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   POSTGRES_URL=postgresql://username:password@localhost:5432/hrm_database
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   
   # OpenAI Configuration (for AI features)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Application Configuration
   NODE_ENV=development
   PORT=3000
   ```

## 🗄️ Database Setup & Schema Management

### 1. Database Schema Overview

The HRM system uses two main entities with a **1:1 relationship**:

- **Employees**: Core employee information (personal details, employment info)
- **Users**: Authentication and system access (linked to employees)

**Relationship**: `users.employee_id` → `employees.id` (One-to-One)

### 2. Migration Management

#### Creating New Migrations
```bash
# Create a new blank migration
npm run migration:create YourMigrationName

# Example: Create a migration for adding departments
npm run migration:create AddDepartmentsTable
```

#### Running Migrations
```bash
# Run all pending migrations
npm run migration:up

# Rollback the last migration
npm run migration:down
```

#### Schema Operations
```bash
# Update schema (development only - be careful!)
npm run schema:update

# Fresh schema (drops all tables and recreates - development only!)
npm run schema:fresh
```

### 3. Initial Database Setup

For a fresh installation, run the existing migration to create the base schema:

```bash
# 1. Ensure your PostgreSQL database exists
createdb hrm_database

# 2. Run migrations to create tables
npm run migration:up
```

This will create:
- `employees` table with all employee information
- `users` table with authentication data
- Proper indexes and foreign key constraints
- UUID extension for PostgreSQL

## 🚀 Running the Application

### Development Mode
```bash
# Start in development mode with hot reload
npm run start:dev

# Start with debug mode
npm run start:debug
```

### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Other Useful Commands
```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 📊 Working with Entities

### Employee Entity
```typescript
// Location: src/common/db/entities/employee.entity.ts
@Entity({ tableName: 'employees' })
export class Employee {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ nullable: true })
  employeeCode?: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Property({ type: 'date' })
  dateOfBirth: Date;

  @Property({ unique: true })
  email: string;

  // ... other properties
}
```

### User Entity
```typescript
// Location: src/common/db/entities/user.entity.ts
@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @OneToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Property()
  password: string;

  @Property()
  username: string;

  @Enum(() => Role)
  role: Role;

  // ... other properties
}
```

### Generating Entities from Database
```bash
# Generate entities from existing database schema
npm run generate:entities

# Generate with verbose output for debugging
npm run generate:entities:verbose
```

## 🔍 Database Queries & Best Practices

### 1. Querying Users with Employee Information
```typescript
// Always populate employee when you need email or employee details
const user = await this.userRepository.findOne(
  { id: userId },
  { populate: ['employee'] }
);

// Access employee email
const email = user.employee.email;
```

### 2. Finding User by Employee Email
```typescript
// Method 1: Query through employee relationship
const user = await this.userRepository.findOne(
  { employee: { email: 'user@example.com' } },
  { populate: ['employee'] }
);

// Method 2: Two-step query (more explicit)
const employee = await this.employeeRepository.findOne({ email: 'user@example.com' });
if (employee) {
  const user = await this.userRepository.findOne(
    { employee: employee.id },
    { populate: ['employee'] }
  );
}
```

### 3. Creating Users with Employee Reference
```typescript
// Always use employee ID, not entity object
const user = this.userRepository.create({
  employee: employeeId, // Use ID, not entity
  username: 'john.doe',
  password: hashedPassword,
  role: Role.EMPLOYEE
});

await this.userRepository.persistAndFlush(user);
```

## 🔐 Authentication Flow

### 1. User Registration (Sign Up)
```typescript
// Create employee first
const employee = await this.employeeService.create(employeeData);

// Then create user with employee reference
const user = await this.authService.signUp({
  employeeId: employee.id,
  username: employee.email,
  password: 'userPassword',
  role: Role.EMPLOYEE
});
```

### 2. User Login (Sign In)
```typescript
// Login with email (from employee) and password
const result = await this.authService.signIn({
  email: 'user@example.com',
  password: 'userPassword'
});

// Returns JWT token and user info
const { accessToken, user } = result;
```

## 🛡️ API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - User login

### Employees
- `GET /employees` - List employees with filtering and pagination
- `POST /employees` - Create new employee
- `GET /employees/:id` - Get employee by ID
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### Query Parameters for Employee List
```bash
# Filter by department
GET /employees?departmentId=uuid

# Search by name or email
GET /employees?search=john

# Pagination
GET /employees?page=1&limit=10

# Sorting
GET /employees?sortBy=firstName&sortOrder=asc
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Database Testing
For testing, you may want to use a separate test database:
```env
# .env.test
POSTGRES_URL=postgresql://username:password@localhost:5432/hrm_test_database
```

## 🚨 Common Issues & Troubleshooting

### 1. Migration Issues
```bash
# If migration fails, check the current state
npm run mikro-orm migration:list

# Force migration state (careful!)
npm run mikro-orm migration:up --force

# Check database connection
npm run mikro-orm debug
```

### 2. Entity Generation Issues
```bash
# Clear dist folder and rebuild
rm -rf dist/
npm run build

# Ensure database is up to date
npm run migration:up
```

### 3. CORS Issues
If you encounter CORS errors in development, the app is configured to allow all origins in development mode. For production, configure proper CORS settings in `main.ts`.

### 4. Authentication Issues
- Ensure JWT_SECRET is set in environment variables
- Check that user passwords are properly hashed with bcrypt
- Verify that employee relationship is populated when accessing user data

## 📝 Development Guidelines

### 1. Adding New Fields to Entities
1. Update the entity file
2. Create a new migration:
   ```bash
   npm run migration:create AddNewFieldToEmployee
   ```
3. Run the migration:
   ```bash
   npm run migration:up
   ```

### 2. Database Indexing Best Practices
- Always index foreign keys (already done for `users.employee_id`)
- Index frequently queried fields (email, employee_code)
- Use unique indexes for unique constraints
- Consider composite indexes for complex queries

### 3. Query Optimization
- Always use `populate` when accessing relationships
- Use specific field selection for large datasets
- Implement proper pagination for list endpoints
- Cache frequently accessed data when appropriate

## 🤖 AI Integration

This module includes LangChain integration for AI-powered features:

- **SQL Query Tool**: Natural language to SQL conversion
- **Database Schema Analysis**: AI-powered schema understanding
- **Query Optimization**: AI suggestions for query improvements

The AI tools are configured to work with the current database schema and can help with complex queries and data analysis.

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [MikroORM Documentation](https://mikro-orm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [LangChain Documentation](https://js.langchain.com/)

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update this README when adding new functionality
4. Use proper TypeScript types throughout
5. Follow database best practices for migrations and queries

## 📄 License

This project is licensed under the UNLICENSED license.
