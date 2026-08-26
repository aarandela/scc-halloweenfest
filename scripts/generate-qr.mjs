import QRCode from "qrcode";

const target = "https://spacecityhalloweenfest.com/qr";
const sharedOptions = {
  errorCorrectionLevel: "H",
  margin: 4,
  color: {
    dark: "#000000ff",
    light: "#ffffffff"
  }
};

await Promise.all([
  QRCode.toFile("public/space-city-halloween-festival-qr.svg", target, {
    ...sharedOptions,
    type: "svg"
  }),
  QRCode.toFile("public/space-city-halloween-festival-qr.png", target, {
    ...sharedOptions,
    type: "png",
    width: 1200
  })
]);

console.log(`Generated print QR artwork for ${target}`);
