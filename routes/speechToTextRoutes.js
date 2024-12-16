const express = require("express");
const router = express.Router();
const { transcribeAudio } = require("../apis/speechToText");
const upload = require("../middlewares/upload");

router.post("/", upload.single("audio"), transcribeAudio);

module.exports = router;
