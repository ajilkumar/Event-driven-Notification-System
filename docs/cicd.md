# CI/CD Pipeline Guide (GitHub Actions)

This document provides a detailed guide on how to implement a CI/CD pipeline for the Event-Driven Notification System using GitHub Actions.

## Why CI/CD?
In a microservices architecture, manual testing and deployment are error-prone. CI/CD ensures:
- **Consistency**: Every change is tested in the same environment.
- **Safety**: Broken code is blocked from merging.
- **Speed**: Automates the build and deployment lifecycle.

## Pipeline Workflow Strategy

### 1. Continuous Integration (CI)
The "CI" job should run on every **Pull Request** and **Push** to the `main` branch.

#### Stages:
1.  **Checkout**: Pulls the repository code.
2.  **Linting**: Runs `npm run lint` to ensure code style stays consistent.
3.  **Testing**: Runs `npm test` to execute Jest unit tests.
4.  **Security Audit**: Run `npm audit` to check for vulnerable dependencies.
5.  **Build Check**: Executes `docker-compose build` to ensure the production images can still be created correctly.

### 2. Continuous Deployment (CD)
The "CD" job should only run on **Push to `main`** after the CI job passes.

#### Stages:
1.  **Docker Build & Push**:
    - Build images for `event-api` and `worker`.
    - Tag with `:latest` and the `:git-sha`.
    - Push to Docker Hub or GitHub Container Registry (GHCR).
2.  **Deployment**:
    - Trigger a rolling update on the production server (e.g., via `docker-compose pull && docker-compose up -d`).

---

## How to Set It Up (Step-by-Step)

### Step 1: Create the workflow file
Create a file at `.github/workflows/ci.yml`. (GitHub will automatically detect this).

### Step 2: Define the Jobs
- Use `jobs: build:` as the primary container.
- Specify `runs-on: ubuntu-latest`.

### Step 3: Configure caching
Use `actions/setup-node` with the `cache: 'npm'` option. This makes your builds 2x faster by reusing `node_modules`.

### Step 4: Handle Monorepo specifics
Use conditional execution (e.g., `dorny/paths-filter`) if you only want to test the `worker` when its files change, saving compute time.

### Step 5: Secure Secrets
Add sensitive data (like `DOCKER_PASSWORD` or `DATABASE_URL`) to **GitHub Settings > Secrets and Variables > Actions**. Never hardcode them in your YAML!

---

## Conclusion
A working CI/CD pipeline is the hallmark of a Senior Developer. It transitions the project from a "coding exercise" to a "reliable product".
