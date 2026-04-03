package com.rqrpinturas.orcamento.plugins

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.rqrpinturas.orcamento.ml.LiteRtManager
import java.nio.ByteBuffer
import java.nio.ByteOrder

@CapacitorPlugin(name = "SmartMeasure")
class SmartMeasurePlugin : Plugin() {
    private lateinit var liteRtManager: LiteRtManager
    private val TAG = "SmartMeasurePlugin"

    override fun load() {
        Log.i(TAG, "Carregando SmartMeasurePlugin...")
        liteRtManager = LiteRtManager(context)
        liteRtManager.initialize("models/wall_segmentation.tflite")
    }

    @PluginMethod
    fun measureArea(call: PluginCall) {
        try {
            val base64Image = call.getString("image") ?: return call.reject("Imagem não fornecida")
            val referenceSize = call.getDouble("referenceSize") ?: 1.0 
            
            val imageBytes = Base64.decode(base64Image, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)

            val inputBitmap = Bitmap.createScaledBitmap(bitmap, 256, 256, true)
            val inputBuffer = convertBitmapToByteBuffer(inputBitmap)

            val outputBuffers = liteRtManager.runInference(inputBuffer)
            
            if (outputBuffers == null) {
                call.reject("Falha na inferência LiteRT NPU")
                return
            }

            // Lógica Multi-Classe: [Gross Area, Windows, Doors]
            val measurementData = calculateDetailedArea(outputBuffers[0], referenceSize)

            val ret = JSObject()
            ret.put("grossArea", measurementData.gross)
            ret.put("netArea", measurementData.net)
            
            val openings = JSArray()
            measurementData.openings.forEach { opening ->
                val o = JSObject()
                o.put("type", opening.type)
                o.put("area", opening.area)
                o.put("id", opening.id)
                openings.put(o)
            }
            ret.put("openings", openings)
            
            call.resolve(ret)
            
        } catch (e: Exception) {
            Log.e(TAG, "Erro no plugin SmartMeasure: ${e.message}")
            call.reject("Erro interno: ${e.message}")
        }
    }

    private fun convertBitmapToByteBuffer(bitmap: Bitmap): ByteBuffer {
        val buffer = ByteBuffer.allocateDirect(1 * 256 * 256 * 3 * 4)
        buffer.order(ByteOrder.nativeOrder())
        val intValues = IntArray(256 * 256)
        bitmap.getPixels(intValues, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
        for (pixelValue in intValues) {
            buffer.putFloat(((pixelValue shr 16 and 0xFF) / 255f))
            buffer.putFloat(((pixelValue shr 8 and 0xFF) / 255f))
            buffer.putFloat(((pixelValue and 0xFF) / 255f))
        }
        return buffer
    }

    data class Opening(val id: String, val type: String, var area: Double)
    data class MeasurementResult(val gross: Double, val net: Double, val openings: List<Opening>)

    private fun calculateDetailedArea(maskBuffer: ByteBuffer, referenceSize: Double): MeasurementResult {
        maskBuffer.rewind()
        
        var wallPixels = 0
        var windowPixels = 0
        var doorPixels = 0
        val totalPixels = 256 * 256
        
        // Simulação de classes: 0=bg, 1=wall, 2=window, 3=door
        // Em um modelo real, usaríamos argmax no output
        while (maskBuffer.hasRemaining()) {
            val valFloat = maskBuffer.float
            when {
                valFloat > 0.8f -> wallPixels++
                valFloat > 0.5f -> windowPixels++
                valFloat > 0.3f -> doorPixels++
            }
        }
        
        val fovArea = 8.0 * referenceSize // Escala base
        val wallArea = (wallPixels.toDouble() / totalPixels) * fovArea
        val windowArea = (windowPixels.toDouble() / totalPixels) * fovArea * 0.2 // Peso menor (aberturas menores)
        val doorArea = (doorPixels.toDouble() / totalPixels) * fovArea * 0.3

        val openingsList = mutableListOf<Opening>()
        if (windowArea > 0.1) openingsList.add(Opening("w1", "Janela", windowArea))
        if (doorArea > 0.1) openingsList.add(Opening("d1", "Porta", doorArea))

        return MeasurementResult(
            gross = wallArea + windowArea + doorArea,
            net = wallArea,
            openings = openingsList
        )
    }
}
