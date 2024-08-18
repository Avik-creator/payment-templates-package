#!/usr/bin/env node
import { program } from "commander";
import { addPaymentMethod } from "./commands/addPaymentMethod";

program
  .command("add <method>")
  .description("Add a payment method template")
  .action((method) => {
    addPaymentMethod(method);
  });

program.parse(process.argv);
