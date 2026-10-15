import { parseInline } from '@/lib/markup';

/** Transliteration: upright (never italic), muted, under the Arabic, with the focus part underlined. */
export function Translit({ text, className = '', onBoard = false }: { text: string; className?: string; onBoard?: boolean }) {
  return (
    <p lang="ar-Latn" className={`tr-text text-tr ${onBoard ? 'text-board-muted' : ''} ${className}`}>
      {parseInline(text).map((tok, i) =>
        tok.t === 'focus' ? (
          <span key={i} className="tr-focus">
            {tok.v}
          </span>
        ) : (
          <span key={i}>{tok.v}</span>
        ),
      )}
    </p>
  );
}
