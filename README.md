# Payment Templates CLI

`payment-templates` is a CLI tool for adding payment method templates to your project. It supports various payment methods and allows you to quickly integrate them into your project.

## Installation

To install the `payment-templates` CLI tool globally, use the following command:

1. Install ts-node globally:

```bash
npm install -g ts-node
```

```bash
npm install -g payment-templates
```

## Usage

After installation, you can use the `payment-templates` command to add payment method templates to your Backend project. The basic syntax is:

```bash
npx payment-templates add <method>
```

### Commands

- `add <method>`: Adds a payment method template for the specified project.

### Available Methods

- `Stripe`: Adds a Stripe payment method template.
- `RazorPay`: Adds a Razorpay payment method template.

## Examples

### Adding Stripe Template

To add a Stripe payment method template for a project, run:

```bash
npx payment-templates add Stripe
```

### Adding Razorpay Template

To add a Razorpay payment method template for a project, run:

```bash
npx payment-templates add RazorPay
```

### After Running the Command:

```bash
npx payment-templates add RazorPay
```

<img width="181" alt="Screenshot 2024-08-18 at 4 11 02 PM" src="https://github.com/user-attachments/assets/9a279205-0a7d-43bf-a435-cefa022eda97">

- The CLI tool includes authentication setup files to help you configure secure payment processing. For more details on how to use these files, refer to the [auth-typescript-template-package](https://github.com/Avik-creator/auth-typescript-template-package) repository.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

## Contributions

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Contact

For questions or feedback, reach out to us at avikm744@gmail.com.
