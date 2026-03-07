export const htmlLogin = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CFLink 后台登录</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <style>
    :root{color-scheme:light dark;--bg:#edf4ff;--bg2:#f8fbff;--surface:rgba(255,255,255,.86);--border:rgba(148,163,184,.28);--text:#0f172a;--sub:#64748b;--primary:#2563eb;--primary2:#4f46e5;--danger:#dc2626;--shadow:0 28px 70px rgba(15,23,42,.14)}
    @media (prefers-color-scheme:dark){:root{--bg:#020617;--bg2:#0b1120;--surface:rgba(15,23,42,.84);--border:rgba(71,85,105,.4);--text:#e2e8f0;--sub:#94a3b8;--shadow:0 34px 80px rgba(2,6,23,.55)}}
    @media (prefers-color-scheme:dark){input{background-color:rgba(15,23,42,.96)!important;background:rgba(15,23,42,.96)!important;color:var(--text)!important;border-color:rgba(100,116,139,.54);color-scheme:dark;caret-color:var(--text);-webkit-text-fill-color:var(--text)!important}input::placeholder{color:rgba(148,163,184,.88);-webkit-text-fill-color:rgba(148,163,184,.88);opacity:1}input:focus{border-color:rgba(96,165,250,.88);box-shadow:0 0 0 4px rgba(59,130,246,.18)}input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus{-webkit-text-fill-color:var(--text)!important;box-shadow:0 0 0 1000px rgba(15,23,42,.96) inset;transition:background-color 9999s ease-out 0s}}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:18px;background:radial-gradient(circle at 0% 0%,rgba(59,130,246,.20),transparent 28%),radial-gradient(circle at 100% 10%,rgba(79,70,229,.16),transparent 24%),linear-gradient(180deg,var(--bg),var(--bg2));color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
    .card{width:100%;max-width:440px;padding:28px 24px;border-radius:28px;border:1px solid var(--border);background:var(--surface);box-shadow:var(--shadow);backdrop-filter:blur(20px) saturate(145%);-webkit-backdrop-filter:blur(20px) saturate(145%)}
    .eyebrow{display:inline-flex;padding:7px 12px;border-radius:999px;border:1px solid rgba(37,99,235,.16);background:rgba(37,99,235,.10);color:var(--primary);font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
    h1{margin:16px 0 8px;font-size:30px;letter-spacing:-.04em}p{margin:0 0 18px;color:var(--sub);font-size:14px;line-height:1.7}label{display:block;margin-bottom:8px;font-size:13px;font-weight:700;color:var(--sub)}
    input{width:100%;padding:13px 14px;border-radius:16px;border:1px solid rgba(148,163,184,.4);background-color:rgba(255,255,255,.9);background:rgba(255,255,255,.9);color:inherit;caret-color:var(--text);outline:none;font-size:14px;-webkit-appearance:none;appearance:none}input:focus{border-color:var(--primary);box-shadow:0 0 0 4px rgba(59,130,246,.14)}
    button{width:100%;margin-top:14px;min-height:48px;border:none;border-radius:16px;color:#fff;cursor:pointer;font-size:15px;font-weight:800;background:linear-gradient(90deg,var(--primary),var(--primary2));box-shadow:0 16px 30px rgba(37,99,235,.24)}
    .back-link{display:flex;align-items:center;justify-content:center;width:100%;margin-top:10px;min-height:46px;border-radius:16px;border:1px solid var(--border);background:rgba(148,163,184,.08);color:var(--text);font-size:14px;font-weight:700;text-decoration:none}
    .error{min-height:20px;margin-top:12px;color:var(--danger);font-size:13px}
  </style>
</head>
<body>
  <main class="card">
    <div class="eyebrow">CFLink Admin</div>
    <h1>后台登录</h1>
    <p>输入管理员密码后进入后台。登录成功后会写入安全会话 Cookie。</p>
    <label for="pass">管理员密码</label>
    <input id="pass" type="password" placeholder="请输入后台密码" autocomplete="current-password" />
    <button id="loginBtn" type="button" onclick="login()">登录</button>
    <a class="back-link" href="/">返回首页</a>
    <div id="error" class="error"></div>
  </main>
  <script>
    async function login(){const pass=document.getElementById('pass').value;const btn=document.getElementById('loginBtn');const error=document.getElementById('error');if(error)error.textContent='';if(!pass){if(error)error.textContent='请输入密码';return;}if(btn)btn.disabled=true;try{const res=await fetch(location.pathname+'/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:pass})});if(!res.ok){if(error)error.textContent='密码错误';return;}location.href=location.pathname;}catch(e){if(error)error.textContent='登录失败，请稍后重试。';}finally{if(btn)btn.disabled=false;}}
    document.getElementById('pass').addEventListener('keydown',e=>{if(e.key==='Enter')login();});
  </script>
</body>
</html>`;

export const htmlAdmin = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CFLink 管理后台</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <style>
    :root{color-scheme:light dark;--bg:#edf4ff;--bg2:#f8fbff;--surface:rgba(255,255,255,.88);--surface2:rgba(255,255,255,.95);--border:rgba(148,163,184,.2);--border2:rgba(148,163,184,.34);--text:#0f172a;--sub:#475569;--muted:#64748b;--primary:#2563eb;--primary2:#4f46e5;--danger:#dc2626;--shadow:0 24px 60px rgba(15,23,42,.10);--shadow2:0 14px 32px rgba(15,23,42,.08)}
    @media (prefers-color-scheme:dark){:root{--bg:#020617;--bg2:#0b1120;--surface:rgba(15,23,42,.84);--surface2:rgba(15,23,42,.94);--border:rgba(71,85,105,.34);--border2:rgba(100,116,139,.48);--text:#e2e8f0;--sub:#cbd5e1;--muted:#94a3b8;--shadow:0 28px 72px rgba(2,6,23,.48);--shadow2:0 18px 36px rgba(2,6,23,.38)}.summary-card{background:rgba(15,23,42,.68)!important;border-color:rgba(100,116,139,.30)!important}.segmented{background:rgba(15,23,42,.58)!important;border-color:rgba(71,85,105,.40)!important}.seg-btn{background:rgba(15,23,42,.02)!important;color:rgba(203,213,225,.92)!important;-webkit-text-fill-color:rgba(203,213,225,.92)!important}.seg-btn.active{color:#fff!important;-webkit-text-fill-color:#fff!important}.search-box,.control-row{background:rgba(15,23,42,.60)!important;border-color:rgba(71,85,105,.40)!important}.search-box input,select,input[type="number"]{background-color:rgba(15,23,42,.96)!important;background:rgba(15,23,42,.96)!important;color:var(--text)!important;border-color:rgba(100,116,139,.54)!important;color-scheme:dark;caret-color:var(--text);-webkit-text-fill-color:var(--text)!important}.search-box input::placeholder,input[type="number"]::placeholder{color:rgba(148,163,184,.88);-webkit-text-fill-color:rgba(148,163,184,.88);opacity:1}.search-box input:focus,select:focus,input[type="number"]:focus{border-color:rgba(96,165,250,.88)!important;box-shadow:0 0 0 4px rgba(59,130,246,.18)}.search-box input:-webkit-autofill,.search-box input:-webkit-autofill:hover,.search-box input:-webkit-autofill:focus,input[type="number"]:-webkit-autofill,input[type="number"]:-webkit-autofill:hover,input[type="number"]:-webkit-autofill:focus{-webkit-text-fill-color:var(--text)!important;box-shadow:0 0 0 1000px rgba(15,23,42,.96) inset;transition:background-color 9999s ease-out 0s}.btn-ghost{background:rgba(15,23,42,.72)!important;color:rgba(226,232,240,.96)!important;border-color:rgba(100,116,139,.34)!important;-webkit-text-fill-color:rgba(226,232,240,.96)!important}.empty{background:rgba(15,23,42,.50)!important;border-color:rgba(100,116,139,.34)!important;color:rgba(203,213,225,.92)!important}.item{background:rgba(15,23,42,.94)!important;border-color:rgba(71,85,105,.34)!important}.preview{background:rgba(15,23,42,.68)!important;border-color:rgba(100,116,139,.30)!important}.meta-line,.summary-label,.item-time,.preview-meta{color:rgba(148,163,184,.92)!important}}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;padding:12px;background:radial-gradient(circle at 0% 0%,rgba(59,130,246,.18),transparent 28%),radial-gradient(circle at 100% 10%,rgba(79,70,229,.14),transparent 24%),linear-gradient(180deg,var(--bg),var(--bg2));color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
    button,input,select,a{font:inherit}.page{max-width:980px;margin:0 auto}.topbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;padding:4px 2px}.brand{display:flex;align-items:center;gap:10px}.brand-mark{width:36px;height:36px;border-radius:12px;position:relative;overflow:hidden;flex:0 0 auto;background:linear-gradient(135deg,#2563eb,#4f46e5);box-shadow:0 14px 26px rgba(37,99,235,.22);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:900;letter-spacing:-.06em}.brand-mark:before{content:"CF";position:relative;z-index:1}.brand-mark:after{content:"";position:absolute;inset:1px;border-radius:11px;background:linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,.03));mix-blend-mode:screen;pointer-events:none}.brand-name{font-size:17px;font-weight:800;letter-spacing:-.03em}.brand-sub{color:var(--muted);font-size:12px;margin-top:2px}.top-actions{display:flex;gap:8px}
    .panel{border:1px solid var(--border);background:var(--surface);border-radius:24px;box-shadow:var(--shadow);backdrop-filter:blur(18px) saturate(145%);-webkit-backdrop-filter:blur(18px) saturate(145%);padding:16px;margin-bottom:12px}
    .eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;margin-bottom:10px;border:1px solid rgba(37,99,235,.16);background:rgba(37,99,235,.10);color:var(--primary);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}h1{margin:0 0 6px;font-size:clamp(24px,6vw,32px);letter-spacing:-.05em}.hero-desc{margin:0;color:var(--sub);font-size:13px;line-height:1.7}
    .summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.summary-card{padding:12px 13px;border-radius:16px;border:1px solid var(--border);background:rgba(255,255,255,.48)}.summary-label{color:var(--muted);font-size:11px;margin-bottom:5px}.summary-value{font-size:22px;font-weight:800;letter-spacing:-.04em}
    .filters{display:grid;gap:10px}.segmented{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:5px;border-radius:16px;border:1px solid var(--border);background:rgba(148,163,184,.08)}.seg-btn{min-height:38px;border-radius:12px;border:none;background:transparent;color:var(--sub);cursor:pointer;font-size:13px;font-weight:800}.seg-btn.active{color:#fff;background:linear-gradient(90deg,var(--primary),var(--primary2));box-shadow:0 10px 20px rgba(37,99,235,.18)}
    .search-box{display:grid;gap:10px;padding:10px;border:1px solid var(--border);border-radius:18px;background:rgba(255,255,255,.42)}.search-box input{width:100%;min-width:0;height:44px;border-radius:12px;border:1px solid var(--border2);background-color:rgba(255,255,255,.9);background:rgba(255,255,255,.9);color:var(--text);caret-color:var(--text);outline:none;padding:0 13px;-webkit-appearance:none;appearance:none}.search-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.search-actions .btn{width:100%}
    .control-row{display:grid;gap:10px;padding:10px 12px;border-radius:18px;border:1px solid var(--border);background:rgba(255,255,255,.36)}.group{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.group-sort{justify-content:space-between}.group-sort select{min-width:140px;flex:0 0 auto}.group-pager{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.group-pager .btn,.group-pager input{width:100%}.label{color:var(--sub);font-size:12px;font-weight:700}select,input[type="number"]{height:40px;padding:0 12px;border-radius:12px;border:1px solid var(--border2);background-color:rgba(255,255,255,.88);background:rgba(255,255,255,.88);color:var(--text);caret-color:var(--text);outline:none;-webkit-appearance:none;appearance:none}input[type="number"]{min-width:0}.search-box input:focus,select:focus,input[type="number"]:focus{border-color:var(--primary);box-shadow:0 0 0 4px rgba(59,130,246,.14)}
    .meta-line{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;color:var(--muted);font-size:12px;margin:2px 2px 0}.list{display:grid;gap:10px}.item{border:1px solid var(--border);border-radius:18px;background:var(--surface2);box-shadow:var(--shadow2);padding:14px}.item-top{display:flex;align-items:start;justify-content:space-between;gap:10px}.item-key{font-size:17px;font-weight:800;letter-spacing:-.03em;word-break:break-all}.item-time{margin-top:5px;color:var(--muted);font-size:12px}.tag{display:inline-flex;align-items:center;justify-content:center;min-height:28px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:800;border:1px solid transparent;white-space:nowrap}.tag-url{color:#1d4ed8;background:rgba(37,99,235,.10);border-color:rgba(37,99,235,.18)}.tag-text{color:#7c3aed;background:rgba(124,58,237,.10);border-color:rgba(124,58,237,.18)}.tag-file{color:#15803d;background:rgba(22,163,74,.10);border-color:rgba(22,163,74,.18)}
    .preview{margin-top:12px;padding:12px 13px;border-radius:14px;border:1px solid var(--border);background:rgba(148,163,184,.07);color:var(--text);font-size:14px;line-height:1.72;word-break:break-word}.preview-title{font-weight:800;margin-bottom:7px}.preview a{color:var(--primary);text-decoration:none}.preview-meta{margin-top:8px;color:var(--muted);font-size:12px}.item-actions{display:flex;gap:8px;margin-top:12px}.item-actions .btn,.item-actions a.btn{flex:1;display:inline-flex;align-items:center;justify-content:center;text-decoration:none}.empty{text-align:center;color:var(--sub);padding:24px 12px;border-radius:18px;border:1px dashed var(--border2);background:rgba(255,255,255,.24)}
    .btn{min-height:40px;padding:0 14px;border-radius:12px;border:none;cursor:pointer;font-size:13px;font-weight:800}.btn-primary{color:#fff;background:linear-gradient(90deg,var(--primary),var(--primary2));box-shadow:0 12px 24px rgba(37,99,235,.20)}.btn-ghost{color:var(--text);background:rgba(148,163,184,.08);border:1px solid var(--border)}.btn-danger{color:var(--danger);background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.18)}.btn:disabled{opacity:.6;cursor:default;box-shadow:none}
    @media (min-width:840px){body{padding:22px}.panel{padding:18px}.search-box{grid-template-columns:minmax(0,1fr) auto;align-items:center}.search-actions{display:flex;grid-template-columns:none}.control-row{grid-template-columns:minmax(180px,240px) minmax(0,1fr);align-items:center}.group-sort{justify-content:flex-start}.group-pager{grid-template-columns:repeat(4,minmax(0,1fr))}}
    @media (max-width:640px){.top-actions .btn{min-width:0;padding:0 12px}.seg-btn{font-size:12px}.item-top{flex-direction:column}.group{width:100%}.group-sort{display:grid;grid-template-columns:1fr;gap:8px}.group-sort select{width:100%}.group-pager{grid-template-columns:1fr 1fr}.group-pager .btn,.group-pager input{min-height:40px}}
  </style>
</head>
<body>
  <div class="page">
    <header class="topbar">
      <div class="brand"><div class="brand-mark"></div><div><div class="brand-name">CFLink</div><div class="brand-sub">内容管理</div></div></div>
      <div class="top-actions"><button class="btn btn-ghost" onclick="reload()">刷新</button><button class="btn btn-ghost" onclick="logout()">退出</button></div>
    </header>

    <section class="panel">
      <div class="eyebrow">Manage Share Content</div>
      <h1>内容管理</h1>
      <p class="hero-desc">统一查看链接、文本和文件，支持分类筛选、搜索、排序与分页。</p>
      <div class="summary"><div class="summary-card"><div class="summary-label">当前分类</div><div class="summary-value" id="statType">全部</div></div><div class="summary-card"><div class="summary-label">结果数量</div><div class="summary-value" id="statTotal">0</div></div></div>
    </section>

    <section class="panel filters">
      <div class="segmented">
        <button class="seg-btn active" data-type="all" onclick="setType('all', this)">全部</button>
        <button class="seg-btn" data-type="url" onclick="setType('url', this)">链接</button>
        <button class="seg-btn" data-type="text" onclick="setType('text', this)">文本</button>
        <button class="seg-btn" data-type="file" onclick="setType('file', this)">文件</button>
      </div>
      <div class="search-box">
        <input id="searchInput" type="text" placeholder="搜索后缀、标题、链接或文本内容" onkeydown="onSearchKey(event)" />
        <div class="search-actions"><button class="btn btn-primary" onclick="applySearch()">搜索</button><button class="btn btn-ghost" onclick="clearSearch()">清除</button></div>
      </div>
      <div class="control-row">
        <div class="group group-sort"><span class="label">排序</span><select id="sortSelect" onchange="onSortChange()"><option value="name">按后缀</option><option value="time">按时间</option></select></div>
        <div class="group group-pager"><button class="btn btn-ghost" onclick="prevPage()">上一页</button><button class="btn btn-ghost" onclick="nextPage()">下一页</button><input id="jumpInput" type="number" min="1" placeholder="页码" /><button class="btn btn-ghost" onclick="jumpPage()">跳转</button></div>
      </div>
      <div class="meta-line"><div id="pageInfo">第 1 / 1 页</div><div id="resultInfo">共 0 条</div></div>
      <div id="linkContent"></div>
    </section>
  </div>

  <script>
    let base=location.pathname||'';while(base.length>1&&base.endsWith('/'))base=base.slice(0,-1);const apiBase=base+'/api';
    const state={page:1,size:10,sort:'name',q:'',type:'all',total:0,totalPages:1,loading:false};
    function escapeHtml(input){return String(input??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');}
    function pad2(n){return String(n).padStart(2,'0');}
    function formatTime(ms){ms=Number.isFinite(ms)?ms:0;if(ms===0)return '1970-01-01 00:00:00';const d=new Date(ms);return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())+' '+pad2(d.getHours())+':'+pad2(d.getMinutes())+':'+pad2(d.getSeconds());}
    function formatBytes(v){v=Number(v)||0;if(v<1024)return v+' B';if(v<1024*1024)return (v/1024).toFixed(1)+' KB';if(v<1024*1024*1024)return (v/(1024*1024)).toFixed(1)+' MB';return (v/(1024*1024*1024)).toFixed(1)+' GB';}
    function typeLabel(t){return t==='url'?'链接':(t==='text'?'文本':(t==='file'?'文件':'全部'));}
    function typeClass(t){return t==='url'?'tag-url':(t==='text'?'tag-text':'tag-file');}
    function setSummary(){const pageInfo=document.getElementById('pageInfo');const resultInfo=document.getElementById('resultInfo');const statType=document.getElementById('statType');const statTotal=document.getElementById('statTotal');if(pageInfo)pageInfo.textContent='第 '+state.page+' / '+state.totalPages+' 页';if(resultInfo)resultInfo.textContent='共 '+state.total+' 条';if(statType)statType.textContent=typeLabel(state.type);if(statTotal)statTotal.textContent=String(state.total);}
    function renderEmpty(msg){document.getElementById('linkContent').innerHTML='<div class="empty">'+escapeHtml(msg||'暂无数据')+'</div>';setSummary();}
    function buildPreview(item){const title=String(item.title||'');const value=String(item.value||'');if(item.type==='url'){return '<div class="preview"><a href="'+escapeHtml(value)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(value)+'</a></div>';}if(item.type==='file'){const name=escapeHtml(item.filename||value||'download');const meta=[item.contentType||'application/octet-stream',formatBytes(item.size||0)].join(' · ');const titleHtml=title?'<div class="preview-title">'+escapeHtml(title)+'</div>':'';return '<div class="preview">'+titleHtml+'<div><a href="/'+encodeURIComponent(item.name)+'" target="_blank" rel="noopener noreferrer">'+name+'</a></div><div class="preview-meta">'+escapeHtml(meta)+'</div></div>';}const text=value.length>180?value.slice(0,180)+'…':value;const titleHtml=title?'<div class="preview-title">'+escapeHtml(title)+'</div>':'';return '<div class="preview">'+titleHtml+(text?escapeHtml(text).split(String.fromCharCode(10)).join('<br>'):'<span style="color:var(--muted);">（空）</span>')+'</div>';}
    function renderCards(items){const html=items.map(item=>{const key=escapeHtml(item.name);const created=escapeHtml(formatTime(Number(item.createdAt)));const type=typeLabel(item.type);const openHref='/'+encodeURIComponent(item.name);return '<article class="item"><div class="item-top"><div><div class="item-key">/'+key+'</div><div class="item-time">创建时间：'+created+'</div></div><span class="tag '+typeClass(item.type)+'">'+type+'</span></div>'+buildPreview(item)+'<div class="item-actions"><a class="btn btn-ghost" href="'+openHref+'" target="_blank" rel="noopener noreferrer">打开</a><button class="btn btn-danger" data-key="'+key+'" onclick="delLink(this.dataset.key, this)">删除</button></div></article>';}).join('');document.getElementById('linkContent').innerHTML='<div class="list">'+html+'</div>';setSummary();}
    async function loadPage(page){if(state.loading)return;state.loading=true;const p=Math.max(1,Math.floor(Number(page)||1));renderEmpty('加载中...');const sortSelect=document.getElementById('sortSelect');if(sortSelect&&sortSelect.value!==state.sort)sortSelect.value=state.sort;try{const qs=new URLSearchParams({page:String(p),size:String(state.size),sort:state.sort,type:state.type});if(state.q)qs.set('q',String(state.q));const res=await fetch(apiBase+'/all?'+qs.toString(),{credentials:'same-origin',cache:'no-store'});if(res.status===401){location.href=base;return;}if(!res.ok){renderEmpty('加载失败');return;}const data=await res.json();state.page=Number(data.page)||p;state.total=Number(data.total)||0;state.totalPages=Math.max(1,Number(data.totalPages)||1);state.type=data.type||state.type;const items=Array.isArray(data.links)?data.links:[];if(!items.length){renderEmpty(state.q?'没有匹配结果':'当前分类下暂无内容');return;}renderCards(items);}catch(e){renderEmpty('加载失败');}finally{state.loading=false;}}
    function reload(){loadPage(state.page);} function onSortChange(){const sel=document.getElementById('sortSelect');state.sort=sel&&sel.value==='time'?'time':'name';state.page=1;loadPage(1);} function setType(type,btn){state.type=type==='url'||type==='text'||type==='file'?type:'all';state.page=1;document.querySelectorAll('.seg-btn').forEach(el=>el.classList.toggle('active',el===btn));loadPage(1);} 
    function normalizeSearchQuery(raw){let q=String(raw??'').trim();if(!q)return '';try{if(q.includes('://')){const u=new URL(q);if(u.host===location.host){const seg=decodeURIComponent((u.pathname||'').split('/')[1]||'');if(seg)q=seg;}}}catch(e){}while(q.startsWith('/'))q=q.slice(1);return q.trim();}
    function applySearch(){const input=document.getElementById('searchInput');const q=normalizeSearchQuery(input?input.value:'');state.q=q;state.page=1;if(input)input.value=q;loadPage(1);} function clearSearch(){const input=document.getElementById('searchInput');if(input)input.value='';state.q='';state.page=1;loadPage(1);} function onSearchKey(ev){if(ev&&ev.key==='Enter')applySearch();}
    function prevPage(){if(state.page<=1)return;loadPage(state.page-1);} function nextPage(){if(state.page>=state.totalPages)return;loadPage(state.page+1);} function jumpPage(){const input=document.getElementById('jumpInput');const v=input?Number(input.value):NaN;if(!Number.isFinite(v)||v<1)return;loadPage(Math.floor(v));}
    async function delLink(name,btn){if(!name)return;if(!confirm('确定删除 /'+name+' 吗？'))return;if(btn){btn.disabled=true;btn.textContent='删除中...';}try{const res=await fetch(apiBase+'/delete/'+encodeURIComponent(name),{credentials:'same-origin',cache:'no-store'});if(res.status===401){location.href=base;return;}if(!res.ok){alert('删除失败');if(btn){btn.disabled=false;btn.textContent='删除';}return;}loadPage(state.page);}catch(e){alert('请求失败，请稍后重试。');if(btn){btn.disabled=false;btn.textContent='删除';}}}
    async function logout(){try{await fetch(base+'/logout',{method:'POST',credentials:'same-origin'});}catch(e){}location.href=base;}
    const jumpInput=document.getElementById('jumpInput');if(jumpInput){jumpInput.addEventListener('keydown',e=>{if(e.key==='Enter')jumpPage();});}
    loadPage(1);
  </script>
</body>
</html>`;
