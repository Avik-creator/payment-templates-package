# Payment Templates CLI

`payment-templates` is a CLI tool for adding payment method templates to your project. It supports various payment methods and allows you to quickly integrate them into your project.

## Installation

To install the `payment-templates` CLI tool globally, use the following command:

```bash
npm install -g payment-templates
```

## Usage

After installation, you can use the `payment-template` command to add payment method templates to your Backend project. The basic syntax is:

```bash
npx payment-template add <method> for <project>
```

### Commands

- `add <method> for <project>`: Adds a payment method template for the specified project.

### Available Methods

- `Stripe`: Adds a Stripe payment method template.
- `Razorpay`: Adds a Razorpay payment method template.

## Examples

### Adding Stripe Template

To add a Stripe payment method template for a project named `MyProject`, run:

```bash
npx payment-template add Stripe for MyProject
```

### Adding Razorpay Template

To add a Razorpay payment method template for a project named `YourProject`, run:

```bash
npx payment-template add Razorpay for YourProject
```

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
