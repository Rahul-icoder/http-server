import express from "express";
import serveIndex from "serve-index";
import { networkInterfaces } from "os";
import QRCode from "qrcode";

const app = express();

// user multer to add upload feature and also use stream for uploading

const HOME = process.env.HOME;
app.use("/files", serveIndex(HOME, { icons: true }));
app.use("/files", express.static(HOME));

app.listen(8080, function () {
  console.log("server running on port 8080");
  const nets = networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        results.push(net.address);
      }
    }
  }

  if (results.length > 0) {
    QRCode.toString(
      `http://${results[0]}:8080/files`,
      { type: "terminal" },
      function (err, url) {
        console.log(url);
        console.log(`http://${results[0]}:8080/files`);
      }
    );
  }
});
