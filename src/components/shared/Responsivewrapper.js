// frontend/src/components/shared/ResponsiveWrapper.js
// Ye component poori app ko mobile responsive banata hai
// App.js mein import karo aur <Layout> ke andar rakho

import { useEffect } from 'react';

export default function ResponsiveWrapper() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'tb-responsive';
    style.innerHTML = `
      /* ── GLOBAL ── */
      *, *::before, *::after { box-sizing: border-box !important; }
      body { overflow-x: hidden !important; }
      img  { max-width: 100% !important; }
      input, textarea, select { font-size: 16px !important; }

      /* ── NAVBAR ── */
      @media(max-width:900px){
        .dsk{display:none!important}
        .mhb{display:flex!important}
        .mmn{display:block!important}
      }
      @media(min-width:901px){
        .mmn{display:none!important}
        .mhb{display:none!important}
      }

      /* ── HERO ── */
      @media(max-width:768px){
        /* Hero height */
        [class*="hero"],[id*="hero"]{min-height:520px!important}
        
        /* Big fonts */
        h1{font-size:28px!important;line-height:1.2!important}
        h2{font-size:24px!important;line-height:1.2!important}
        
        /* Hide thumbnails */
        [style*="right: 40"]{display:none!important}
        [style*="right:40"]{display:none!important}
      }

      /* ── ALL GRID LAYOUTS → SINGLE COLUMN ON MOBILE ── */
      @media(max-width:640px){
        /* Force single column for all grids */
        [style*="grid-template-columns"]{
          grid-template-columns: 1fr !important;
        }
        /* Exception: 2 col for small cards */
        [style*="minmax(140"]{
          grid-template-columns: repeat(2,1fr) !important;
        }
        [style*="minmax(200"]{
          grid-template-columns: repeat(2,1fr) !important;
        }
      }

      /* ── FLEX ROWS → COLUMN ON MOBILE ── */
      @media(max-width:640px){
        /* Jobs, Companies cards row */
        [style*="display: flex"][style*="flexWrap: wrap"],
        [style*="display:flex"][style*="flexWrap:wrap"]{
          flex-direction: column !important;
        }
        /* Exception: keep horizontal for small items */
        [style*="gap: 8"][style*="display: flex"],
        [style*="gap:8"][style*="display:flex"]{
          flex-direction: row !important;
          flex-wrap: wrap !important;
        }
      }

      /* ── DASHBOARD TWO COLUMN → STACK ── */
      @media(max-width:900px){
        /* Sidebar hide in chatbot */
        [style*="width: 260"]{display:none!important}
        [style*="width:260"]{display:none!important}
      }
      @media(max-width:640px){
        /* Profile section center */
        [style*="marginTop: -60"]{
          margin-top:-40px!important;
        }
        /* Cover photo smaller */
        [style*="height: 220"]{height:130px!important}
        [style*="height:220"]{height:130px!important}
        /* Stats 2 col */
        [style*="minmax(200px,1fr)"]{
          grid-template-columns:1fr 1fr!important
        }
      }

      /* ── SECTION PADDING ── */
      @media(max-width:768px){
        [style*="padding: 64px 24px"]{padding:36px 14px!important}
        [style*="padding: 72px 24px"]{padding:40px 14px!important}
        [style*="padding: 80px 24px"]{padding:44px 14px!important}
        [style*="padding: 88px 24px"]{padding:48px 14px!important}
        [style*="padding: 56px 24px"]{padding:32px 14px!important}
        [style*="padding: 48px 24px"]{padding:28px 14px!important}
        [style*="padding: 0 24px"]{padding:0 14px!important}
        [style*="padding: 24px"]{padding:14px!important}
      }

      /* ── MAX WIDTH SECTIONS ── */
      @media(max-width:768px){
        [style*="maxWidth: 1200"]{padding-left:14px!important;padding-right:14px!important}
        [style*="maxWidth:1200"]{padding-left:14px!important;padding-right:14px!important}
        [style*="maxWidth: 1280"]{padding-left:14px!important;padding-right:14px!important}
      }

      /* ── MODAL FULL WIDTH ── */
      @media(max-width:500px){
        [style*="maxWidth: 460"]{
          max-width:calc(100vw - 20px)!important;
          margin:0 10px!important;
          border-radius:16px!important;
        }
        [style*="maxWidth: 900"]{
          max-width:100%!important;
          padding:0 14px!important;
        }
      }

      /* ── OFFER POPUP ── */
      @media(max-width:500px){
        [style*="bottom: 24"][style*="right: 24"][style*="width: 290"]{
          bottom:10px!important;
          right:10px!important;
          left:10px!important;
          width:auto!important;
        }
      }

      /* ── FOOTER ── */
      @media(max-width:768px){
        [style*="padding: 56px 24px 40px"]{
          flex-direction:column!important;
          padding:28px 14px 20px!important;
        }
        [style*="width: 240"][style*="flexShrink: 0"]{
          width:100%!important;
        }
        /* Footer link grid */
        [style*="gap: 32px 24px"]{
          grid-template-columns:1fr 1fr!important;
          gap:20px 12px!important;
        }
      }

      /* ── PRICING ── */
      @media(max-width:768px){
        [style*="minmax(280px,1fr)"]{
          grid-template-columns:1fr!important;
        }
        [style*="fontSize: 44"][style*="fontWeight: 800"]{
          font-size:28px!important;
        }
      }

      /* ── TOUCH TARGETS ── */
      @media(max-width:768px){
        button,a{
          min-height:42px;
          -webkit-tap-highlight-color:transparent;
        }
      }

      /* ── SAFE AREA (iPhone) ── */
      @supports(padding:max(0px)){
        nav{padding-top:env(safe-area-inset-top)}
        body{padding-bottom:env(safe-area-inset-bottom)}
      }

      /* ── JOBS & COMPANIES PAGE SPECIFIC ── */
      @media(max-width:768px){
        /* Job cards grid */
        [style*="minmax(300px"]{
          grid-template-columns:1fr!important;
        }
        [style*="minmax(280px"]{
          grid-template-columns:1fr!important;
        }
        /* Search filters sidebar */
        [style*="width: 280"][style*="flexShrink"]{
          display:none!important;
        }
        [style*="width:280"][style*="flexShrink"]{
          display:none!important;
        }
        /* Company cards */
        [style*="minmax(260px"]{
          grid-template-columns:1fr!important;
        }
        [style*="minmax(240px"]{
          grid-template-columns:1fr!important;
        }
      }

      /* ── TICKER ── */
      @media(max-width:600px){
        [style*="animation: ticker"],[style*="animation:ticker"]{
          animation-duration:15s!important;
        }
      }

      /* ── STATS BAR ── */
      @media(max-width:600px){
        [style*="justifyContent: center"][style*="gap: 0"]{
          display:grid!important;
          grid-template-columns:1fr 1fr!important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById('tb-responsive');
      if (el) el.remove();
    };
  }, []);

  return null;
}