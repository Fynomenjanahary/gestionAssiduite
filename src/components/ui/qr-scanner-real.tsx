"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Camera, X, RotateCcw, AlertCircle, CheckCircle } from "lucide-react"
import jsQR from "jsqr"

interface QRScannerProps {
  onScan: (qrData: string) => void // Cette fonction recevra la valeur scannée
}

export function QRScannerReal({ onScan }: QRScannerProps) {
  const [isClient, setIsClient] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [isSupported, setIsSupported] = useState(true)
  const [lastScanResult, setLastScanResult] = useState<string | null>(null)
  const [scanCount, setScanCount] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Vérifier le support côté client
  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      setIsSupported(supported)

      if (!supported) {
        setError("Votre navigateur ne supporte pas l'accès à la caméra. Essayez avec Chrome, Firefox ou Safari récent.")
      }
    }
  }, [])

  // Fonction pour démarrer la caméra
  const startCamera = async () => {
    if (!isSupported) {
      setError("L'API de la caméra n'est pas supportée")
      return
    }

    try {
      setError(null)
      setIsScanning(true)
      setLastScanResult(null)
      setScanCount(0)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          // Commencer à scanner après que la vidéo soit prête
          setTimeout(() => {
            scanIntervalRef.current = setInterval(scanQRCode, 100) // Scanner toutes les 100ms pour plus de réactivité
          }, 500)
        }
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err)
      handleCameraError(err)
      setIsScanning(false)
    }
  }

  // Gestion des erreurs de caméra
  const handleCameraError = (err: unknown) => {
    let errorMessage = "Impossible d'accéder à la caméra."

    if (err instanceof DOMException || err instanceof Error) {
      switch (err.name) {
        case "NotAllowedError":
          errorMessage =
            "Accès à la caméra refusé. Cliquez sur l'icône de caméra dans la barre d'adresse pour autoriser l'accès."
          break
        case "NotFoundError":
          errorMessage = "Aucune caméra trouvée sur cet appareil."
          break
        case "NotSupportedError":
          errorMessage = "La caméra n'est pas supportée par ce navigateur. Essayez Chrome ou Firefox."
          break
        case "NotReadableError":
          errorMessage = "La caméra est déjà utilisée par une autre application."
          break
        case "OverconstrainedError":
          errorMessage = "Impossible de satisfaire les contraintes de la caméra."
          break
        default:
          errorMessage = `Erreur: ${err.message}`
      }
    }

    setError(errorMessage)
  }

  // Fonction pour scanner le QR code RÉELLEMENT
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return

    try {
      // Ajuster la taille du canvas à la vidéo
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Dessiner la frame vidéo sur le canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Obtenir les données d'image du canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Utiliser jsQR pour décoder le QR code
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert", // Optimisation pour de meilleures performances
      })

      // Incrémenter le compteur de scans pour le debug
      setScanCount((prev) => prev + 1)

      if (qrCode) {
        console.log("QR Code détecté:", qrCode.data)
        setLastScanResult(qrCode.data)

        // Arrêter le scanner
        stopCamera()

        // Appeler la fonction de callback avec la valeur scannée
        onScan(qrCode.data)
      }
    } catch (err) {
      console.error("Erreur lors du scan:", err)
    }
  }

  // Fonction pour arrêter la caméra
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsScanning(false)
  }

  // Changer de caméra
  const switchCamera = async () => {
    stopCamera()
    setFacingMode(facingMode === "user" ? "environment" : "user")

    setTimeout(() => {
      startCamera()
    }, 500)
  }

  // Nettoyer lors du démontage
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Affichage de chargement côté serveur
  if (!isClient) {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardContent className="p-8 text-center">
            <div className="w-48 h-48 mx-auto border-2 border-blue-400 rounded-lg flex items-center justify-center bg-white/80">
              <div>
                <QrCode className="h-16 w-16 text-blue-400 mx-auto animate-pulse" />
                <p className="text-sm text-blue-600 mt-2">Chargement du scanner...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Zone de scan */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
        <CardContent className="p-4">
          {!isScanning ? (
            // Vue d'attente
            <div className="text-center py-8">
              <div className="w-48 h-48 mx-auto border-2 border-blue-400 rounded-lg flex items-center justify-center bg-white/80">
                <div>
                  <QrCode className="h-16 w-16 text-blue-400 mx-auto" />
                  <p className="text-sm text-blue-600 mt-2">
                    {isSupported ? "Cliquez pour scanner" : "Scanner non disponible"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Vue caméra active
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full max-w-md mx-auto rounded-lg bg-black"
                autoPlay
                playsInline
                muted
              />

              {/* Canvas caché pour le traitement */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Overlay de visée */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-48 h-48 border-2 border-blue-500 rounded-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500"></div>
                </div>
              </div>

              {/* Instructions et debug info */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                Placez le QR code dans le cadre (Scans: {scanCount})
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Affichage du dernier résultat scanné */}
      {lastScanResult && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-700">
            <strong>QR Code détecté:</strong> {lastScanResult}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages d'erreur */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Boutons de contrôle */}
      <div className="flex gap-2 justify-center flex-wrap">
        {!isScanning ? (
          <Button
            onClick={startCamera}
            disabled={!isSupported}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isSupported ? "Activer la Caméra" : "Caméra non supportée"}
          </Button>
        ) : (
          <>
            <Button onClick={stopCamera} variant="destructive">
              <X className="h-4 w-4 mr-2" />
              Arrêter
            </Button>

            <Button onClick={switchCamera} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              <RotateCcw className="h-4 w-4 mr-2" />
              Changer Caméra ({facingMode === "environment" ? "Arrière" : "Avant"})
            </Button>
          </>
        )}
      </div>

      {/* Instructions détaillées */}
      <div className="text-center space-y-2">
        <p className="text-xs text-blue-600">📱 Autorisez l'accès à la caméra quand votre navigateur le demande</p>
        <p className="text-xs text-blue-500">💡 Utilisez la caméra arrière pour de meilleurs résultats</p>
        <p className="text-xs text-blue-500">🎯 Centrez bien le QR code dans le cadre</p>
        {!isSupported && <p className="text-xs text-red-600">⚠️ Votre navigateur ne supporte pas l'accès à la caméra</p>}
      </div>
    </div>
  )
}