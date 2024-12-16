const { exec } = require("child_process");
const path = require("path");

const transcribeAudio = (req, res) => {
  const audioFilePath = req.file.path; // Caminho do áudio carregado
  const scriptPath = path.join(__dirname, "../transcribe.py"); // Caminho do script Python

  // Comando para executar o script Python
  const command = `python "${scriptPath}" "${audioFilePath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Erro ao executar o script Python:", error);
      return res.status(500).json({ error: "Erro ao processar o áudio." });
    }

    try {
      // Tentar interpretar o resultado JSON retornado pelo script Python
      const result = JSON.parse(stdout);

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      // Retornar a transcrição e os timestamps
      return res.status(200).json({
        text: result.text,
        segments: result.segments.map(segment => ({
          start: segment.start,
          end: segment.end,
          words: segment.words.map(word => ({
            start: word.start,
            end: word.end,
            text: word.text,
          })),
        })),
      });
    } catch (parseError) {
      console.error("Erro ao interpretar o JSON:", parseError);
      console.error("Saída do script Python:", stdout);
      return res.status(500).json({ error: "Erro ao interpretar o resultado." });
    }
  });
};

module.exports = { transcribeAudio };
