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
