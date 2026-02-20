import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: true,
})

export function Markdown({ content }: { content: string }) {
  const html = marked.parse(content, { async: false }) as string
  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
