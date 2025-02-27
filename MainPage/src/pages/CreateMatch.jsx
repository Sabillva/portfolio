"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTeams } from "../context/TeamsContext"
import { useMatches } from "../context/MatchesContext"

const CreateMatch = () => {
  const navigate = useNavigate()
  const { teams } = useTeams()
  const { createMatch } = useMatches()
  const [selectedTeam, setSelectedTeam] = useState("")
  const [availableTeams, setAvailableTeams] = useState([])

  useEffect(() => {
    // Yalnız tam məlumatları olan komandaları göstər
    const fullInfoTeams = teams.filter(
      (team) => team.name && team.city && team.stadium && team.playDate && team.playTime && team.playerCount,
    )
    setAvailableTeams(fullInfoTeams)
  }, [teams])

  const handleSubmit = (e) => {
    e.preventDefault()
    const team = availableTeams.find((t) => t.id === Number.parseInt(selectedTeam))
    if (team) {
      const newMatch = {
        team: team,
        opponentTeam: null,
        date: team.playDate,
        time: team.playTime,
        stadium: team.stadium,
        playerCount: team.playerCount,
        city: team.city,
      }
      createMatch(newMatch)
      navigate("/matches")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Yeni Matç Yarat</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="team" className="block text-sm font-medium mb-1">
            Komandanı Seç
          </label>
          <select
            id="team"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Komanda seçin</option>
            {availableTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} - {team.city}, {team.stadium}, {team.playDate}, {team.playTime}, {team.playerCount} oyunçu
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Matç Yarat
        </button>
      </form>
    </div>
  )
}

export default CreateMatch

