# Contributing to Chrononomic Finance

Thank you for considering contributing to Chrononomic Finance! This document outlines the process for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Development Process

### Branching Strategy

We use a simplified Git flow:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release preparation branches
- `hotfix/*`: Urgent fixes for production

### Pull Request Process

1. Fork the repository and create your branch from `develop`.
2. Ensure your code follows the project's coding standards.
3. Add tests for new functionality.
4. Update documentation as necessary.
5. Submit a pull request to the `develop` branch.

### Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat(bond): add new bond class for ritual bonds`

## Development Setup

See the [README.md](./README.md) for setup instructions.

## Testing

All new code should include appropriate tests. Run the test suite with:

\`\`\`bash
npm test
\`\`\`

## Code Style

We use ESLint and Prettier to enforce code style. Run the linter with:

\`\`\`bash
npm run lint
\`\`\`

Format your code with:

\`\`\`bash
npm run format
\`\`\`

## Documentation

Update documentation for any changes to the API, functionality, or processes.

## Questions

If you have questions, please open an issue or reach out to the maintainers.
\`\`\`

Let's create a GitHub Actions workflow for CI/CD:
