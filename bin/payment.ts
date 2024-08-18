#!/usr/bin/env ts-node
const program = require("commander");
const { addPaymentMethod } = require("../bin/commands/addPaymentMethod");

program
  .command("add <method>")
  .description("Add a payment method template")
  .action((method: string) => {
    addPaymentMethod(method);
  });

program.parse(process.argv);
