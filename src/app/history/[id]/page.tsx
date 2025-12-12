"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Copy, Trash2, Share2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface HistoryDetail {
  id: string
  title: string
  url: string
  summary: string
  createdAt: string
}

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [paramsReady, setParamsReady] = useState(false)
  const [id, setId] = useState("")
  const [detail, setDetail] = useState<HistoryDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id)
      setParamsReady(true)
    })
  }, [params])

  useEffect(() => {
    if (!paramsReady) return

    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/history/${id}`)
        if (!response.ok) throw new Error("Failed to fetch details")
        const data = await response.json()
        setDetail(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [paramsReady, id])

  const handleCopy = async () => {
    if (!detail) return
    try {
      await navigator.clipboard.writeText(detail.summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Failed to copy")
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/history/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      router.push("/history")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Загрузка резюме...</p>
        </div>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/history">
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 mb-4">
              ← Назад к истории
            </Button>
          </Link>
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-red-400 mb-4">{error || "Резюме не найдено"}</p>
            <Link href="/history">
              <Button className="bg-blue-600 hover:bg-blue-700">Вернуться к истории</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <Link href="/history">
          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 mb-8">
            ← Назад к истории
          </Button>
        </Link>

        {/* Main Content */}
        <Card className="bg-slate-800 border-slate-700 p-8 mb-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{detail.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-400">
              <div>
                <p className="mb-2">
                  <span className="text-slate-500">Суммаризировано:</span> {new Date(detail.createdAt).toLocaleDateString()}{" "}
                  в {new Date(detail.createdAt).toLocaleTimeString()}
                </p>
                <p className="break-all text-xs">
                  <span className="text-slate-500">Источник:</span> {detail.url}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Content */}
          <div className="bg-slate-700/50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Резюме</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Скопировано!" : "Копировать"}
              </button>
            </div>
            <p className="text-slate-200 leading-relaxed text-base whitespace-pre-wrap">{detail.summary}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/summarize" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                Суммаризировать другое
              </Button>
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Удалить
            </button>
            <button
              onClick={() => {
                if (navigator.share && detail.url) {
                  navigator.share({
                    title: detail.title,
                    text: detail.summary.substring(0, 100) + "...",
                    url: detail.url,
                  })
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Поделиться
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
