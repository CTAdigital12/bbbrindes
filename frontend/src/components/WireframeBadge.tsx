// Selo fixo indicando que esta e uma versao de wireframe (dados ficticios).
export default function WireframeBadge() {
  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 select-none rounded-full border border-dashed border-wf-muted bg-wf-surface/90 px-3 py-1 text-[10px] uppercase tracking-wide text-wf-muted shadow-sm">
      Wireframe - dados ficticios
    </div>
  );
}
