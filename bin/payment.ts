#!/usr/bin/env node
const program = require("commander");
const { addPaymentMethod } = require("../src/payment");

program
  .command("add <method>")
  .description("Add a payment method template")
  .action((method: string) => {
    addPaymentMethod(method);
  });

program.parse(process.argv);
