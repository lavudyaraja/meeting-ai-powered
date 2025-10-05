# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to the project maintainers at security@meetingsai.com. All security vulnerabilities will be promptly addressed.

Please do not publicly disclose the vulnerability until it has been resolved.

## Security Best Practices

### Environment Variables

- Never commit actual API keys, passwords, or secrets to version control
- Use `.env.example` as a template for required environment variables
- Add `.env` to `.gitignore` to prevent accidental commits
- Use strong, randomly generated secrets for production environments

### Authentication

- Use strong passwords for all accounts
- Enable two-factor authentication where possible
- Regularly rotate API keys and secrets
- Use OAuth when available instead of username/password authentication

### Supabase Security

- Configure Row Level Security (RLS) policies for all tables
- Use Supabase Auth for user authentication
- Store sensitive configuration as Supabase secrets, not in client-side code
- Regularly review and audit access permissions

### AI Integration Security

- Store OpenAI API keys as Supabase secrets, not in environment variables with VITE_ prefix
- Never expose API keys in client-side code
- Implement rate limiting to prevent abuse
- Monitor API usage for unusual patterns

### Frontend Security

- Validate all user inputs
- Sanitize data before displaying in the UI
- Use Content Security Policy (CSP) headers
- Keep dependencies up to date
- Regularly audit dependencies for known vulnerabilities

## Dependency Management

- Regularly update dependencies to the latest secure versions
- Use `npm audit` or `yarn audit` to identify vulnerable dependencies
- Pin dependency versions in production
- Review and audit third-party packages before adding them

## Data Protection

- Encrypt sensitive data at rest and in transit
- Implement proper data retention and deletion policies
- Comply with relevant data protection regulations (GDPR, CCPA, etc.)
- Regularly backup important data

## Incident Response

In the event of a security incident:

1. Contain the incident and prevent further damage
2. Assess the impact and scope of the breach
3. Notify affected parties as required by law
4. Document the incident and lessons learned
5. Implement measures to prevent similar incidents in the future