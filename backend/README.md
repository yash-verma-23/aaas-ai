## Development

### Setup

1. Copy `.env.example` to `.env` and update the values.
2. Create a database in your local postgres instance. The name will be the value of `DB_DATABASE` in the `.env` file
3. Install packages by running

```bash
npm ci
```

4. Open docker desktop and start the docker daemon
5. Start the database by running

```bash
docker compose -f docker-compose-dev.yml up -d
```

### Commands

#### Installation

```bash
npm ci
```

#### Start db

```bash
docker compose -f docker-compose-dev.yml up -d
```

#### Setup backend

Runs migrations and seeds

```bash
npm run migration:run
```

#### Start node server

```bash
npm run start:dev
```

#### Run migrations

```bash
npm run migration:run
```

#### Seed db

```bash
npm run seed:run
```

#### Formatting

```bash
npm run format
```

#### Linting

```bash
npm run lint
```

#### Revert latest migration

```bash
npm run migration:revert
```

#### Revert latest migration and run migration

```bash
npm run migration:rerun
```

#### Show all migrations

```bash
npm run migration:show
```

#### Runs all unit tests

```bash
npm test
```

#### Run a specific unit test folder/ file

```bash
npm test -- {path-to-folder/file}
```

#### Runs tests in watch mode

```bash
npm run test:watch
```

#### Runs tests and generates a coverage report

```bash
npm run test:cov
```

#### Runs end-to-end tests

```bash
npm run test:e2e
```

### Swagger

After running the server swagger will be live at [http://localhost:3000/api](http://localhost:3000/api).

### Adminer

Adminer will be live at [http://localhost:8080/](http://localhost:8080/).

## Style guide

### Naming

- Directories should be kebab-case.
- Typescript variables should be camelCase.
- Typescript Classes should be TitleCase singular
- File names should be kabab-case.object.ts. For example entities it should named like access-control.entity.ts

### Environment variable

Use `configService.getValue('NAME')` to get environment variable. Using `process.env` or `configService.get('NAME')` returns empty string if the variable is not defined and can cause runtime errors.

### Comment to trigger actions - 28-3-2025 12:49 pm
