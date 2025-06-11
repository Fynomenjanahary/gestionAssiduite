import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Award, BarChart3, GraduationCap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-blue-900">Gestion d'Assiduité</h1>
          </div>
          <p className="text-blue-700 text-lg">
            Système de gestion des points d'assiduité pour les étudiants (L1, L2, L3, M1, M2)
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Étudiants</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">1,234</div>
              <p className="text-xs text-blue-600">Tous niveaux confondus</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Points Attribués</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">8,456</div>
              <p className="text-xs text-blue-600">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Taux de Présence</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">87%</div>
              <p className="text-xs text-blue-600">Moyenne générale</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-blue-200 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-blue-900">Attribution de Points</CardTitle>
              <CardDescription className="text-blue-700">
                Attribuer des points bonus ou malus aux étudiants en scannant leur badge QR
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/attribution">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Commencer l'Attribution
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-blue-900">Consultation des Activités</CardTitle>
              <CardDescription className="text-blue-700">
                Consulter la liste des étudiants, leurs points et filtrer par niveau ou date
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/consultation">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                  Voir les Activités
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">Accès Rapide</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Niveau L1
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Niveau L2
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Niveau L3
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Niveau M1
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Niveau M2
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}