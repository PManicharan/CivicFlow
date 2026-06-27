# Contributing to CivicFlow

First off, thank you for considering contributing to CivicFlow! It's people like you that make CivicFlow such a great tool for community safety.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [issue list](https://github.com/yourusername/civicflow/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**How To Submit A (Good) Bug Report:**

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details** (OS, browser, Python version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/yourusername/civicflow/issues). When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the Python and TypeScript styleguides
- Include appropriate test cases
- End all files with a newline
- Avoid platform-dependent code

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- Python 3.9+
- Git
- Firebase account
- Google Gemini API key

### Frontend Development Setup

```bash
cd frontend
npm install

# Create .env from .env.example
cp .env.example .env

# Update .env with your Firebase config

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Backend Development Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env from .env.example
cp .env.example .env

# Update .env with your credentials

# Start dev server
uvicorn app.main:create_app --reload --port 8000

# Run tests
python -m pytest
```

## Styleguides

### Python (Backend)

We follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) with these specific guidelines:

- Use 4 spaces for indentation
- Use type hints for all function parameters and returns
- Maximum line length: 100 characters
- Use docstrings for all public functions and classes
- Use meaningful variable names

```python
def validate_signal(signal: Signal) -> bool:
    """
    Validate a community signal for completeness and safety.
    
    Args:
        signal: The signal to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not signal.description or len(signal.description) < 10:
        return False
    return True
```

### TypeScript/React (Frontend)

We follow [Airbnb's JavaScript style guide](https://github.com/airbnb/javascript) with these specifics:

- Use 2 spaces for indentation
- Use meaningful component names (PascalCase for components)
- Use meaningful variable names (camelCase)
- Maximum line length: 100 characters
- Use prop types or TypeScript interfaces

```typescript
interface SignalProps {
  title: string;
  description: string;
  onSubmit: (signal: Signal) => void;
}

export function SignalForm({ title, description, onSubmit }: SignalProps) {
  // Component implementation
  return <div>{title}</div>;
}
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing or correcting existing tests
- `chore`: Changes to build process, dependencies, etc.

**Examples:**
```
feat(api): add signal assessment endpoint
fix(frontend): resolve navigation bug on mobile
docs: update installation instructions
```

## Testing

### Backend Testing

```bash
cd backend

# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app

# Run specific test
python -m pytest tests/test_signals.py -v
```

### Frontend Testing

```bash
cd frontend

# Run tests (when test framework is added)
npm test

# Run with coverage
npm test -- --coverage
```

### Test Guidelines

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage
- Tests should be independent and repeatable

## Documentation

### README Updates

When adding features, update the relevant sections of README.md:
- Add feature to "Key Features" section
- Add API endpoint to documentation
- Add environment variables if applicable
- Include usage examples

### Code Comments

- Comments should explain the "why", not the "what"
- Keep comments concise and clear
- Update comments when code changes
- Remove obsolete comments

### Docstrings

All public functions, classes, and modules should have docstrings:

```python
"""Module for handling community signals."""

def assess_signal(signal_id: str) -> Assessment:
    """
    Assess a community signal using AI analysis.
    
    This function performs multimodal analysis on the signal,
    including text processing and image analysis.
    
    Args:
        signal_id: The unique identifier of the signal
        
    Returns:
        Assessment: The AI assessment with severity and reasoning
        
    Raises:
        SignalNotFoundError: If the signal doesn't exist
        AnalysisError: If AI analysis fails
    """
```

## Project Structure Guidelines

### Frontend

```
src/
├── components/          # Reusable components
│   ├── ui/             # Atomic UI components
│   ├── layout/         # Layout components
│   ├── landing/        # Landing page components
│   └── forms/          # Form components (future)
├── pages/              # Page-level components
├── lib/                # Utilities
├── assets/             # Static assets
└── types/              # TypeScript types
```

### Backend

```
app/
├── api/                # API routes
├── services/           # Business logic
├── models/             # Data models and schemas
├── core/               # Configuration and initialization
└── utils/              # Helper functions
```

## Review Process

1. **Automated Checks**: GitHub Actions runs linting and tests
2. **Code Review**: At least one maintainer reviews your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR is merged

## Release Process

Releases follow [Semantic Versioning](https://semver.org/):
- MAJOR.MINOR.PATCH (e.g., 1.2.3)
- MAJOR: Incompatible API changes
- MINOR: New backwards-compatible features
- PATCH: Bug fixes

## Getting Help

- **Questions**: Ask on [GitHub Discussions](https://github.com/yourusername/civicflow/discussions)
- **Issues**: Check [existing issues](https://github.com/yourusername/civicflow/issues)
- **Security**: Email security@civicflow.io for security concerns
- **Direct**: Reach out to maintainers directly

## Recognition

Contributors will be recognized in:
- Release notes
- CONTRIBUTORS.md file
- GitHub contributors page
- CivicFlow website (if applicable)

---

Thank you for contributing to CivicFlow! 🙏

For any questions, please feel free to reach out to the maintainers.

[⬆ back to top](#contributing-to-civicflow)
