"use client"

import { useState, useEffect } from "react"

export function EventViewer() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [wrestlers, setWrestlers] = useState<any[]>([])
  const [championships, setChampionships] = useState<any[]>([])
  const [matchTypes, setMatchTypes] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0)
  const [isRunningShow, setIsRunningShow] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    const storedEvents = localStorage.getItem("events")
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }

    const storedWrestlers = localStorage.getItem("wrestlers")
    if (storedWrestlers) {
      setWrestlers(JSON.parse(storedWrestlers))
    }

    const storedChampionships = localStorage.getItem("championships")
    if (storedChampionships) {
      setChampionships(JSON.parse(storedChampionships))
    }

    const storedMatchTypes = localStorage.getItem("matchTypes")
    if (storedMatchTypes) {
      setMatchTypes(JSON.parse(storedMatchTypes))
    }

    const storedBrands = localStorage.getItem("brands")
    if (storedBrands) {
      setBrands(JSON.parse(storedBrands))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events))
  }, [events])

  useEffect(() => {
    if (selectedEventId && events.length > 0) {
}

