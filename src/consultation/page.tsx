import { useState, useMemo } from "react"
import { ArrowLeft, Search, Filter, Download, Users } from "lucide-react"

// Données mockées des étudiants
const students = [
  { id: "001", name: "Alice Martin", level: "L1", points: 15, lastActivity: "2024-01-15", status: "active" },
  { id: "002", name: "Bob Dupont", level: "L2", points: -3, lastActivity: "2024-01-14", status: "warning" },
  { id: "003", name: "Claire Bernard", level: "L3", points: 22, lastActivity: "2024-01-15", status: "active" },
  { id: "004", name: "David Moreau", level: "M1", points: 8, lastActivity: "2024-01-13", status: "active" },
  { id: "005", name: "Emma Rousseau", level: "M2", points: -5, lastActivity: "2024-01-12", status: "critical" },
  { id: "006", name: "François Leroy", level: "L1", points: 12, lastActivity: "2024-01-15", status: "active" },
  { id: "007", name: "Gabrielle Simon", level: "L2", points: 18, lastActivity: "2024-01-14", status: "active" },
  { id: "008", name: "Henri Blanc", level: "L3", points: -1, lastActivity: "2024-01-13", status: "warning" },
  { id: "009", name: "Isabelle Petit", level: "M1", points: 25, lastActivity: "2024-01-15", status: "active" },
  { id: "010", name: "Julien Roux", level: "M2", points: 7, lastActivity: "2024-01-14", status: "active" },
]

export default function ConsultationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.id.includes(searchTerm)
      const matchesLevel = levelFilter === "all" || student.level === levelFilter
      const matchesStatus = statusFilter === "all" || student.status === statusFilter

      return matchesSearch && matchesLevel && matchesStatus
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "points":
          return b.points - a.points
        case "level":
          return a.level.localeCompare(b.level)
        case "lastActivity":
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [searchTerm, levelFilter, statusFilter, sortBy])

  const getStatusBadge = (status:string, points:number) => {
    if (points >= 20) return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Excellent</span>
    if (points >= 10) return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Bon</span>
    if (points >= 0) return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Moyen</span>
    if (points >= -5) return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Attention</span>
    return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Critique</span>
  }

  const getPointsColor = (points:number) => {
    if (points >= 10) return "text-green-600 font-semibold"
    if (points >= 0) return "text-blue-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  const handleGoBack = () => {
    window.history.back()
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
                value={levelFilter} 
                onChange={(e) => setLevelFilter(e.target.value)}
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
                <option value="name">Nom</option>
                <option value="points">Points</option>
                <option value="level">Niveau</option>
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
                      <td className="font-medium text-blue-900 p-3">{student.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs font-medium border border-blue-300 text-blue-700 rounded-full">
                          {student.level}
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