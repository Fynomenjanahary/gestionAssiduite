import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, QrCode, Award, AlertTriangle, CheckCircle } from "lucide-react"
import { QRScannerReal as QRScanner} from "@/components/ui/qr-scanner-real"

const reasons = [
  { id: "presence", label: "Présence en cours", type: "bonus", points: 2 },
  { id: "participation", label: "Participation active", type: "bonus", points: 3 },
  { id: "aide", label: "Aide aux autres étudiants", type: "bonus", points: 1 },
  { id: "absence", label: "Absence non justifiée", type: "malus", points: -2 },
  { id: "retard", label: "Retard répété", type: "malus", points: -1 },
  { id: "comportement", label: "Comportement inapproprié", type: "malus", points: -3 },
]

// Base de données simulée des étudiants
const studentsDatabase = {
  STU001: { id: "STU001", name: "Alice Martin", level: "L1" },
  STU002: { id: "STU002", name: "Bob Dupont", level: "L2" },
  STU003: { id: "STU003", name: "Claire Bernard", level: "L3" },
  STU004: { id: "STU004", name: "David Moreau", level: "M1" },
  STU005: { id: "STU005", name: "Emma Rousseau", level: "M2" },
  "001": { id: "001", name: "Alice Martin", level: "L1" },
  "002": { id: "002", name: "Bob Dupont", level: "L2" },
  "003": { id: "003", name: "Claire Bernard", level: "L3" },
}

interface Attribution {
  studentId: string
  studentName: string
  studentLevel: string
  qrData: string
  reason: string
  points: number
  type: string
  timestamp: string
}

export default function AttributionPage() {
  const [selectedReason, setSelectedReason] = useState("")
  const [showScanner, setShowScanner] = useState(false)
  const [lastAttribution, setLastAttribution] = useState<Attribution | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)

  const selectedReasonData = reasons.find((r) => r.id === selectedReason)

  // Simulation du scan QR code (remplacez par votre composant QR scanner)
  const handleQRScan = (qrData: string) => {
    console.log("QR Code scanné:", qrData)
    setScanError(null)

    if (!selectedReasonData) {
      setScanError("Aucune raison sélectionnée")
      return
    }

    // Chercher l'étudiant dans la base de données
    const student = studentsDatabase[qrData as keyof typeof studentsDatabase]

    if (!student) {
      setScanError(`Étudiant non trouvé pour l'ID: ${qrData}`)
      return
    }

    // Créer l'attribution
    const attribution: Attribution = {
      studentId: student.id,
      studentName: student.name,
      studentLevel: student.level,
      qrData: qrData,
      reason: selectedReasonData.label,
      points: selectedReasonData.points,
      type: selectedReasonData.type,
      timestamp: new Date().toLocaleString("fr-FR"),
    }

    console.log("Attribution créée:", attribution)

    // Ici vous pourriez sauvegarder en base de données
    // await saveAttribution(attribution)

    setLastAttribution(attribution)
    setShowScanner(false)
    setSelectedReason("")
  }

  // Fonction de simulation pour tester
  const simulateQRScan = () => {
    const testQRCodes = ["STU001", "STU002", "STU003", "001", "002", "003"]
    const randomQR = testQRCodes[Math.floor(Math.random() * testQRCodes.length)]
    handleQRScan(randomQR)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-100 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Attribution de Points</h1>
            <p className="text-blue-700">Sélectionnez une raison puis scannez le badge de l'étudiant</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sélection de la raison */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Étape 1: Choisir une raison
              </CardTitle>
              <CardDescription className="text-blue-700">
                Sélectionnez la raison pour laquelle vous voulez attribuer des points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger className="border-blue-300">
                  <SelectValue placeholder="Sélectionnez une raison..." />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{reason.label}</span>
                        <Badge variant={reason.type === "bonus" ? "default" : "destructive"} className="ml-2">
                          {reason.points > 0 ? "+" : ""}
                          {reason.points} pts
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedReasonData && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    {selectedReasonData.type === "bonus" ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className="font-medium text-blue-900">{selectedReasonData.label}</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Cette action attribuera{" "}
                    <span
                      className={`font-bold ${selectedReasonData.type === "bonus" ? "text-green-600" : "text-red-600"}`}
                    >
                      {selectedReasonData.points > 0 ? "+" : ""}
                      {selectedReasonData.points} points
                    </span>{" "}
                    à l'étudiant
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scanner QR */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Étape 2: Scanner le badge
              </CardTitle>
              <CardDescription className="text-blue-700">Scannez le QR code du badge de l'étudiant</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedReason ? (
                <div className="text-center py-8">
                  <QrCode className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-blue-600">Veuillez d'abord sélectionner une raison</p>
                </div>
              ) : !showScanner ? (
                <div className="text-center py-8 space-y-4">
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Activer le Scanner
                  </Button>
                  
                  {/* Bouton de simulation pour tester */}
                  <div className="mt-4">
                    <Button
                      onClick={simulateQRScan}
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      🧪 Simuler un scan (Test)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QRScanner onScan={handleQRScan} />
                  <p className="text-blue-600 mb-4">Scanner activé - Positionnez le QR code devant la caméra</p>
                  <Button
                    onClick={() => setShowScanner(false)}
                    variant="outline"
                    className="border-blue-300 text-blue-700"
                  >
                    Arrêter le scanner
                  </Button>
                </div>
              )}

              {/* Erreur de scan */}
              {scanError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{scanError}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dernière attribution */}
        {lastAttribution && (
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Attribution Réussie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-700 mb-1">Étudiant</p>
                  <p className="font-medium text-green-900">{lastAttribution.studentName}</p>
                  <p className="text-xs text-green-600">Niveau: {lastAttribution.studentLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">QR Code scanné</p>
                  <p className="font-mono text-sm text-green-900">{lastAttribution.qrData}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Points attribués</p>
                  <p className="font-medium text-green-900">
                    {lastAttribution.points > 0 ? "+" : ""}
                    {lastAttribution.points} points
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Raison</p>
                  <p className="font-medium text-green-900">{lastAttribution.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Date et heure</p>
                  <p className="font-medium text-green-900">{lastAttribution.timestamp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}