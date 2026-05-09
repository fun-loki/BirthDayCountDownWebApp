import { useCallback, useMemo, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { postAnalyzePhotos } from '../services/analyzeApi'
import type { AnalyzePhotoItem } from '../types'
import styles from './AdminPage.module.css'

function splitLines(s: string): string[] {
  return s
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean)
}

function joinLines(arr: string[]) {
  return arr.join('\n')
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function AdminPage() {
  const [files, setFiles] = useState<File[]>([])
  const [items, setItems] = useState<AnalyzePhotoItem[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const preview = useMemo(() => JSON.stringify(items, null, 2), [items])

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : []
    setFiles(list)
    setError(null)
  }

  const runAnalyze = async () => {
    if (files.length === 0) {
      setError('Choose one or more images first.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const next = await postAnalyzePhotos(files)
      setItems(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setBusy(false)
    }
  }

  const updateRow = useCallback((index: number, patch: Partial<AnalyzePhotoItem>) => {
    setItems((prev) => {
      const next = [...prev]
      const row = next[index]
      if (!row) return prev
      next[index] = { ...row, ...patch }
      return next
    })
  }, [])

  const reorder = useCallback((from: number, to: number) => {
    setItems((prev) => {
      if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length) {
        return prev
      }
      const next = [...prev]
      const [row] = next.splice(from, 1)
      next.splice(to, 0, row)
      return next.map((r, i) => ({ ...r, displayOrder: i + 1 }))
    })
  }, [])

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = (to: number) => (e: React.DragEvent) => {
    e.preventDefault()
    const from = Number(e.dataTransfer.getData('text/plain'))
    if (Number.isNaN(from)) return
    reorder(from, to)
    setDragIndex(null)
  }

  const onDragEnd = () => setDragIndex(null)

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <h1 className={styles.title}>Photo metadata</h1>
        <Link className={styles.nav} to="/">
          ← Back to site
        </Link>
      </div>

      <p className={styles.hint}>
        Internal tool: upload images, run vision analysis, tweak fields, reorder, then download{' '}
        <code className={styles.mono}>photos.json</code>. Copy analyzed images into{' '}
        <code className={styles.mono}>public/photos/</code> using the filenames referenced in the JSON,
        then deploy.
      </p>

      <div className={styles.toolbar}>
        <label className={styles.fileLabel}>
          <input
            type="file"
            className={styles.fileInput}
            accept="image/*"
            multiple
            onChange={onPick}
          />
          {files.length ? `${files.length} file(s) selected` : 'Choose images'}
        </label>
        <button type="button" className={styles.btn} disabled={busy} onClick={() => void runAnalyze()}>
          {busy ? 'Analyzing…' : 'Analyze with AI'}
        </button>
        <button
          type="button"
          className={styles.btn}
          disabled={items.length === 0}
          onClick={() => downloadJson('photos.json', items)}
        >
          Download photos.json
        </button>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {items.length > 0 ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th />
                <th>Order</th>
                <th>Id / file</th>
                <th>Summary</th>
                <th>Details</th>
                <th>Mood</th>
                <th>Setting</th>
                <th>Tags</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => (
                <tr
                  key={row.id}
                  className={dragIndex === index ? styles.rowDragging : undefined}
                  draggable
                  onDragStart={onDragStart(index)}
                  onDragOver={onDragOver}
                  onDrop={onDrop(index)}
                  onDragEnd={onDragEnd}
                >
                  <td className={styles.dragHandle} title="Drag to reorder">
                    ::
                  </td>
                  <td className={styles.mono}>{row.displayOrder}</td>
                  <td>
                    <div className={styles.mono}>{row.id}</div>
                    <input
                      className={styles.input}
                      value={row.file}
                      onChange={(e) => updateRow(index, { file: e.target.value })}
                    />
                  </td>
                  <td>
                    <textarea
                      className={styles.textarea}
                      value={row.summary}
                      onChange={(e) => updateRow(index, { summary: e.target.value })}
                    />
                  </td>
                  <td>
                    <textarea
                      className={styles.textarea}
                      value={joinLines(row.visible_details)}
                      onChange={(e) =>
                        updateRow(index, { visible_details: splitLines(e.target.value) })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      value={row.mood}
                      onChange={(e) => updateRow(index, { mood: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      value={row.setting}
                      onChange={(e) => updateRow(index, { setting: e.target.value })}
                    />
                  </td>
                  <td>
                    <textarea
                      className={styles.textarea}
                      value={joinLines(row.tags)}
                      onChange={(e) => updateRow(index, { tags: splitLines(e.target.value) })}
                    />
                  </td>
                  <td>
                    <textarea
                      className={styles.textarea}
                      value={row.confidence_notes}
                      onChange={(e) => updateRow(index, { confidence_notes: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {items.length > 0 ? (
        <section className={styles.preview}>
          <h2 className={styles.previewTitle}>JSON preview</h2>
          <pre className={styles.pre}>{preview}</pre>
        </section>
      ) : null}
    </div>
  )
}
