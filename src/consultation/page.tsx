import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Search, Download, Users, Filter } from "lucide-react"
import type { Student } from "./types"

export default function ConsultationPage() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [niveauFilter, setNiveauFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("nom")

  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:8000/api/display")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur")
        return res.json()
      })
      .then((data: Student[]) => {
        setStudents(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm)

      const matchesNiveau =
        niveauFilter === "all" || student.niveau === niveauFilter

      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter

      return matchesSearch && matchesNiveau && matchesStatus
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "points":
          return b.points - a.points
        case "niveau":
          return a.niveau.localeCompare(b.niveau)
        case "lastActivity":
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        default:
          return a.nom.localeCompare(b.nom)
      }
    })
  }, [searchTerm, niveauFilter, statusFilter, sortBy, students])

  const getStatusBadge = (status: string, points: number) => {
    if (points >= 20)
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Excellent</span>
    if (points >= 10)
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Bon</span>
    if (points >= 0)
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Moyen</span>
    if (points >= -5)
      return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Attention</span>
    return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Critique</span>
  }

  const getPointsColor = (points: number) => {
    if (points >= 10) return "text-green-600 font-semibold"
    if (points >= 0) return "text-blue-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  const handleGoBack = () => {
    window.history.back()
  }

  if (loading) {
    return <div className="p-8 text-center text-blue-700 font-semibold">Chargement des données...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 font-semibold">Erreur : {error}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              className="text-blue-700 hover:bg-blue-100 p-2 rounded-lg mr-4 flex items-center"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </button>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Consultation des Activités</h1>
              <p className="text-blue-700">Liste des étudiants et leurs points d'assiduité</p>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Étudiants</p>
                <p className="text-2xl font-bold text-blue-900">{filteredAndSortedStudents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Excellents</p>
                <p className="text-2xl font-bold text-green-700">
                  {filteredAndSortedStudents.filter((s) => s.points >= 20).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">★</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Attention</p>
                <p className="text-2xl font-bold text-orange-700">
                  {filteredAndSortedStudents.filter((s) => s.points < 0 && s.points >= -5).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">!</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Critiques</p>
                <p className="text-2xl font-bold text-red-700">
                  {filteredAndSortedStudents.filter((s) => s.points < -5).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">⚠</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-lg">
          <div className="p-6 border-b border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres et Recherche
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select 
                value={niveauFilter} 
                onChange={(e) => setNiveauFilter(e.target.value)}
                className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les niveaux</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
                <option value="M2">M2</option>
              </select>

              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="warning">Attention</option>
                <option value="critical">Critique</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="nom">Nom</option>
                <option value="points">Points</option>
                <option value="niveau">Niveau</option>
                <option value="lastActivity">Dernière activité</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des étudiants */}
        <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-lg">
          <div className="p-6 border-b border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900">Liste des Étudiants ({filteredAndSortedStudents.length})</h3>
            <p className="text-sm text-blue-700">Consultez les points d'assiduité de chaque étudiant</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left p-3 text-blue-900 font-semibold">ID</th>
                    <th className="text-left p-3 text-blue-900 font-semibold">Nom</th>
                    <th className="text-left p-3 text-blue-900 font-semibold">Niveau</th>
                    <th className="text-left p-3 text-blue-900 font-semibold">Points</th>
                    <th className="text-left p-3 text-blue-900 font-semibold">Statut</th>
                    <th className="text-left p-3 text-blue-900 font-semibold">Dernière Activité</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedStudents.map((student) => (
                    <tr key={student.id} className="border-b border-blue-100 hover:bg-blue-50/50">
                      <td className="font-mono text-blue-700 p-3">{student.id}</td>
                      <td className="font-medium text-blue-900 p-3">{student.nom}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs font-medium border border-blue-300 text-blue-700 rounded-full">
                          {student.niveau}
                        </span>
                      </td>
                      <td className={`p-3 ${getPointsColor(student.points)}`}>
                        {student.points > 0 ? "+" : ""}
                        {student.points}
                      </td>
                      <td className="p-3">{getStatusBadge(student.status, student.points)}</td>
                      <td className="text-blue-700 p-3">
                        {new Date(student.lastActivity).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
