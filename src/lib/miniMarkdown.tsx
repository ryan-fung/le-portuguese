/**
 * A tiny, safe markdown-ish renderer for lesson bodies. Supports exactly what
 * the curriculum uses: paragraphs (blocks separated by blank lines), `- ` bullet
 * lists, and inline **bold**. No HTML injection — everything is plain React
 * nodes, never dangerouslySetInnerHTML.
 */

import { Fragment, type ReactNode } from 'react'

/** Split a line into <strong> runs on **bold** markers. */
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts
    .filter((p) => p.length > 0)
    .map((part, i) => {
      const bold = part.match(/^\*\*([^*]+)\*\*$/)
      if (bold) return <strong key={i} className="font-semibold text-slate-100">{bold[1]}</strong>
      return <Fragment key={i}>{part}</Fragment>
    })
}

export function MiniMarkdown({ body, className }: { body: string; className?: string }) {
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)

  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        const isList = lines.every((l) => l.trim().startsWith('- '))
        if (isList) {
          return (
            <ul key={bi} className="my-3 list-disc space-y-1.5 pl-5 text-slate-300">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.trim().slice(2))}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={bi} className="my-3 leading-relaxed text-slate-300">
            {renderInline(block)}
          </p>
        )
      })}
    </div>
  )
}
