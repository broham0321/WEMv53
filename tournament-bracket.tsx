"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Wrestler {
  id: string
  name: string
  alignment: "Face" | "Heel"
  finisher: string
  entranceMusic: string
  popularity: number
  championships: string[]
  photo: string
  favoriteMatchType: string
  brand: "Raw" | "SmackDown" | "NXT" | "Free Agent"
  record: {
    wins: number
    losses: number
    draws: number
  }
}

interface TournamentMatch {
  id: string
  round: number
  position: number
  wrestler1Id?: string
  wrestler2Id?: string
  winnerId?: string
  isChampionshipMatch?: boolean
  championshipId?: string
}

interface Tournament {
  id: string
  name: string
  date: string
  participants: number
  matches: TournamentMatch[]
  championshipId?: string
  winner?: string
  completed: boolean
}

export function TournamentBracket() {
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [selectedWrestlers, setSelectedWrestlers] = useState<string[]>([])
  const [participantCount, setParticipantCount] = useState<number>(8)
  const [championships, setChampionships] = useState<any[]>([])
  const [newTournament, setNewTournament] = useState<Omit<Tournament, "id" | "matches" | "completed">>({
    name: "",
    date: new Date().toISOString().split("T")[0],
    participants: 8,
  })
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null)
  const [tournamentHistory, setTournamentHistory] = useState<Tournament[]>([])
  const [activeTab, setActiveTab] = useState("tournaments")

  useEffect(() => {
    // Load wrestlers from local storage
    const storedWrestlers = localStorage.getItem("wrestlers")
    if (storedWrestlers) {
      setWrestlers(JSON.parse(storedWrestlers))
    }

    // Load tournaments from local storage
    const storedTournaments = localStorage.getItem("tournaments")
    if (storedTournaments) {
      setTournaments(JSON.parse(storedTournaments))
    }

    // Load championships from local storage
    const storedChampionships = localStorage.getItem("championships")
    if (storedChampionships) {
      setChampionships(JSON.parse(storedChampionships))
    }

    const storedTournamentHistory = localStorage.getItem("tournamentHistory")
    if (storedTournamentHistory) {
      setTournamentHistory(JSON.parse(storedTournamentHistory))
    }
  }, [])

  const generateMatches = (participants: number): TournamentMatch[] => {
    const rounds = Math.log2(participants)
    const matches: TournamentMatch[] = []

    // Generate all rounds
    for (let round = 1; round <= rounds; round++) {
      const matchesInRound = participants / Math.pow(2, round)

      for (let position = 1; position <= matchesInRound; position++) {
        matches.push({
          id: `${round}-${position}`,
          round,
          position,
        })
      }
    }

    return matches
  }

  const createTournament = () => {
    if (!newTournament.name) {
      alert("Tournament name is required")
      return
    }

    if (selectedWrestlers.length !== participantCount) {
      alert(`Please select exactly ${participantCount} wrestlers`)
      return
    }

    // Generate matches
    const matches = generateMatches(participantCount)

    // Assign wrestlers to first round matches
    const shuffledWrestlers = [...selectedWrestlers].sort(() => Math.random() - 0.5)
    const firstRoundMatches = matches.filter((match) => match.round === 1)

    firstRoundMatches.forEach((match, index) => {
      match.wrestler1Id = shuffledWrestlers[index * 2]
      match.wrestler2Id = shuffledWrestlers[index * 2 + 1]
    })

    const tournament: Tournament = {
      id: Date.now().toString(),
      name: newTournament.name,
      date: newTournament.date,
      participants: participantCount,
      matches,
      championshipId: newTournament.championshipId,
      completed: false,
    }

    const updatedTournaments = [...tournaments, tournament]
    setTournaments(updatedTournaments)
    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments))

    // Reset form
    setNewTournament({
      name: "",
      date: new Date().toISOString().split("T")[0],
      participants: 8,
    })
    setSelectedWrestlers([])
    setActiveTournament(tournament)
  }

  const getWrestlerName = (id?: string) => {
    if (!id) return "TBD"
    const wrestler = wrestlers.find((w) => w.id === id)
    return wrestler ? wrestler.name : "Unknown"
  }

  const setMatchWinner = (matchId: string, winnerId: string) => {
    if (!activeTournament) return

    const updatedMatches = [...activeTournament.matches]
    const matchIndex = updatedMatches.findIndex((m) => m.id === matchId)

    if (matchIndex === -1) return

    const match = updatedMatches[matchIndex]
    match.winnerId = winnerId

    // Find the next match
    const nextRound = match.round + 1
    const nextPosition = Math.ceil(match.position / 2)
    const nextMatch = updatedMatches.find((m) => m.round === nextRound && m.position === nextPosition)

    if (nextMatch) {
      // Determine if this wrestler goes to wrestler1 or wrestler2 slot
      if (match.position % 2 === 1) {
        nextMatch.wrestler1Id = winnerId
      } else {
        nextMatch.wrestler2Id = winnerId
      }
    }

    // Check if tournament is completed
    const finalMatch = updatedMatches.find((m) => m.round === Math.log2(activeTournament.participants))
    let isCompleted = false
    let tournamentWinner = undefined

    if (finalMatch && finalMatch.winnerId) {
      isCompleted = true
      tournamentWinner = finalMatch.winnerId

      // If this is a championship tournament, update the championship holder
      if (activeTournament.championshipId) {
        updateChampionshipHolder(activeTournament.championshipId, finalMatch.winnerId)
      }
    }

    const updatedTournament = {
      ...activeTournament,
      matches: updatedMatches,
      completed: isCompleted,
      winner: tournamentWinner,
    }

    setActiveTournament(updatedTournament)

    // Update tournaments list
    const updatedTournaments = tournaments.map((t) => (t.id === updatedTournament.id ? updatedTournament : t))
    setTournaments(updatedTournaments)
    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments))

    // Update tournament history
    setTournamentHistory((prevHistory) => [...prevHistory, updatedTournament])
    localStorage.setItem("tournamentHistory", JSON.stringify([...tournamentHistory, updatedTournament]))
  }

  const updateChampionshipHolder = (championshipId: string, wrestlerId: string) => {
    const updatedChampionships = championships.map((championship) =>
      championship.id === championshipId ? { ...championship, currentHolder: wrestlerId } : championship,
    )

    setChampionships(updatedChampionships)
    localStorage.setItem("championships", JSON.stringify(updatedChampionships))

    // Also update the wrestler's championships
    const updatedWrestlers = wrestlers.map((wrestler) => {
      if (wrestler.id === wrestlerId) {
        // Add championship if not already there
        if (!wrestler.championships.includes(championshipId)) {
          return {
            ...wrestler,
            championships: [...wrestler.championships, championshipId],
          }
        }
      }
      return wrestler
    })

    setWrestlers(updatedWrestlers)
    localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))
  }

  useEffect(() => {
    localStorage.setItem("wrestlers", JSON.stringify(wrestlers))
    localStorage.setItem("tournamentHistory", JSON.stringify(tournamentHistory))
  }, [wrestlers, tournamentHistory])

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="tournaments">
          <Card>
            <CardHeader>
              <CardTitle>Create Tournament</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Tournament Name</Label>
                  <Input
                    id="name"
                    value={newTournament.name}
                    onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    id="date"
                    value={newTournament.date}
                    onChange={(e) => setNewTournament({ ...newTournament, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="participants">Participants</Label>
                  <Select
                    value={participantCount.toString()}
                    onValueChange={(value) => setParticipantCount(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Select Wrestlers</Label>
                  <div className="flex flex-wrap gap-2">
                    {wrestlers.map((wrestler) => (
                      <Button
                        key={wrestler.id}
                        variant={selectedWrestlers.includes(wrestler.id) ? "secondary" : "outline"}
                        onClick={() => {
                          if (selectedWrestlers.includes(wrestler.id)) {
                            setSelectedWrestlers(selectedWrestlers.filter((id) => id !== wrestler.id))
                          } else {
                            setSelectedWrestlers([...selectedWrestlers, wrestler.id])
                          }
                        }}
                      >
                        {wrestler.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={createTournament}>Create Tournament</Button>
              </div>
            </CardContent>
          </Card>

          {activeTournament && (
            <Card>
              <CardHeader>
                <CardTitle>{activeTournament.name} Bracket</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.from({ length: Math.log2(activeTournament.participants) }, (_, i) => i + 1).map((round) => (
                  <div key={round} className="mb-4">
                    <h3>Round {round}</h3>
                    <div className="flex flex-col gap-2">
                      {activeTournament.matches
                        .filter((match) => match.round === round)
                        .map((match) => (
                          <div key={match.id} className="flex items-center justify-between border p-2 rounded-md">
                            <span>{getWrestlerName(match.wrestler1Id)}</span>
                            <span>vs</span>
                            <span>{getWrestlerName(match.wrestler2Id)}</span>
                            {!match.winnerId && (
                              <div>
                                <Button onClick={() => setMatchWinner(match.id, match.wrestler1Id || "")}>
                                  {getWrestlerName(match.wrestler1Id)} Wins
                                </Button>
                                <Button onClick={() => setMatchWinner(match.id, match.wrestler2Id || "")}>
                                  {getWrestlerName(match.wrestler2Id)} Wins
                                </Button>
                              </div>
                            )}
                            {match.winnerId && <span>Winner: {getWrestlerName(match.winnerId)}</span>}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
                {activeTournament.completed && (
                  <div>
                    <h2>Tournament Winner: {getWrestlerName(activeTournament.winner)}</h2>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Tournament History</CardTitle>
            </CardHeader>
            <CardContent>
              {tournamentHistory.map((tournament) => (
                <div key={tournament.id} className="border p-4 rounded-md mb-4">
                  <h3>{tournament.name}</h3>
                  <p>Date: {tournament.date}</p>
                  <p>Winner: {getWrestlerName(tournament.winner)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

