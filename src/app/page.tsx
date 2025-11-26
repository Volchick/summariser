"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, History, BarChart3, ArrowRight } from "lucide-react"

export default function Home() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight text-balance">
              Преобразуйте видео в
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                мгновенные резюме
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed text-balance">
              Извлекайте ключевые моменты из любого видео. Работает на основе ИИ-транскрипции и интеллектуального
              резюмирования.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/summarize">
              <Button
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                Начать
                <ArrowRight className={`w-5 h-5 transition-transform ${isHovering ? "translate-x-1" : ""}`} />
              </Button>
            </Link>
            <Link href="/history">
              <Button
                variant="outline"
                className="border-slate-500 text-slate-300 hover:bg-slate-700 px-8 py-6 text-lg font-semibold rounded-lg cursor-pointer bg-transparent"
              >
                История
              </Button>
            </Link>
          </div>

          {/* Stats/Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { icon: Zap, label: "Молниеносно быстро", desc: "Резюме за секунды" },
              { icon: History, label: "Полная история", desc: "Отслеживайте все резюме" },
              { icon: BarChart3, label: "На основе ИИ", desc: "Умное извлечение и анализ" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
                <h3 className="font-semibold text-white mb-2">{feature.label}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-800/30 border-t border-slate-700 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Как это работает</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Вставьте URL видео", desc: "Введите любую ссылку на видео" },
              { step: "2", title: "Обработка ИИ", desc: "Загрузка, извлечение аудио и транскрипция" },
              { step: "3", title: "Получите резюме", desc: "Мгновенное интеллектуальное резюме" },
              { step: "4", title: "Сохраните и получайте доступ", desc: "Просматривайте историю в любое время" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
