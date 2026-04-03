package com.rqrpinturas.orcamento.ml

import android.content.Context
import android.util.Log
import com.google.ai.edge.litert.Accelerator
import com.google.ai.edge.litert.CompiledModel
import com.google.ai.edge.litert.Environment
import java.io.File
import java.nio.ByteBuffer

class LiteRtManager(private val context: Context) {
    private var compiledModel: CompiledModel? = null
    private var environment: Environment? = null

    companion object {
        private const val TAG = "LiteRtManager"
    }

    /**
     * Inicializa o ambiente LiteRT e o modelo compilado com aceleração de NPU.
     * @param modelPath Caminho do arquivo .tflite nos assets.
     */
    fun initialize(modelPath: String): Boolean {
        return try {
            Log.d(TAG, "Inicializando LiteRT com NPU para o modelo: $modelPath")
            
            // Diretório para cache de compilação (JIT -> AOT local)
            // Isso reduz drasticamente o tempo de inicialização nas execuções subsequentes.
            val cacheDir = File(context.cacheDir, "litert_cache")
            if (!cacheDir.exists()) cacheDir.mkdirs()

            // O Environment gerencia as dependências de hardware.
            // Aqui especificamos o diretório de cache nas opções de ambiente se disponível.
            // Para LiteRT 2.1+, usamos as opções de ambiente.
            
            // Opções do modelo: Tenta NPU, faz fallback para GPU e depois CPU.
            val options = CompiledModel.Options(Accelerator.NPU, Accelerator.GPU, Accelerator.CPU)
            
            // Nota: Versões específicas do SDK podem exigir que o cache seja passado via Environment.
            // Para simplificar esta primeira versão, focamos na inicialização acelerada via assets.
            
            compiledModel = CompiledModel.create(
                context.assets,
                modelPath,
                options
            )
            
            Log.i(TAG, "LiteRT inicializado com sucesso.")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao inicializar LiteRT: ${e.message}", e)
            false
        }
    }

    /**
     * Executa a inferência no modelo de segmentação.
     * @param inputBuffer Buffer de entrada formatado conforme exigido pelo modelo (geralmente RGB 256x256 ou similar).
     * @return Os buffers de saída (máscara de segmentação e metadados).
     */
    fun runInference(inputBuffer: ByteBuffer): Array<ByteBuffer>? {
        val model = compiledModel ?: run {
            Log.w(TAG, "Modelo não inicializado.")
            return null
        }

        return try {
            val inputBuffers = model.createInputBuffers()
            val outputBuffers = model.createOutputBuffers()

            // Preenche o buffer de entrada
            inputBuffer.rewind()
            inputBuffers[0].put(inputBuffer)
            
            // Executa na NPU/GPU
            model.run(inputBuffers, outputBuffers)
            
            outputBuffers
        } catch (e: Exception) {
            Log.e(TAG, "Erro durante a inferência: ${e.message}")
            null
        }
    }
    
    fun close() {
        compiledModel?.close()
        compiledModel = null
    }
}
