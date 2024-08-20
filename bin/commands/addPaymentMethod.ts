import fs from "fs";
import path from "path";
import { exec } from "child_process";

export const addPaymentMethod = (paymentMethod: string) => {
  const scriptDir = __dirname;
  const targetDir = process.cwd();
  const templateDir = path.join(
    scriptDir,
    `../templates/${paymentMethod.toLocaleLowerCase()}`
  );

  const destDir = path.join(targetDir);

  const filesToCopy = [
    {
      src: path.join(templateDir, "index.ts"),
      dest: path.join(destDir, "index.ts"),
    },
    {
      src: path.join(templateDir, ".env"),
      dest: path.join(destDir, ".env"),
    },
    {
      src: path.join(templateDir, "config/connectMongoDB.ts"),
      dest: path.join(destDir, "config/connectMongoDB.ts"),
    },
    {
      src: path.join(templateDir, `controller/${paymentMethod}Controller.ts`),
      dest: path.join(destDir, `controller/${paymentMethod}Controller.ts`),
    },
    {
      src: path.join(templateDir, `controller/AuthController.ts`),
      dest: path.join(destDir, `controller/AuthController.ts`),
    },
    {
      src: path.join(templateDir, `middlewares/protectRoute.ts`),
      dest: path.join(destDir, `middlewares/protectRoute.ts`),
    },
    {
      src: path.join(templateDir, `models/${paymentMethod}.ts`),
      dest: path.join(destDir, `models/${paymentMethod}.ts`),
    },
    {
      src: path.join(templateDir, `models/User.ts`),
      dest: path.join(destDir, `models/User.ts`),
    },

    {
      src: path.join(templateDir, `routes/${paymentMethod}Route.ts`),
      dest: path.join(destDir, `routes/${paymentMethod}Route.ts`),
    },
    {
      src: path.join(templateDir, "routes/AuthRoute.ts"),
      dest: path.join(destDir, "routes/AuthRoute.ts"),
    },
    {
      src: path.join(templateDir, "utils/generateToken.ts"),
      dest: path.join(destDir, "utils/generateToken.ts"),
    },
  ];

  if (paymentMethod === "RazorPay") {
    filesToCopy.push({
      src: path.join(templateDir, "utils/RazorPayInstance.ts"),
      dest: path.join(destDir, "utils/RazorPayInstance.ts"),
    });
  }

  // Ensure the target directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    filesToCopy.forEach(({ src, dest }) => {
      // Ensure the destination directory exists
      fs.mkdirSync(path.dirname(dest), { recursive: true });

      // Copy the file
      fs.copyFileSync(src, dest);
    });

    console.log(
      `${paymentMethod} payment method files created successfully in the folder.`
    );
  } catch (err) {
    console.error(`Error copying files for ${paymentMethod}:`, err);
  }

  // Install necessary dependencies

  console.log(`Installing packages for ${paymentMethod} payment method...`);
  exec(
    `npm install mongoose dotenv express bcryptjs jsonwebtoken cookie-parser ${paymentMethod.toLowerCase()} --save`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing packages for ${paymentMethod}:`, error);
        return;
      }

      // Install dev dependencies
      console.log("Installing dev dependencies...");
      exec(
        `npm install --save-dev nodemon @types/express @types/mongoose @types/jsonwebtoken @types/bcryptjs @types/cookie-parser`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(
              `Error installing dev packages for ${paymentMethod}:`,
              error
            );
            return;
          }
        }
      );
    }
  );
};
