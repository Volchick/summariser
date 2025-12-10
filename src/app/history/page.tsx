"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Play, Trash2 } from "lucide-react"
import Link from "next/link"

interface HistoryItem {
  id: string
  title: string
  url: string
  summary: string
  createdAt: string
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/history")
        if (!response.ok) throw new Error("Failed to fetch history")
        const data = await response.json()
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      setItems(items.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/summarize">
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 mb-4">
              ← Back to Summarizer
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Summary History</h1>
          <p className="text-slate-400">Your previously summarized videos</p>
        </div>

        {error && <Card className="bg-red-500/10 border-red-500/20 p-4 mb-6 text-red-400">{error}</Card>}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400">Loading history...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <Play className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No summaries yet</h3>
            <p className="text-slate-400 mb-6">Start by summarizing your first video</p>
            <Link href="/summarize">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                Summarize a Video
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Link key={item.id} href={`/history/${item.id}`}>
                <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.summary}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()} at{" "}
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleDelete(item.id)
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
