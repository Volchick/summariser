"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Play, Check } from "lucide-react"
import Link from "next/link"

export default function SummarizePage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    title: string
    summary: string
    videoId: string
  } | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error("Failed to summarize video")

      const data = await response.json()
      setResult(data)
      setUrl("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Video Summarizer</h1>
          <p className="text-slate-400 text-lg">Paste a video link and get an instant AI-powered summary</p>
        </div>

        {/* Input Form */}
        {!result && (
          <Card className="bg-slate-800 border-slate-700 p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-slate-200 mb-2">
                  Video URL
                </label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto font-semibold rounded-lg transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Summarize Video
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Success Result */}
        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Video summarized successfully!</span>
              </div>
            </div>

            <Card className="bg-slate-800 border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-2">{result.title}</h2>
              <p className="text-slate-400 text-sm mb-6">ID: {result.videoId}</p>

              <div className="bg-slate-700/50 rounded-lg p-6 mb-8">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Summary</h3>
                <p className="text-slate-200 leading-relaxed text-base">{result.summary}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setResult(null)
                    setUrl("")
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                >
                  Summarize Another
                </Button>
                <Link href="/history" className="flex-1">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all">
                    View History
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
