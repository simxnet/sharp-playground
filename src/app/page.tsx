"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function Page() {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>()
  const [image, setImage] = useState<ArrayBuffer | null>()

  async function operate(code: string) {
    const image = (await fetch("/api/run", {
      method: "POST",
      headers: {
        code: String.raw`${code.replace(/\n/g, "")}`
      }
    }))

    if (image.status !== 200) setError((await image.json()).message ?? "unknown error")
    else {
      setImage(await image.arrayBuffer())
      setError(null)
  }
  }

  function toBase64Url(buffer: ArrayBuffer) {
    return `data:image/png;base64,${btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )}`
  }

  return (
    <>
    <div className="flex flex-row mb-5 items-center gap-4">
    <img src="/sharp-logo.svg" className="hue-rotate-[103deg] w-20" />
    <h1 className="text-5xl font-bold">
      Sharp Playground
    </h1>
    </div>
    <div className="flex flex-row w-full gap-5 justify-between">
      <div className="w-full p-5 rounded-lg bg-secondary">
      <img src={image ? toBase64Url(image) : "https://placehold.co/600x400/EEE/31343C"} onError={(e) => e.currentTarget.src = "https://placehold.co/600x400/EEE/31343C"} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex flex-col w-[40em] gap-3 rounded-lg p-5 bg-secondary">
        <Textarea placeholder="Code here" className="font-mono" onChange={(e) => setCode(e.currentTarget.value)} />
        <Button className="w-full block" onClick={async () => await operate(code)}>Apply</Button>
      </div>
    </div>
    <a target="_blank" className="text-sm text-sky-500 hover:text-sky-600 underline" href="https://sharp.pixelplumbing.com/">Sharp documentation</a>
    </>
  )
}