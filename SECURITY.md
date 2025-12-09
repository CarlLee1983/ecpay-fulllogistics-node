# Security Policy

## Supported Versions

The following versions of `ecpay-fulllogistics-node` are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please prioritize responsible disclosure.

1.  **Do NOT open a public GitHub issue.** This allows time for the vulnerability to be patched before it is widely known.
2.  Email the maintainer directly or use GitHub's private vulnerability reporting feature.
3.  Include as much detail as possible:
    - Type of vulnerability.
    - Full steps to reproduce.
    - Sample code or proof-of-concept.

## Security Features

This SDK includes built-in security features for ECPay Full Logistics integration:

- **CheckMacValue Generation**: Automatically calculates the required checksum for all requests.
- **CheckMacValue Verification**: Provides verification methods to validate callbacks from ECPay, preventing tampering.
- **Encapsulation**: Helper methods ensure correct parameter formatting, reducing the risk of malformed requests.

## Best Practices

- **Never commit your `HashKey` and `HashIV` to version control.** Use environment variables (e.g., `dotenv`).
- Always verify the checksum of incoming notifications.
- Regularly update this package to the latest version to receive security patches.
