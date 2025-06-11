import React, { useEffect, useState } from 'react';
import type { Student } from './types'; // ajuste le chemin selon ton projet
 // ajuste le chemin selon ton projet

const ConsultationTest: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/display')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur serveur');
        }
        return res.json();
      })
      .then((data: Student[]) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des étudiants</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.nom} {student.prenom} - {student.niveau} - Points : {student.points}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConsultationTest;
