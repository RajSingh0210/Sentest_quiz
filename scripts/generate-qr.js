const path = require("path");
const QRCode = require("qrcode");

async function main() {
  const [, , ...args] = process.argv;
  const urlFlagIndex = args.findIndex((arg) => arg === "--url");
  const url = urlFlagIndex !== -1 ? args[urlFlagIndex + 1] : null;

  if (!url) {
    console.error("Usage: npm run qr -- --url https://example.com");
    process.exit(1);
  }

  const outputPath = path.join(__dirname, "..", "public", "qr-code.png");
  await QRCode.toFile(outputPath, url, {
    color: {
      dark: "#0f172acc",
      light: "#ffffffff",
    },
    width: 512,
    margin: 2,
  });

  console.log(`QR code generated at ${outputPath} pointing to ${url}`);
}

main().catch((error) => {
  console.error("Failed to generate QR code:", error);
  process.exit(1);
});

