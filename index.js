"use strict";

const querystring = require("querystring");
const express = require("express");
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

const PORT = 4000;
const OUTPUT_PATH = "assets/images/resize";

// Image types that can be handled by Sharp
const SUPPORTED_IMAGE_TYPES = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "tiff",
];

// 이미지 변환 라우터
app.get("/api/image-resize", async (req, res) => {
  console.log(req.query);
  const { filePath, size } = req.query;

  if (!filePath) {
    return res.status(400).send("파일 경로가 필요합니다.");
  }

  if (!size || (size != "s" && size != "l")) {
    return res.status(400).send("파일 사이즈가 잘못 입력되었습니다.");
  }

  // 파일 확장자 및 기본 이름 추출
  const fileExtension = path.extname(filePath).substring(1).toLowerCase();

  // 지원되지 않는 파일 형식 확인
  if (!SUPPORTED_IMAGE_TYPES.includes(fileExtension)) {
    return res.status(400).send("지원되지 않는 파일 형식입니다.");
  }

  // 파일 경로 유효성 검사
  if (fs.ensureFileSync(filePath)) {
    return res.status(404).send("파일을 찾을 수 없습니다.");
  }

  // 1. 이미 이미지가 변환되었는지 확인
  // 2. 변환된 이미지가 없다면 이미지 변환
  const outputPath = path.join(OUTPUT_PATH, size, uuidv4());
  console.log("outputPath:", outputPath);
  await sharp(filePath).toFormat("webp").toFile(outputPath);
});

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
