import fs from "fs-extra";
import path from "path";

export const addPaymentMethod = (paymentMethod: string) => {
  const scriptDir = __dirname;
  const targetDir = process.cwd();
  const templateDir = path.join(scriptDir, `../templates/${paymentMethod}`);
  const destDir = path.join(targetDir, paymentMethod);

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
      src: path.join(templateDir, `controllers/${paymentMethod}Controller.ts`),
      dest: path.join(destDir, `controllers/${paymentMethod}Controller.ts`),
    },
    {
      src: path.join(templateDir, `controllers/AuthController.ts`),
      dest: path.join(destDir, `controllers/AuthController.ts`),
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
      src: path.join(templateDir, "routes/User.ts"),
      dest: path.join(destDir, "routes/User.ts"),
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

  // Ensure the target directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    filesToCopy.forEach(({ src, dest }) => {
      // Ensure the destination directory exists
      fs.ensureDirSync(path.dirname(dest));
      // Copy the file
      fs.copyFileSync(src, dest);
    });

    console.log(
      `${paymentMethod} payment method files created successfully in the ${paymentMethod} folder.`
    );
  } catch (err) {
    console.error(`Error copying files for ${paymentMethod}:`, err);
  }
};
