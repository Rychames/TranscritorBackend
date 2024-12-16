import whisper
import sys
import json
import warnings

# Suprimir warnings desnecessários
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

def transcribe(audio_path):
    try:
        # Carregar o modelo utilizando a CPU
        model = whisper.load_model("base", device="cpu")
        # Transcrever o áudio
        result = model.transcribe(audio_path, word_timestamps=True)
        
        # Verificar se a chave 'segments' existe
        if 'segments' not in result:
            raise ValueError("A chave 'segments' não foi encontrada na resposta.")

        # Adicionando texto das palavras (caso o campo 'words' não esteja vazio)
        for segment in result["segments"]:
            if 'words' in segment:
                segment["words"] = [
                    {"start": word["start"], "end": word["end"], "text": word.get("word", "")}
                    for word in segment["words"]
                ]
            else:
                segment["words"] = []
        
        return result
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Receber o caminho do áudio como argumento
    audio_path = sys.argv[1]
    transcription = transcribe(audio_path)

    # Retornar o resultado em JSON
    print(json.dumps(transcription))
