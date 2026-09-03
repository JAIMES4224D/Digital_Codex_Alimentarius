import { useState, useMemo } from 'react';
import dataRaw from './data/sustancias.json';
import { Search, AlertCircle, Bookmark, FileText, RotateCcw } from 'lucide-react';

interface Sustancia {
  id: number;
  categoria: string;
  pagina_pdf: number;
  codigo_sin: string | null;
  nombre: string;
  condiciones: string;
}

const CATEGORIAS = [
  'Todas',
  'Fertilizantes y acondicionadores del suelo',
  'Control de plagas y enfermedades',
  'Aditivos e ingredientes no agrícolas',
  'Coadyuvantes de elaboración',
];

const CATEGORIA_META: Record<string, { code: string; accent: string }> = {
  Todas: { code: 'ALL', accent: '#8A93A0' },
  'Fertilizantes y acondicionadores del suelo': { code: 'FERT', accent: '#7EA243' }, // Verde corporativo
  'Control de plagas y enfermedades': { code: 'PLAG', accent: '#C77B4A' },
  'Aditivos e ingredientes no agrícolas': { code: 'ADIT', accent: '#23355d' }, // Azul marino corporativo
  'Coadyuvantes de elaboración': { code: 'COAD', accent: '#A084C7' },
};

const metaOf = (categoria: string) => CATEGORIA_META[categoria] ?? { code: 'GEN', accent: '#8A93A0' };

function CornerMarks({ color }: { color: string }) {
  return (
    <>
      <span className="cx-corner cx-corner-tl" style={{ borderColor: color }} />
      <span className="cx-corner cx-corner-tr" style={{ borderColor: color }} />
      <span className="cx-corner cx-corner-bl" style={{ borderColor: color }} />
      <span className="cx-corner cx-corner-br" style={{ borderColor: color }} />
    </>
  );
}

const CSS = `
  /* Reseteo absoluto para eliminar cualquier borde blanco o margen exterior */
  html, body, #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    background-color: #0B0F14 !important;
    overflow-x: hidden;
  }

  .codex-app, .codex-app * { box-sizing: border-box; }
  .codex-app button { all: unset; cursor: pointer; box-sizing: border-box; }
  .codex-app input { box-sizing: border-box; }
  
  .codex-app {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background: #0B0F14;
    color: #E7E4DC;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    text-align: left;
    background-image: linear-gradient(#161C22 1px, transparent 1px), linear-gradient(90deg, #161C22 1px, transparent 1px);
    background-size: 48px 48px;
  }
  
  .cx-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
  
  .cx-header { 
    border-bottom: 1px solid #232B33; 
    position: sticky; 
    top: 0; 
    z-index: 30; 
    background: #0B0F14; 
    width: 100%;
  }
  
  .cx-header-inner, .cx-main { 
    width: 100%; 
    max-width: 1350px;
    margin: 0 auto; 
    padding: 0 32px; 
  }
  
  .cx-header-inner { padding-top: 28px; padding-bottom: 22px; }
  
  .cx-title-row { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
  .cx-eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 11px; }
  .cx-h1 { font-size: 28px; font-weight: 700; margin: 0; color: #F1EFE8; letter-spacing: -0.02em; }
  .cx-subtitle { font-size: 14px; color: #94a3b8; margin: 6px 0 0; }
  
  .codex-app button.cx-fav-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: 12px; border: 1px solid #232B33; border-radius: 8px; transition: all 0.2s; }
  
  .cx-search-wrap { position: relative; margin-bottom: 20px; }
  .cx-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); }
  .cx-search-input { width: 100%; padding: 12px 64px 12px 44px; font-size: 14px; background: #12171D; border: 1px solid #232B33; border-radius: 10px; color: #E7E4DC; outline: none; transition: border-color 0.2s; }
  .cx-search-input:focus { border-color: #7EA243; }
  
  .codex-app button.cx-clear-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 4px; padding: 4px 8px; background: #1A212B; border-radius: 6px; }
  
  .cx-filters { display: flex; gap: 20px; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
  .codex-app button.cx-filter-btn { display: inline-flex; align-items: center; white-space: nowrap; padding: 6px 0 10px; font-size: 12px; border-bottom: 2px solid transparent; flex-shrink: 0; transition: color 0.2s; }
  
  .cx-count-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #94a3b8; margin: 24px 0 20px; }
  .cx-main { padding-top: 10px; padding-bottom: 60px; }
  
  .cx-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
  
  .cx-card { position: relative; background: #12171D; border: 1px solid #232B33; padding: 24px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; border-radius: 12px; transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
  .cx-card:hover { transform: translateY(-4px); border-color: #3A4552; box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
  
  .cx-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 14px; }
  .cx-tags { display: flex; align-items: center; gap: 8px; }
  .cx-sin-badge { font-size: 11px; padding: 3px 10px; border: 1px solid #232B33; color: #5B8DEF; background: rgba(91,141,239,0.05); border-radius: 6px; }
  
  .codex-app button.cx-fav-btn { display: flex; padding: 6px; background: #1A212B; border-radius: 6px; transition: background 0.2s; }
  .codex-app button.cx-fav-btn:hover { background: #232B33; }
  
  .cx-card-title { font-size: 18px; line-height: 1.35; font-weight: 700; margin: 0; color: #F1EFE8; }
  .cx-card-desc { font-size: 13px; margin-top: 10px; line-height: 1.6; color: #94a3b8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  
  .cx-card-footer { margin-top: 24px; padding-top: 14px; border-top: 1px solid #1D242B; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #64748b; }
  .cx-card-footer-left { display: flex; align-items: center; gap: 6px; }
  
  .cx-corner { position: absolute; width: 8px; height: 8px; pointer-events: none; }
  .cx-corner-tl { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
  .cx-corner-tr { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; }
  .cx-corner-bl { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; }
  .cx-corner-br { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }
  
  .cx-empty { text-align: center; padding: 90px 16px; border: 1px solid #1D242B; border-radius: 16px; margin-top: 16px; background: #12171D; }
  
  .cx-modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(11,15,20,0.85); backdrop-filter: blur(4px); }
  .cx-modal { position: relative; max-width: 520px; width: 100%; background: #12171D; border: 1px solid #232B33; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
  .cx-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid #232B33; background: #161C22; }
  .codex-app button.cx-modal-close { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #232B33; border-radius: 8px; color: #94a3b8; background: #12171D; transition: all 0.2s; }
  .codex-app button.cx-modal-close:hover { color: #fff; background: #232B33; }
  
  .cx-modal-body { padding: 24px; }
  .cx-modal-title { font-size: 22px; line-height: 1.3; font-weight: 700; margin: 0 0 12px; color: #F1EFE8; }
  .cx-modal-sin { display: inline-block; font-size: 12px; padding: 4px 12px; margin-bottom: 16px; border: 1px solid #232B33; color: #5B8DEF; background: rgba(91,141,239,0.05); border-radius: 6px; }
  
  .cx-modal-box { padding: 18px; background: #0B0F14; border: 1px solid #1D242B; border-radius: 12px; }
  .cx-modal-box-title { font-size: 12px; margin: 0 0 8px; color: #7EA243; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .cx-modal-box-text { font-size: 14px; line-height: 1.7; margin: 0; color: #C9CDD3; }
  
  .cx-modal-footer { display: flex; align-items: center; justify-content: space-between; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #1D242B; color: #94a3b8; }
  .codex-app button.cx-modal-fav-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #232B33; border-radius: 8px; transition: all 0.2s; }
`;

export default function App() {
  const sustancias: Sustancia[] = dataRaw as Sustancia[];
  const [query, setQuery] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    const saved = localStorage.getItem('codex_favs');
    return saved ? JSON.parse(saved) : [];
  });
  const [verSoloFavs, setVerSoloFavs] = useState(false);
  const [sustanciaModal, setSustanciaModal] = useState<Sustancia | null>(null);

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem('codex_favs', JSON.stringify(next));
      return next;
    });
  };

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sustancias.filter((item) => {
      const matchQuery =
        q === '' ||
        item.nombre.toLowerCase().includes(q) ||
        (item.codigo_sin && item.codigo_sin.toLowerCase().includes(q)) ||
        item.condiciones.toLowerCase().includes(q);
      const matchCat = categoriaSeleccionada === 'Todas' || item.categoria === categoriaSeleccionada;
      const matchFav = verSoloFavs ? favoritos.includes(item.id) : true;
      return matchQuery && matchCat && matchFav;
    });
  }, [query, categoriaSeleccionada, verSoloFavs, favoritos, sustancias]);

  return (
    <div className="codex-app">
      <style>{CSS}</style>

      <header className="cx-header">
        <div className="cx-header-inner">
          <div className="cx-title-row">
            <div>
              <div className="cx-eyebrow cx-mono">
                <span style={{ color: '#7EA243', fontWeight: 600 }}>CODEX</span>
                <span style={{ color: '#3A4552' }}>//</span>
                <span style={{ color: '#5B8DEF', fontWeight: 600 }}>SUSTANCIAS</span>
                <span style={{ color: '#94a3b8', border: '1px solid #232B33', padding: '1px 6px', borderRadius: '4px' }}>v2.0</span>
              </div>
              <h1 className="cx-h1">CODEX ALIMENTARIUS - Índice normativo de sustancias</h1>
              <p className="cx-subtitle">
                Consulta rápida de fertilizantes, plaguicidas, aditivos y coadyuvantes autorizados.
              </p>
            </div>

            <button
              className="cx-fav-toggle cx-mono"
              onClick={() => setVerSoloFavs(!verSoloFavs)}
              style={{
                borderColor: verSoloFavs ? '#7EA243' : '#232B33',
                color: verSoloFavs ? '#7EA243' : '#94a3b8',
                background: verSoloFavs ? 'rgba(126,162,67,0.1)' : '#12171D',
              }}
            >
              <Bookmark className="w-4 h-4" fill={verSoloFavs ? '#7EA243' : 'none'} />
              favoritos [{favoritos.length}]
            </button>
          </div>

          <div className="cx-search-wrap">
            <Search className="cx-search-icon" style={{ color: '#64748b' }} width={18} height={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, código SIN, restricción..."
              className="cx-search-input cx-mono"
            />
            {query && (
              <button className="cx-clear-btn cx-mono" onClick={() => setQuery('')}>
                <RotateCcw width={12} height={12} /> limpiar
              </button>
            )}
          </div>

          <div className="cx-filters cx-mono">
            {CATEGORIAS.map((cat) => {
              const meta = metaOf(cat);
              const active = categoriaSeleccionada === cat;
              return (
                <button
                  key={cat}
                  className="cx-filter-btn"
                  onClick={() => setCategoriaSeleccionada(cat)}
                  style={{
                    color: active ? meta.accent : '#64748b',
                    borderBottomColor: active ? meta.accent : 'transparent',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{meta.code}</span>
                  <span style={{ color: '#3A4552', margin: '0 6px' }}>·</span>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="cx-main">
        <div className="cx-header-inner" style={{ padding: '0', marginBottom: '20px' }}>
          <div className="cx-count-row cx-mono" style={{ margin: 0 }}>
            <span>
              Mostrando <strong style={{ color: '#7EA243' }}>{resultados.length}</strong> registros
            </span>
            {verSoloFavs && <span style={{ color: '#7EA243' }}>★ filtrando favoritos</span>}
          </div>
        </div>

        <div className="cx-header-inner" style={{ padding: 0 }}>
          <div className="cx-grid">
            {resultados.map((item) => {
              const meta = metaOf(item.categoria);
              const esFav = favoritos.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="cx-card"
                  onClick={() => setSustanciaModal(item)}
                  style={{ borderLeft: `4px solid ${meta.accent}` }}
                >
                  <CornerMarks color={meta.accent} />
                  <div>
                    <div className="cx-card-top">
                      <span className="cx-mono" style={{ fontSize: 11, color: '#64748b' }}>
                        №&nbsp;{String(item.id).padStart(4, '0')}
                      </span>
                      <div className="cx-tags">
                        {item.codigo_sin && (
                          <span className="cx-sin-badge cx-mono">SIN {item.codigo_sin}</span>
                        )}
                        <button
                          className="cx-fav-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorito(item.id);
                          }}
                          style={{ color: esFav ? '#7EA243' : '#64748b' }}
                          title={esFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                        >
                          <Bookmark width={16} height={16} fill={esFav ? '#7EA243' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <h2 className="cx-card-title">{item.nombre}</h2>
                    <p className="cx-card-desc">{item.condiciones}</p>
                  </div>

                  <div className="cx-card-footer cx-mono">
                    <span className="cx-card-footer-left">
                      <FileText width={13} height={13} /> p.{item.pagina_pdf}
                    </span>
                    <span style={{ color: meta.accent, fontWeight: 500 }}>ver ficha →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {resultados.length === 0 && (
            <div className="cx-empty">
              <AlertCircle width={40} height={40} style={{ margin: '0 auto 12px', color: '#64748b' }} />
              <h3 style={{ fontSize: 18, color: '#E7E4DC', margin: 0, fontWeight: 600 }}>Sin resultados</h3>
              <p className="cx-mono" style={{ fontSize: 13, marginTop: 8, color: '#64748b', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
                Prueba buscando otros términos, revisa el código SIN o cambia la categoría de filtro.
              </p>
            </div>
          )}
        </div>
      </main>

      {sustanciaModal && (
        <div className="cx-modal-overlay" onClick={() => setSustanciaModal(null)}>
          <div className="cx-modal" onClick={(e) => e.stopPropagation()}>
            <CornerMarks color={metaOf(sustanciaModal.categoria).accent} />
            <div
              className="cx-modal-header"
              style={{ borderLeft: `4px solid ${metaOf(sustanciaModal.categoria).accent}` }}
            >
              <span className="cx-mono" style={{ fontSize: 11, color: metaOf(sustanciaModal.categoria).accent, fontWeight: 600 }}>
                {metaOf(sustanciaModal.categoria).code} · {sustanciaModal.categoria}
              </span>
              <button className="cx-modal-close" onClick={() => setSustanciaModal(null)}>
                ✕
              </button>
            </div>

            <div className="cx-modal-body">
              <h3 className="cx-modal-title">{sustanciaModal.nombre}</h3>

              {sustanciaModal.codigo_sin && (
                <span className="cx-modal-sin cx-mono">SIN / aditivo — {sustanciaModal.codigo_sin}</span>
              )}

              <div className="cx-modal-box">
                <h4 className="cx-modal-box-title cx-mono">Condiciones y restricciones de uso</h4>
                <p className="cx-modal-box-text">{sustanciaModal.condiciones}</p>
              </div>

              <div className="cx-modal-footer cx-mono">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText width={14} height={14} /> referencia — página {sustanciaModal.pagina_pdf}
                </span>
                <button
                  className="cx-modal-fav-btn"
                  onClick={() => toggleFavorito(sustanciaModal.id)}
                  style={{
                    borderColor: favoritos.includes(sustanciaModal.id) ? '#7EA243' : '#232B33',
                    color: favoritos.includes(sustanciaModal.id) ? '#7EA243' : '#94a3b8',
                    background: favoritos.includes(sustanciaModal.id) ? 'rgba(126,162,67,0.1)' : '#12171D',
                  }}
                >
                  <Bookmark width={14} height={14} fill={favoritos.includes(sustanciaModal.id) ? '#7EA243' : 'none'} />
                  {favoritos.includes(sustanciaModal.id) ? 'guardado' : 'guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}