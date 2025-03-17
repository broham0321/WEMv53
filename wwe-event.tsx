"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import StarRating from "./star-rating"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Add the import for the ChampionshipsManager component
import { ChampionshipsManager } from "./championships-manager"
// Add the import for the TournamentBracket component
import { TournamentBracket } from "./tournament-bracket"
// Add the import for the BrandsManager component
import { BrandsManager } from "./brands-manager"
// Add the import for the MatchTypesManager component
import { MatchTypesManager } from "./match-types-manager"
// Add the import for the PromoTypesManager component
import { PromoTypesManager } from "./promo-types-manager"
// Add the import for the EventViewer component
import { EventViewer } from "./event-viewer"
// Import the match types and brands data
import { defaultMatchTypes, defaultBrands, type MatchType, type Brand } from "./match-types-data"

interface Record {
  wins: number
  losses: number
  draws: number
}

// Update the Wrestler type to include championships
type Wrestler = {
  id: string
  name: string
  alignment: "Face" | "Heel"
  finisher: string
  entranceMusic: string
  popularity: number
  championships: string[] // This already exists, but we'll use it differently
  photo: string
  favoriteMatchType: string
  brand: string // Changed from enum to string to support custom brands
  record: {
    wins: number
    losses: number
    draws: number
  }
}

// Update the Match type to include championship information
type Match = {
  id: string
  type: string
  typeId: string // Add typeId to store the match type ID
  wrestlers: string[]
  winner: string[]
  rating: number
  notes: string
  isChampionshipMatch: boolean
  championshipId?: string
}

interface Championship {
  id: string
  name: string
  currentHolder: string
  image?: string
}

const defaultChampionships: Championship[] = [
  { id: "wwe-title", name: "WWE Championship", currentHolder: "" },
  { id: "wwe-women-title", name: "WWE Women's Championship", currentHolder: "" },
]

interface Event {
  id: string
  name: string
  date: string
  location: string
  matches: Match[]
  attendance: number
  revenue: number
}

const WWEEvent = () => {
  const [events, setEvents] = useState<any[]>([])
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])
  const [matchTypes, setMatchTypes] = useState<MatchType[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    name: "",
    date: "",
    location: "",
    matches: [],
    attendance: 0,
    revenue: 0,
  })
  const [participantCount, setParticipantCount] = useState<number>(2)

  // Update the newMatch state to include the new fields
  const [newMatch, setNewMatch] = useState<Omit<Match, "id">>({
    type: "",
    typeId: "",
    wrestlers: [],
    winner: [],
    rating: 0,
    notes: "",
    isChampionshipMatch: false,
    championshipId: undefined,
  })

  // Add a state for championships
  const [championships, setChampionships] = useState<Championship[]>(() => {
    const storedChampionships = localStorage.getItem("championships")
    return storedChampionships ? JSON.parse(storedChampionships) : defaultChampionships
  })

  // Update the newWrestler state to include the default record
  const [newWrestler, setNewWrestler] = useState<Omit<Wrestler, "id">>({
    name: "",
    alignment: "Face",
    finisher: "",
    entranceMusic: "",
    popularity: 50,
    championships: [],
    photo: "",
    favoriteMatchType: "",
    brand: "Free Agent",
    record: {
      wins: 0,
      losses: 0,
      draws: 0,
    },
  })

  const [editingWrestler, setEditingWrestler] = useState<Wrestler | null>(null)

  useEffect(() => {
    // Load events from local storage
    const storedEvents = localStorage.getItem("events")
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }

    // Load wrestlers from local storage
    const storedWrestlers = localStorage.getItem("wrestlers")
    if (storedWrestlers) {
      const parsedWrestlers = JSON.parse(storedWrestlers)

      // Ensure all wrestlers have a record object
      const wrestlersWithRecords = parsedWrestlers.map((wrestler: any) => ({
        ...wrestler,
        record: wrestler.record || { wins: 0, losses: 0, draws: 0 },
      }))

      setWrestlers(wrestlersWithRecords)
    }

    // Load match types from local storage
    const storedMatchTypes = localStorage.getItem("matchTypes")
    if (storedMatchTypes) {
      setMatchTypes(JSON.parse(storedMatchTypes))
    } else {
      setMatchTypes(defaultMatchTypes)
      localStorage.setItem("matchTypes", JSON.stringify(defaultMatchTypes))
    }

    // Load brands from local storage
    const storedBrands = localStorage.getItem("brands")
    if (storedBrands) {
      setBrands(JSON.parse(storedBrands))
    } else {
      setBrands(defaultBrands)
      localStorage.setItem("brands", JSON.stringify(defaultBrands))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("wrestlers", JSON.stringify(wrestlers))
    localStorage.setItem("championships", JSON.stringify(championships))
    localStorage.setItem("events", JSON.stringify(events))
  }, [])

  const updateWrestlerRecords = (match: Match) => {
    match.wrestlers.forEach((wrestlerId) => {
      setWrestlers((prevWrestlers) => {
        return prevWrestlers.map((wrestler) => {
          if (wrestler.id === wrestlerId) {
            const isWinner = match.winner.includes(wrestlerId)
            return {
              ...wrestler,
              record: {
                ...wrestler.record,
                wins: isWinner ? wrestler.record.wins + 1 : wrestler.record.wins,
                losses: !isWinner ? wrestler.record.losses + 1 : wrestler.record.losses,
              },
            }
          }
          return wrestler
        })
      })
    })
  }

  // Add a function to toggle championship match status
  const toggleChampionshipMatch = (matchId: string, isChampionship: boolean) => {
    setNewEvent((prev) => ({
      ...prev,
      matches: prev.matches.map((match) =>
        match.id === matchId
          ? {
              ...match,
              isChampionshipMatch: isChampionship,
              championshipId: isChampionship ? match.championshipId : undefined,
            }
          : match,
      ),
    }))
  }

  // Add a function to set the championship for a match
  const setMatchChampionship = (matchId: string, championshipId: string) => {
    setNewEvent((prev) => ({
      ...prev,
      matches: prev.matches.map((match) => (match.id === matchId ? { ...match, championshipId } : match)),
    }))
  }

  // Update the addMatch function to reset the championship fields
  const addMatch = () => {
    if (!newMatch.typeId || newMatch.wrestlers.length !== participantCount) {
      alert(`Please select a match type and exactly ${participantCount} wrestlers`)
      return
    }

    // Find the match type name from the ID
    const matchType = matchTypes.find((mt) => mt.id === newMatch.typeId)
    if (!matchType) {
      alert("Invalid match type selected")
      return
    }

    setNewEvent((prev) => ({
      ...prev,
      matches: [
        ...prev.matches,
        {
          ...newMatch,
          id: Date.now().toString(),
          type: matchType.name, // Set the match type name from the selected match type
        },
      ],
    }))

    // Reset new match form
    setNewMatch({
      type: "",
      typeId: "",
      wrestlers: [],
      winner: [],
      rating: 0,
      notes: "",
      isChampionshipMatch: false,
      championshipId: undefined,
    })
    setParticipantCount(2)
  }

  // Add a function to update championship holder when a match is completed
  const updateChampionshipHolder = (match: Match) => {
    if (match.isChampionshipMatch && match.championshipId && match.winner.length > 0) {
      setChampionships((prevChampionships) =>
        prevChampionships.map((championship) =>
          championship.id === match.championshipId ? { ...championship, currentHolder: match.winner[0] } : championship,
        ),
      )

      // Save updated championships to localStorage
      localStorage.setItem("championships", JSON.stringify(championships))
    }
  }

  // Update the addEvent function to update championship holders
  const addEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.location) {
      alert("Event name, date, and location are required")
      return
    }

    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
      matches: newEvent.matches.map((match) => ({ ...match, id: Date.now().toString() })),
    }

    // Update wrestler records and championship holders for all matches
    newEvent.matches.forEach((match) => {
      if (match.winner.length > 0) {
        updateWrestlerRecords(match)
        updateChampionshipHolder(match)
      }
    })

    const updatedEvents = [...events, event]
    setEvents(updatedEvents)
    localStorage.setItem("events", JSON.stringify(updatedEvents))

    // Save updated wrestler records and championships to localStorage
    localStorage.setItem("wrestlers", JSON.stringify(wrestlers))
    localStorage.setItem("championships", JSON.stringify(championships))

    // Reset form
    setNewEvent({
      name: "",
      date: "",
      location: "",
      matches: [],
      attendance: 0,
      revenue: 0,
    })
  }

  const removeMatch = (index: number) => {
    setNewEvent((prev) => {
      const newMatches = [...prev.matches]
      newMatches.splice(index, 1)
      return { ...prev, matches: newMatches }
    })
  }

  const updateMatchRating = (matchId: string, newRating: number) => {
    setNewEvent((prev) => ({
      ...prev,
      matches: prev.matches.map((match) => (match.id === matchId ? { ...match, rating: newRating } : match)),
    }))
  }

  const updateMatchNotes = (matchId: string, notes: string) => {
    setNewEvent((prev) => ({
      ...prev,
      matches: prev.matches.map((match) => (match.id === matchId ? { ...match, notes: notes } : match)),
    }))
  }

  const setMatchWinner = (matchId: string, winner: string[]) => {
    setNewEvent((prev) => ({
      ...prev,
      matches: prev.matches.map((match) => (match.id === matchId ? { ...match, winner: winner } : match)),
    }))
  }

  // Add a function to toggle a championship for a wrestler
  const toggleWrestlerChampionship = (wrestlerId: string, championshipId: string) => {
    setWrestlers((prevWrestlers) =>
      prevWrestlers.map((wrestler) => {
        if (wrestler.id === wrestlerId) {
          const hasChampionship = wrestler.championships.includes(championshipId)
          return {
            ...wrestler,
            championships: hasChampionship
              ? wrestler.championships.filter((id) => id !== championshipId)
              : [...wrestler.championships, championshipId],
          }
        }
        return wrestler
      }),
    )

    // Update championship holders
    if (championships) {
      setChampionships((prevChampionships) =>
        prevChampionships.map((championship) => {
          const wrestler = wrestlers.find((w) => w.id === wrestlerId)
          if (championship.id === championshipId) {
            // If wrestler already has this championship, remove it
            if (wrestler && wrestler.championships.includes(championshipId)) {
              return { ...championship, currentHolder: undefined }
            }
            // Otherwise, set this wrestler as the current holder
            return { ...championship, currentHolder: wrestlerId }
          }
          return championship
        }),
      )
    }

    // Save to localStorage
    localStorage.setItem("wrestlers", JSON.stringify(wrestlers))
    localStorage.setItem("championships", JSON.stringify(championships))
  }

  const deleteEvent = (eventId: string) => {
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.filter((event) => event.id !== eventId)
      localStorage.setItem("events", JSON.stringify(updatedEvents))
      return updatedEvents
    })
  }

  // Add these functions after the deleteEvent function and before the return statement

  // Add a function to add a new wrestler
  const addWrestler = () => {
    if (!newWrestler.name) {
      alert("Wrestler name is required")
      return
    }

    const wrestler: Wrestler = {
      ...newWrestler,
      id: Date.now().toString(),
    }

    const updatedWrestlers = [...wrestlers, wrestler]
    setWrestlers(updatedWrestlers)
    localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))

    // Reset form
    setNewWrestler({
      name: "",
      alignment: "Face",
      finisher: "",
      entranceMusic: "",
      popularity: 50,
      championships: [],
      photo: "",
      favoriteMatchType: "",
      brand: "Free Agent",
      record: {
        wins: 0,
        losses: 0,
        draws: 0,
      },
    })
  }

  // Add a function to delete a wrestler
  const deleteWrestler = (wrestlerId: string) => {
    if (confirm("Are you sure you want to delete this wrestler?")) {
      const updatedWrestlers = wrestlers.filter((wrestler) => wrestler.id !== wrestlerId)
      setWrestlers(updatedWrestlers)
      localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))
    }
  }

  // Add a function to start editing a wrestler
  const startEditingWrestler = (wrestler: Wrestler) => {
    setEditingWrestler(wrestler)
  }

  // Add a function to save the edited wrestler
  const saveEditingWrestler = () => {
    if (!editingWrestler) return

    const updatedWrestlers = wrestlers.map((wrestler) =>
      wrestler.id === editingWrestler.id ? editingWrestler : wrestler,
    )

    setWrestlers(updatedWrestlers)
    localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))
    setEditingWrestler(null)
  }

  // Get brand color by brand name
  const getBrandColor = (brandName: string) => {
    const brand = brands.find((b) => b.name === brandName)
    return brand ? brand.color : "bg-gray-500"
  }

  // Get match type category
  const getMatchTypeCategory = (matchTypeId: string) => {
    const matchType = matchTypes.find((mt) => mt.id === matchTypeId)
    return matchType ? matchType.category : "Match"
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wrestling Event Manager</h1>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="view-event">View Event</TabsTrigger>
          <TabsTrigger value="wrestlers">Wrestlers</TabsTrigger>
          <TabsTrigger value="championships">Championships</TabsTrigger>
          <TabsTrigger value="tournament">Tournament</TabsTrigger>
          <TabsTrigger value="match-types">Match Types</TabsTrigger>
          <TabsTrigger value="promo-types">Promo Types</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Add New Event */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      type="text"
                      id="eventName"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      placeholder="WrestleMania, SummerSlam, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Date</Label>
                    <Input
                      type="date"
                      id="eventDate"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventLocation">Location</Label>
                    <Input
                      type="text"
                      id="eventLocation"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="City, Arena"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventAttendance">Attendance</Label>
                      <Input
                        type="number"
                        id="eventAttendance"
                        value={newEvent.attendance}
                        onChange={(e) => setNewEvent({ ...newEvent, attendance: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventRevenue">Revenue ($)</Label>
                      <Input
                        type="number"
                        id="eventRevenue"
                        value={newEvent.revenue}
                        onChange={(e) => setNewEvent({ ...newEvent, revenue: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={addEvent}
                    disabled={!newEvent.name || !newEvent.date || !newEvent.location}
                  >
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Add Matches */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add Match</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="matchType">Match Type</Label>
                    <Select
                      value={newMatch.typeId}
                      onValueChange={(value) => {
                        setNewMatch({ ...newMatch, typeId: value })
                        // Adjust participant count based on match type category
                        const category = getMatchTypeCategory(value)
                        if (category === "Promo" && participantCount !== 1) {
                          setParticipantCount(1)
                        }
                      }}
                    >
                      <SelectTrigger id="matchType">
                        <SelectValue placeholder="Select match type" />
                      </SelectTrigger>
                      <SelectContent>
                        {matchTypes.map((matchType) => (
                          <SelectItem key={matchType.id} value={matchType.id}>
                            {matchType.name} {matchType.category !== "Match" && `(${matchType.category})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participantCount">Number of Participants</Label>
                    <Input
                      type="number"
                      id="participantCount"
                      value={participantCount}
                      onChange={(e) => setParticipantCount(Number.parseInt(e.target.value))}
                      min="1"
                      max="30"
                      disabled={getMatchTypeCategory(newMatch.typeId) === "Promo"}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>
                        Select Wrestlers ({newMatch.wrestlers.length}/{participantCount})
                      </Label>
                      {newMatch.wrestlers.length > 0 && (
                        <Button variant="outline" size="sm" onClick={() => setNewMatch({ ...newMatch, wrestlers: [] })}>
                          Clear
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                      <div className="grid grid-cols-1 gap-1">
                        {wrestlers.map((wrestler) => (
                          <Button
                            key={wrestler.id}
                            variant={newMatch.wrestlers.includes(wrestler.id) ? "default" : "outline"}
                            onClick={() => {
                              const newWrestlers = newMatch.wrestlers.includes(wrestler.id)
                                ? newMatch.wrestlers.filter((id) => id !== wrestler.id)
                                : [...newMatch.wrestlers, wrestler.id]
                              setNewMatch({ ...newMatch, wrestlers: newWrestlers })
                            }}
                            className="justify-start w-full"
                            size="sm"
                          >
                            <div className="flex items-center w-full">
                              <span className="truncate">{wrestler.name}</span>
                              <Badge
                                variant="outline"
                                className={`ml-auto ${getBrandColor(wrestler.brand)} text-white text-xs`}
                              >
                                {wrestler.brand}
                              </Badge>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={addMatch}
                    disabled={!newMatch.typeId || newMatch.wrestlers.length !== participantCount}
                  >
                    Add Match
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Event Preview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Event Preview</CardTitle>
                  {newEvent.name && (
                    <div className="text-sm text-muted-foreground">
                      {newEvent.name} • {newEvent.date && new Date(newEvent.date).toLocaleDateString()} •{" "}
                      {newEvent.location}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {newEvent.matches.length > 0 ? (
                    <div className="space-y-4">
                      {newEvent.matches.map((match, index) => {
                        const isPromo = matchTypes.find((mt) => mt.id === match.typeId)?.category === "Promo"

                        return (
                          <Card key={match.id} className="overflow-hidden">
                            <CardHeader className={`p-3 ${isPromo ? "bg-purple-50" : "bg-muted"}`}>
                              <div className="flex items-center justify-between">
                                <div className="font-semibold">{match.type}</div>
                                <Button variant="ghost" size="icon" onClick={() => removeMatch(index)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 space-y-3">
                              <div className="space-y-1">
                                <div className="text-sm font-medium">Wrestlers:</div>
                                <div className="flex flex-wrap gap-1">
                                  {match.wrestlers.map((id) => {
                                    const wrestler = wrestlers.find((w) => w.id === id)
                                    return wrestler ? (
                                      <Badge
                                        key={id}
                                        variant={match.winner.includes(id) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => {
                                          if (match.type === "Singles Match") {
                                            setMatchWinner(match.id, [id])
                                          } else {
                                            const newWinners = match.winner.includes(id)
                                              ? match.winner.filter((winnerId) => winnerId !== id)
                                              : [...match.winner, id]
                                            setMatchWinner(match.id, newWinners)
                                          }
                                        }}
                                      >
                                        {wrestler.name}
                                      </Badge>
                                    ) : null
                                  })}
                                </div>
                              </div>

                              {!isPromo && (
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`championship-match-${match.id}`}
                                    checked={match.isChampionshipMatch}
                                    onCheckedChange={(checked) => toggleChampionshipMatch(match.id, checked)}
                                  />
                                  <Label htmlFor={`championship-match-${match.id}`}>Championship Match</Label>
                                </div>
                              )}

                              {match.isChampionshipMatch && (
                                <div className="space-y-1">
                                  <Label htmlFor={`championship-${match.id}`}>Championship:</Label>
                                  <Select
                                    value={match.championshipId}
                                    onValueChange={(value) => setMatchChampionship(match.id, value)}
                                  >
                                    <SelectTrigger id={`championship-${match.id}`}>
                                      <SelectValue placeholder="Select championship" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {championships.map((championship) => (
                                        <SelectItem key={championship.id} value={championship.id}>
                                          {championship.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <Label>Rating:</Label>
                                  <StarRating
                                    rating={match.rating}
                                    onRatingChange={(newRating) => updateMatchRating(match.id, newRating)}
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor={`match-notes-${match.id}`}>Notes:</Label>
                                <Textarea
                                  id={`match-notes-${match.id}`}
                                  value={match.notes}
                                  onChange={(e) => updateMatchNotes(match.id, e.target.value)}
                                  placeholder="Add match notes..."
                                  className="h-20 resize-none"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="mb-2">No matches added yet</div>
                      <div className="text-sm">Add matches to see them here</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Events List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Matches</TableHead>
                    <TableHead>Championship Matches</TableHead>
                    <TableHead>Avg. Rating</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.matches.length}</TableCell>
                        <TableCell>{event.matches.filter((match) => match.isChampionshipMatch).length}</TableCell>
                        <TableCell>
                          {event.matches.length > 0
                            ? (
                                event.matches.reduce((sum, match) => sum + (match.rating || 0), 0) /
                                event.matches.length
                              ).toFixed(1) + " ★"
                            : "N/A"}
                        </TableCell>
                        <TableCell>{event.attendance.toLocaleString()}</TableCell>
                        <TableCell>${event.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                        No events created yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view-event">
          <EventViewer />
        </TabsContent>

        <TabsContent value="wrestlers">
          {/* Champions Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-yellow-500"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
                Current Champions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {championships.map((championship) => {
                  const champion = wrestlers.find((w) => w.id === championship.currentHolder)
                  return (
                    <Card key={championship.id} className={champion ? "border-yellow-300" : "border-gray-200"}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{championship.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {champion ? (
                          <div className="flex items-center">
                            {championship.image && (
                              <div className="w-16 h-12 mr-3 flex-shrink-0">
                                <img
                                  src={championship.image || "/placeholder.svg"}
                                  alt={championship.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=48&width=64"
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex items-center">
                              {champion.photo && (
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-100">
                                  <img
                                    src={champion.photo || "/placeholder.svg"}
                                    alt={champion.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-semibold">{champion.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Badge
                                    variant="outline"
                                    className={`${getBrandColor(champion.brand)} text-white mr-2`}
                                  >
                                    {champion.brand}
                                  </Badge>
                                  <span>
                                    {champion.record.wins}-{champion.record.losses}-{champion.record.draws}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground italic">Vacant</div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Add New Wrestler Form */}
          <div className="border p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Add New Wrestler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wrestlerName">Wrestler Name</Label>
                <Input
                  type="text"
                  id="wrestlerName"
                  value={newWrestler.name}
                  onChange={(e) => setNewWrestler({ ...newWrestler, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrestlerAlignment">Alignment</Label>
                <Select
                  value={newWrestler.alignment}
                  onValueChange={(value) => setNewWrestler({ ...newWrestler, alignment: value as "Face" | "Heel" })}
                >
                  <SelectTrigger id="wrestlerAlignment">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Face">Face</SelectItem>
                    <SelectItem value="Heel">Heel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrestlerFinisher">Finisher</Label>
                <Input
                  type="text"
                  id="wrestlerFinisher"
                  value={newWrestler.finisher}
                  onChange={(e) => setNewWrestler({ ...newWrestler, finisher: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrestlerEntranceMusic">Entrance Music</Label>
                <Input
                  type="text"
                  id="wrestlerEntranceMusic"
                  value={newWrestler.entranceMusic}
                  onChange={(e) => setNewWrestler({ ...newWrestler, entranceMusic: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrestlerPopularity">Popularity</Label>
                <Input
                  type="number"
                  id="wrestlerPopularity"
                  value={newWrestler.popularity}
                  onChange={(e) => setNewWrestler({ ...newWrestler, popularity: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrestlerPhoto">Photo URL</Label>
                <Input
                  type="text"
                  id="wrestlerPhoto"
                  value={newWrestler.photo}
                  onChange={(e) => setNewWrestler({ ...newWrestler, photo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrestlerFavoriteMatchType">Favorite Match Type</Label>
                <Input
                  type="text"
                  id="wrestlerFavoriteMatchType"
                  value={newWrestler.favoriteMatchType}
                  onChange={(e) => setNewWrestler({ ...newWrestler, favoriteMatchType: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wrestlerBrand">Brand</Label>
                <Select
                  value={newWrestler.brand}
                  onValueChange={(value) => setNewWrestler({ ...newWrestler, brand: value })}
                >
                  <SelectTrigger id="wrestlerBrand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${brand.color} mr-2`}></div>
                          {brand.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Find the section where you display the wrestler form and add championship selection */}
              <div className="space-y-2">
                <Label htmlFor="championships">Championships</Label>
                <div className="grid grid-cols-2 gap-2">
                  {championships.map((championship) => {
                    const isHolder = newWrestler.championships.includes(championship.id)
                    return (
                      <Button
                        key={championship.id}
                        type="button"
                        variant={isHolder ? "default" : "outline"}
                        onClick={() => {
                          setNewWrestler({
                            ...newWrestler,
                            championships: isHolder
                              ? newWrestler.championships.filter((id) => id !== championship.id)
                              : [...newWrestler.championships, championship.id],
                          })
                        }}
                        className="justify-start"
                      >
                        {championship.name}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
            <Button className="mt-4" onClick={addWrestler}>
              Add Wrestler
            </Button>
          </div>

          {/* Display Wrestlers */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Wrestlers</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Alignment</TableHead>
                  <TableHead>Popularity</TableHead>
                  <TableHead>Record</TableHead>
                  <TableHead>Championships</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wrestlers.map((wrestler) => {
                  const isChampion = wrestler.championships.length > 0
                  return (
                    <TableRow key={wrestler.id} className={isChampion ? "bg-yellow-50" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {isChampion && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2 text-yellow-500"
                            >
                              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                              <path d="M4 22h16"></path>
                              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                            </svg>
                          )}
                          {wrestler.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getBrandColor(wrestler.brand)} text-white`}>
                          {wrestler.brand}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={wrestler.alignment === "Face" ? "default" : "destructive"}>
                          {wrestler.alignment}
                        </Badge>
                      </TableCell>
                      <TableCell>{wrestler.popularity}%</TableCell>
                      <TableCell>
                        {wrestler.record.wins}-{wrestler.record.losses}-{wrestler.record.draws}
                      </TableCell>
                      <TableCell>
                        {wrestler.championships.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {wrestler.championships.map((championshipId) => {
                              const championship = championships.find((c) => c.id === championshipId)
                              return championship ? (
                                <Badge
                                  key={championshipId}
                                  variant="secondary"
                                  className="bg-yellow-100 text-yellow-800 border-yellow-300"
                                >
                                  {championship.name}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        ) : (
                          "None"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => startEditingWrestler(wrestler)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                              <path d="m15 5 4 4"></path>
                            </svg>
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteWrestler(wrestler.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Add a dialog for editing wrestlers */}
          {editingWrestler && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Edit Wrestler: {editingWrestler.name}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editingWrestler.name}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-alignment">Alignment</Label>
                    <Select
                      value={editingWrestler.alignment}
                      onValueChange={(value: "Face" | "Heel") =>
                        setEditingWrestler({ ...editingWrestler, alignment: value })
                      }
                    >
                      <SelectTrigger id="edit-alignment">
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Face">Face</SelectItem>
                        <SelectItem value="Heel">Heel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-finisher">Finisher Move</Label>
                    <Input
                      id="edit-finisher"
                      value={editingWrestler.finisher}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, finisher: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-entrance-music">Entrance Music</Label>
                    <Input
                      id="edit-entrance-music"
                      value={editingWrestler.entranceMusic}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, entranceMusic: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-popularity">Popularity</Label>
                    <Input
                      type="range"
                      min="1"
                      max="100"
                      id="edit-popularity"
                      value={editingWrestler.popularity}
                      onChange={(e) =>
                        setEditingWrestler({ ...editingWrestler, popularity: Number.parseInt(e.target.value) })
                      }
                    />
                    <div className="text-center">{editingWrestler.popularity}%</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-photo">Photo URL</Label>
                    <Input
                      id="edit-photo"
                      value={editingWrestler.photo}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, photo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-favorite-match-type">Favorite Match Type</Label>
                    <Input
                      id="edit-favorite-match-type"
                      value={editingWrestler.favoriteMatchType}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, favoriteMatchType: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-brand">Brand</Label>
                    <Select
                      value={editingWrestler.brand}
                      onValueChange={(value) => setEditingWrestler({ ...editingWrestler, brand: value })}
                    >
                      <SelectTrigger id="edit-brand">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.name}>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${brand.color} mr-2`}></div>
                              {brand.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-championships">Championships</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {championships.map((championship) => {
                        const isHolder = editingWrestler.championships.includes(championship.id)
                        return (
                          <Button
                            key={championship.id}
                            type="button"
                            variant={isHolder ? "default" : "outline"}
                            onClick={() => {
                              setEditingWrestler({
                                ...editingWrestler,
                                championships: isHolder
                                  ? editingWrestler.championships.filter((id) => id !== championship.id)
                                  : [...editingWrestler.championships, championship.id],
                              })
                            }}
                            className="justify-start"
                          >
                            {championship.name}
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Record</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-wins">Wins</Label>
                        <Input
                          id="edit-wins"
                          type="number"
                          value={editingWrestler.record.wins}
                          onChange={(e) =>
                            setEditingWrestler({
                              ...editingWrestler,
                              record: {
                                ...editingWrestler.record,
                                wins: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-losses">Losses</Label>
                        <Input
                          id="edit-losses"
                          type="number"
                          value={editingWrestler.record.losses}
                          onChange={(e) =>
                            setEditingWrestler({
                              ...editingWrestler,
                              record: {
                                ...editingWrestler.record,
                                losses: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-draws">Draws</Label>
                        <Input
                          id="edit-draws"
                          type="number"
                          value={editingWrestler.record.draws}
                          onChange={(e) =>
                            setEditingWrestler({
                              ...editingWrestler,
                              record: {
                                ...editingWrestler.record,
                                draws: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setEditingWrestler(null)}>
                    Cancel
                  </Button>
                  <Button onClick={saveEditingWrestler}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="championships">
          <ChampionshipsManager wrestlers={wrestlers} />
        </TabsContent>

        <TabsContent value="tournament">
          <TournamentBracket />
        </TabsContent>

        <TabsContent value="match-types">
          <MatchTypesManager />
        </TabsContent>

        <TabsContent value="promo-types">
          <PromoTypesManager />
        </TabsContent>

        <TabsContent value="brands">
          <BrandsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WWEEvent

