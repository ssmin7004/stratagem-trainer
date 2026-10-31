import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, AudioLines, Check,
  ChevronRight, Crosshair, Gauge, Keyboard, ListChecks, Medal, Pause,
  Play, RotateCcw, Settings, Shield, SkipForward, Sparkles, Trophy, Volume2,
  VolumeX, X, Zap
} from "lucide-react";
import { arrow, categories, keyFor, stratagems, type Direction, type Stratagem } from "./data";

type Page = "home" | "training" | "loadout" | "records" | "settings";
type Mode = "practice" | "challenge";
type GameState = "idle" | "countdown" | "playing" | "paused" | "result" | "finished";
type Theme = "earth" | "olive" | "crimson" | "arctic";
type RecordItem = {
  stratagemId: string; bestTime: number; bestAccuracy: number; bestErrorCount: number;
  attempts: number; totalClears: number;
  totalTimeMs?: number; totalAccuracySum?: number; aggregateAttempts?: number;
};

const STORAGE_KEY = "stratagem-trainer-v1";
const themeNames: Record<Theme,string> = { earth:"SUPER EARTH", olive:"MILITARY OLIVE", crimson:"CRIMSON ALERT", arctic:"ARCTIC SUPPORT" };
const keyGlyph: Record<Direction, string> = { UP:"W", DOWN:"S", LEFT:"A", RIGHT:"D" };
const initialSettings = { theme:"earth" as Theme, soundEnabled:false, animationEnabled:true };

function readSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function IconArrow({ dir, size=22 }: {dir:Direction; size?:number}) {
  const props = { size, strokeWidth:2.5 };
  if (dir==="UP") return <ArrowUp {...props}/>;
  if (dir==="DOWN") return <ArrowDown {...props}/>;
  if (dir==="LEFT") return <ArrowLeft {...props}/>;
  return <ArrowRight {...props}/>;
}
function formatTime(ms: number | null) {
  if (ms === null || !Number.isFinite(ms)) return "--.--";
  return (ms/1000).toFixed(2);
}
function App() {
  const saved = useMemo(readSaved, []);
  const [page,setPage] = useState<Page>("home");
  const [mode,setMode] = useState<Mode>("practice");
  const [theme,setTheme] = useState<Theme>(saved.settings?.theme || "earth");
  const [soundEnabled,setSoundEnabled] = useState<boolean>(saved.settings?.soundEnabled ?? false);
  const [animationEnabled,setAnimationEnabled] = useState<boolean>(saved.settings?.animationEnabled ?? true);
  const [selected,setSelected] = useState<string[]>(saved.selectedStratagems || stratagems.map(s=>s.id));
  const [trainingCount,setTrainingCount] = useState<number>(saved.trainingCount || 10);
  const [countDraft,setCountDraft] = useState<string>(String(saved.trainingCount || 10));
  const [countDraftMessage,setCountDraftMessage] = useState("");
  const [records,setRecords] = useState<Record<string,RecordItem>>(saved.records || {});
  const [search,setSearch] = useState("");
  const [categoryFilter,setCategoryFilter] = useState("ALL");
  const [sort,setSort] = useState<"name"|"time">("name");
  const [activeId,setActiveId] = useState(stratagems[0].id);
  const [gameState,setGameState] = useState<GameState>("idle");
  const [sequenceIndex,setSequenceIndex] = useState(0);
  const [errors,setErrors] = useState(0);
  const [totalInputs,setTotalInputs] = useState(0);
  const [startedAt,setStartedAt] = useState<number|null>(null);
  const [elapsed,setElapsed] = useState(0);
  const [countdown,setCountdown] = useState(3);
  const [roundList,setRoundList] = useState<string[]>([]);
  const [roundIndex,setRoundIndex] = useState(0);
  const [roundTimes,setRoundTimes] = useState<{id:string;time:number;errors:number;inputs:number}[]>([]);
  const [lastResult,setLastResult] = useState<{time:number;errors:number;inputs:number;id:string;newRecord:boolean}|null>(null);
  const [notice,setNotice] = useState("");
  const countdownTimer = useRef<number|undefined>(undefined);
  const startTimeRef = useRef<number|null>(null);
  const sessionStartedRef = useRef<number|null>(null);
  const pausedAtRef = useRef<number|null>(null);
  const activeStratagem = stratagems.find(s=>s.id===activeId) || stratagems[0];
  const available = stratagems.filter(s=>selected.includes(s.id));
  const accuracy = totalInputs ? Math.max(0,((totalInputs-errors)/totalInputs)*100) : 100;
  const aggregateRows = stratagems.map(s => {
    const r = records[s.id];
    const attempts = r?.aggregateAttempts || 0;
    return { stratagem:s, attempts, averageTime:attempts ? (r?.totalTimeMs || 0)/attempts : null,
      averageAccuracy:attempts ? (r?.totalAccuracySum || 0)/attempts : null };
  });
  const aggregateAttempts = aggregateRows.reduce((sum,row)=>sum+row.attempts,0);
  const averageReactionTime = aggregateAttempts
    ? aggregateRows.reduce((sum,row)=>sum+(row.averageTime || 0)*row.attempts,0)/aggregateAttempts : null;
  const averageOverallAccuracy = aggregateAttempts
    ? aggregateRows.reduce((sum,row)=>sum+(row.averageAccuracy || 0)*row.attempts,0)/aggregateAttempts : null;
  const fastestStratagems = [...aggregateRows].filter(row=>row.attempts>0 && row.averageTime!==null)
    .sort((a,b)=>(a.averageTime??Infinity)-(b.averageTime??Infinity)).slice(0,2);
  const sessionAverageTime = roundTimes.length ? roundTimes.reduce((sum,item)=>sum+item.time,0)/roundTimes.length : 0;
  const confirmCustomCount = () => {
    const parsed = Number(countDraft.trim());
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > stratagems.length) {
      setCountDraftMessage(`1부터 ${stratagems.length} 사이의 정수를 입력해 주세요.`); return;
    }
    setTrainingCount(parsed); setCountDraft(String(parsed));
    setCountDraftMessage(selected.length < parsed
      ? `현재 선택된 ${selected.length}개보다 많습니다. 훈련 목록에서 ${parsed}개 이상 선택해 주세요.`
      : `${parsed}개로 설정했습니다.`);
  };

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      settings:{theme,soundEnabled,animationEnabled}, selectedStratagems:selected, trainingCount, records
    }));
  },[theme,soundEnabled,animationEnabled,selected,trainingCount,records]);

  useEffect(()=>{
    if (gameState!=="playing" || startedAt===null) return;
    const tick=()=>setElapsed(performance.now()-(sessionStartedRef.current ?? startedAt));
    tick();
    const id=window.setInterval(tick,40);
    return ()=>window.clearInterval(id);
  },[gameState,startedAt]);

  const clearCountdown = () => {
    if (countdownTimer.current) window.clearInterval(countdownTimer.current);
    countdownTimer.current=undefined;
  };
  useEffect(()=>()=>clearCountdown(),[]);
  const beginRun = useCallback((ids:string[], selectedMode:Mode)=>{
    const targetCount = selectedMode === "practice" ? trainingCount : 20;
    if (ids.length < targetCount) {
      setNotice(`훈련 ${targetCount}개를 진행하려면 스트라타젬을 ${targetCount}개 이상 선택해야 합니다.`);
      setPage("loadout");
      return;
    }
    const shuffled=[...ids];
    for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    const list=shuffled.slice(0,targetCount);
    setMode(selectedMode); setRoundList(list); setRoundIndex(0); setRoundTimes([]);
    setActiveId(list[0]); setSequenceIndex(0); setErrors(0); setTotalInputs(0);
    setElapsed(0); setStartedAt(null); startTimeRef.current=null; sessionStartedRef.current=null; pausedAtRef.current=null; setLastResult(null);
    setCountdown(3); setGameState("countdown"); setPage("training");
    clearCountdown();
    let n=3;
    countdownTimer.current=window.setInterval(()=>{
      n-=1; setCountdown(n);
      if(n<=0){clearCountdown();const now=performance.now();startTimeRef.current=now;sessionStartedRef.current=now;setStartedAt(now);setGameState("playing");}
    },750);
  },[trainingCount]);
  const updateRecord = useCallback((id:string,time:number,err:number,inputs:number)=>{
    const acc=inputs?Math.max(0,((inputs-err)/inputs)*100):100;
    setRecords(prev=>{
      const old=prev[id];
      const better=!old || time<old.bestTime;
      return {...prev,[id]:{
        stratagemId:id,bestTime:better?time:old.bestTime,
        bestAccuracy:better?acc:old.bestAccuracy,
        bestErrorCount:better?err:old.bestErrorCount,
        attempts:(old?.attempts||0)+1,totalClears:(old?.totalClears||0)+1,
        totalTimeMs:(old?.totalTimeMs||0)+time,
        totalAccuracySum:(old?.totalAccuracySum||0)+acc,
        aggregateAttempts:(old?.aggregateAttempts||0)+1
      }};
    });
    return !records[id] || time<records[id].bestTime;
  },[records]);
  const completeStratagem = useCallback((finalInputCount:number)=>{
    const now=performance.now();
    const time=startTimeRef.current===null?0:now-startTimeRef.current;
    const id=activeId;
    const currentErrors=errors;
    const currentInputs=finalInputCount;
    const newRecord=updateRecord(id,time,currentErrors,currentInputs);
    const item={id,time,errors:currentErrors,inputs:currentInputs};
    const nextTimes=[...roundTimes,item];
    setRoundTimes(nextTimes);
    setLastResult({time,errors:currentErrors,inputs:currentInputs,id,newRecord});
    if(roundIndex+1>=roundList.length){
      setElapsed(sessionStartedRef.current===null?time:now-sessionStartedRef.current);
      setGameState("finished");
      return;
    }
    const nextIndex=roundIndex+1;
    setRoundIndex(nextIndex);setActiveId(roundList[nextIndex]);
    setSequenceIndex(0);setErrors(0);setTotalInputs(0);
    startTimeRef.current=performance.now();setStartedAt(startTimeRef.current);
  },[activeId,errors,totalInputs,updateRecord,roundTimes,mode,roundIndex,roundList]);
  const handleDirection = useCallback((dir:Direction)=>{
    if(gameState!=="playing") return;
    setTotalInputs(v=>v+1);
    if(activeStratagem.sequence[sequenceIndex]===dir){
      if(sequenceIndex+1>=activeStratagem.sequence.length){completeStratagem(totalInputs+1);}
      else setSequenceIndex(v=>v+1);
    } else {
      setErrors(v=>v+1);setSequenceIndex(0);
    }
  },[gameState,activeStratagem,sequenceIndex,completeStratagem]);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      const target=e.target as HTMLElement|null;
      if(target && (["INPUT","TEXTAREA","SELECT"].includes(target.tagName)||target.isContentEditable)) return;
      const dir=keyFor[e.key.toLowerCase()];
      if(!dir) {
        if(e.code==="Space" && page==="training" && gameState==="idle"){e.preventDefault();beginRun(available.map(s=>s.id),mode);}
        return;
      }
      e.preventDefault();
      if(gameState==="playing") handleDirection(dir);
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[page,gameState,handleDirection,beginRun,mode,activeId,available]);

  const pause=()=>{
    if(gameState==="playing"){
      const now=performance.now();
      setElapsed(now-(sessionStartedRef.current??startTimeRef.current??now));
      pausedAtRef.current=now;
      setGameState("paused");
    } else if(gameState==="paused"){
      const now=performance.now();
      const pauseDuration=pausedAtRef.current===null?0:now-pausedAtRef.current;
      if(sessionStartedRef.current!==null) sessionStartedRef.current+=pauseDuration;
      if(startTimeRef.current!==null) startTimeRef.current+=pauseDuration;
      pausedAtRef.current=null;
      setStartedAt(startTimeRef.current);
      setGameState("playing");
    }
  };
  const restart=()=>beginRun(available.map(s=>s.id),mode);
  const filtered = stratagems.filter(s=>
    (categoryFilter==="ALL"||s.category===categoryFilter) &&
    (s.name.toLowerCase().includes(search.toLowerCase())||s.category.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):((records[a.id]?.bestTime??Infinity)-(records[b.id]?.bestTime??Infinity)));
  const toggleSelected=(id:string)=>setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const navItems:[Page,string,any][]=[
    ["home","작전 본부",Shield],["training","훈련",Crosshair],["loadout","훈련 목록",ListChecks],["records","전적 기록",Trophy],["settings","설정",Settings]
  ];

  return <div className={`app theme-${theme} ${animationEnabled?"motion-on":"motion-off"}`}>
    <div className="scanlines"/>
    <header className="topbar">
      <div className="brand" onClick={()=>setPage("home")} role="button" tabIndex={0}>
        <div className="brand-mark"><Shield size={22}/></div>
        <div><div className="brand-title">STRATAGEM<span> / </span>TRAINER</div><div className="brand-sub">SUPER EARTH TACTICAL TRAINING DIVISION</div></div>
      </div>
      <div className="top-status"><span className="status-dot"/> 시스템 가동 중 <span className="top-divider"/> PC 훈련 버전 <span className="top-divider"/> V2.2.0</div>
    </header>

    <div className="shell">
      <aside className="sidebar">
        <div className="side-label">메인 터미널</div>
        {navItems.map(([id,label,Icon])=><button key={id} className={`nav-button ${page===id?"active":""}`} onClick={()=>{if(gameState==="playing"||gameState==="countdown")setGameState("paused");setPage(id);}}>
          <Icon size={17}/><span>{label}</span>{page===id&&<ChevronRight size={15} className="nav-chevron"/>}
        </button>)}
        <div className="side-spacer"/>
        <div className="sidebar-card">
          <div className="side-label">현재 훈련 목록</div>
          <div className="loadout-count">{selected.length.toString().padStart(2,"0")} <small>/ {stratagems.length}</small></div>
          <div className="mini-progress"><i style={{width:`${selected.length/stratagems.length*100}%`}}/></div>
          <div className="tiny-muted">개 스트라타젬 선택됨</div>
        </div>
        <div className="sidebar-footer"><span className="status-dot"/> MANAGED DEMOCRACY<br/>IS NON-NEGOTIABLE.</div>
      </aside>

      <main className="main-content">
        {page==="home"&&<section className="page home-page">
          <div className="hero-kicker"><span className="kicker-line"/> 슈퍼 어스는 당신의 입력을 기다립니다</div>
          <div className="hero-layout">
            <div className="hero-copy">
              <div className="hero-overline">슈퍼 어스 / 훈련 프로토콜 07</div>
              <h1>호출하라.<br/><em>정확하게 실행하라.</em></h1>
              <p className="hero-desc">스트라타젬 입력 훈련 시뮬레이터. 반응 속도를 단련하고 모든 입력 순서를 숙달하라.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={()=>{setMode("practice");setPage("training");beginRun(available.map(s=>s.id),"practice");}}><Play size={16} fill="currentColor"/> 훈련 시작</button>
                <button className="btn btn-secondary" onClick={()=>setPage("loadout")}><ListChecks size={16}/> 훈련 목록 편성</button>
              </div>
              <div className="hero-meta"><span><Keyboard size={14}/> WASD INPUT</span><span><Activity size={14}/> LIVE TIMING</span><span><Medal size={14}/> 개인 전적</span></div>
            </div>
            <div className="hero-visual">
              <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
              <div className="visual-crosshair"><Crosshair size={180} strokeWidth={0.65}/></div>
              <div className="visual-center"><div className="center-symbol">S</div><div className="center-caption">STRATAGEM<br/>COMMAND</div></div>
              <div className="visual-tag tag-top">SEAF / FIELD SYSTEMS</div><div className="visual-tag tag-bottom">AUTHORIZATION: GRANTED</div>
              <div className="visual-coordinate">38.54° N<br/>SUPEREARTH</div>
            </div>
          </div>
          <div className="home-stats">
            <div className="stat-tile"><span className="stat-label">AVAILABLE STRATAGEMS</span><strong>{stratagems.length.toString().padStart(2,"0")}</strong><small>DATABASE ENTRIES</small></div>
            <div className="stat-tile"><span className="stat-label">LOADOUT SELECTED</span><strong>{selected.length.toString().padStart(2,"0")}</strong><small>READY FOR DEPLOYMENT</small></div>
            <div className="stat-tile"><span className="stat-label">개인 전적</span><strong>{Object.keys(records).length.toString().padStart(2,"0")}</strong><small>STRATAGEMS MASTERED</small></div>
            <div className="stat-tile"><span className="stat-label">TRAINING STATUS</span><strong className="status-ready">READY</strong><small>AWAITING HELLDIVER</small></div>
          </div>
          <div className="section-heading"><div><span className="section-index">01 / SELECT PROTOCOL</span><h2>훈련 프로토콜 선택</h2></div><span className="heading-rule"/></div>
          <div className="mode-cards">
            <button className="mode-card" onClick={()=>{setMode("practice");setPage("loadout");}}>
              <div className="mode-icon"><Crosshair size={24}/></div><div className="mode-tag">기본 훈련</div><h3>기본 훈련 · {trainingCount}개</h3><p>무작위 스트라타젬 {trainingCount}개를 연속으로 호출하고 입력 숙련도를 높인다.</p><span className="mode-link">기본 훈련 설정 <ChevronRight size={15}/></span>
            </button>
            <button className="mode-card" onClick={()=>{setMode("challenge");beginRun(available.map(s=>s.id),"challenge");}}>
              <div className="mode-icon"><Zap size={24}/></div><div className="mode-tag">전투 준비 태세</div><h3>연속 작전</h3><p>무작위 스트라타젬 20개를 연속으로 호출하라.</p><span className="mode-link">연속 작전 시작 <ChevronRight size={15}/></span>
            </button>
          </div>
        </section>}

        {page==="training"&&<section className="page training-page">
          <div className="page-heading"><div><span className="section-index">FIELD SIMULATION / 02</span><h1>TRAINING <em>GROUND</em></h1><p>호출 순서를 정확하게 입력하고 작전 절차를 완료하십시오.</p></div><div className="mode-pill">{mode==="practice"?"기본 훈련":"연속 작전"}</div></div>
          {(gameState==="idle")?<div className="prestart-panel">
            <div className="prestart-icon"><Crosshair size={42}/></div><span className="section-index">시뮬레이션 대기</span><h2>작전 시작 대기 중</h2><p>{mode==="practice"?`선택한 목록에서 무작위 ${trainingCount}개를 연속 훈련합니다.`:"선택한 목록에서 무작위 20개를 연속 훈련합니다."}</p>
            <button className="btn btn-primary" onClick={()=>beginRun(available.map(s=>s.id),mode)}><Play size={16} fill="currentColor"/> 훈련 시작</button>
            <button className="text-button" onClick={()=>setPage("loadout")}> 훈련 목록 편성</button>
          </div>:gameState==="countdown"?<div className="countdown-panel"><span className="section-index">훈련 준비</span><div className="countdown-number">{countdown}</div><h2>호출 준비</h2><p>WASD 입력 대기</p></div> :gameState==="result"||gameState==="finished"?<div className="result-panel completion-panel">
            <div className="completion-layout">
              <section className="completion-report">
                <div className="result-stamp"><Trophy size={28}/></div>
                <span className="section-index">훈련 완료 보고</span>
                <h2>모든 호출 절차를 완료했습니다.</h2>
                <div className="result-time">{formatTime(elapsed)}<small>초</small></div>
                <div className="result-grid">
                  <div><span>완료한 스트라타젬</span><strong>{roundTimes.length} / {roundList.length}</strong></div>
                  <div><span>총 입력 오류</span><strong>{roundTimes.reduce((n,r)=>n+r.errors,0)}</strong></div>
                  <div><span>평균 정확도</span><strong>{Math.round(roundTimes.reduce((n,r)=>n+(r.inputs?((r.inputs-r.errors)/r.inputs)*100:100),0)/Math.max(1,roundTimes.length))}%</strong></div>
                  <div><span>스트라타젬당 평균 입력 시간</span><strong>{formatTime(sessionAverageTime)}초</strong></div>
                </div>
                <div className="session-detail">
                  <div className="session-detail-heading"><span className="section-index">SESSION BREAKDOWN</span><strong>스트라타젬별 호출 기록</strong></div>
                  <div className="session-detail-list">
                    {roundTimes.map((item,index)=>{
                      const stratagem=stratagems.find(s=>s.id===item.id);
                      const itemAccuracy=item.inputs?((item.inputs-item.errors)/item.inputs)*100:100;
                      return <div className="session-detail-row" key={`${item.id}-${index}`}>
                        <span className="session-detail-number">{String(index+1).padStart(2,"0")}</span>
                        <span className="session-detail-name">{stratagem?.name || item.id}</span>
                        <span className="session-detail-time">{formatTime(item.time)}초</span>
                        <span className="session-detail-accuracy">{Math.round(itemAccuracy)}%</span>
                      </div>;
                    })}
                  </div>
                </div>
              </section>
              <aside className="completion-recommendations">
                <div className="completion-setting">
                  <span className="section-index">추천 설정 01</span>
                  <h3>훈련 스트라타젬 개수 설정</h3>
                  <p>다음 기본 훈련에서 출제할 개수를 선택합니다.</p>
                  <div className="count-options">
                    {[10,20,30].map(n=><button key={n} className={trainingCount===n?"chosen":""} onClick={()=>{setTrainingCount(n);setCountDraft(String(n));setCountDraftMessage("");}}>{n}개</button>)}
                  </div>
                  <div className="custom-count-row">
                    <label htmlFor="custom-training-count">직접 입력</label>
                    <input id="custom-training-count" type="number" min="1" max={stratagems.length} inputMode="numeric" value={countDraft} onChange={e=>{setCountDraft(e.target.value);setCountDraftMessage("");}} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();confirmCustomCount();}}} placeholder="개수 입력"/>
                    <button type="button" onClick={confirmCustomCount}>확정</button>
                  </div>
                  <p className="count-input-hint">숫자를 입력한 뒤 Enter 키를 눌러 확정하세요. 최대 {stratagems.length}개까지 설정할 수 있습니다.</p>
                  {countDraftMessage&&<p className="count-input-message">{countDraftMessage}</p>}
                </div>
                <div className="completion-setting">
                  <span className="section-index">추천 설정 02</span>
                  <h3>등장할 스트라타젬 선택</h3>
                  <p>다음 훈련에 포함할 장비 목록을 직접 편성합니다.</p>
                  <div className="selection-summary"><strong>{selected.length} / {stratagems.length}</strong><span>개 선택됨</span></div>
                  <button className="btn btn-secondary full-width" onClick={()=>setPage("loadout")}><ListChecks size={16}/> 스트라타젬 목록 편성</button>
                </div>
              </aside>
            </div>
            {selected.length<trainingCount&&<p className="completion-warning">현재 선택한 스트라타젬은 {selected.length}개입니다. {trainingCount}개 훈련을 시작하려면 목록에서 더 선택해야 합니다.</p>}
            <div className="result-actions"><button className="btn btn-primary" disabled={selected.length<trainingCount} onClick={()=>beginRun(available.map(s=>s.id),"practice")}><RotateCcw size={16}/> 다음 기본 훈련 시작 ({trainingCount}개)</button><button className="btn btn-secondary" onClick={()=>beginRun(available.map(s=>s.id),"challenge")} disabled={selected.length<20}><Zap size={16}/> 20개 연속 작전</button><button className="btn btn-quiet" onClick={()=>setPage("records")}><Trophy size={16}/> 전적 기록</button></div>
          </div>:<div className="game-layout">
            <div className="game-main">
              <div className="game-topline"><span className="live-dot"/> 실시간 시뮬레이션 <span className="game-round">스트라타젬 {roundIndex+1} / {roundList.length}</span><button className="pause-button" onClick={pause}><Pause size={14}/> 일시 정지</button></div>
              <div className="mission-progress" aria-label={`훈련 진행도 ${roundIndex} / ${roundList.length}`}>
                <div className="mission-progress-meta"><span>작전 진행도</span><strong>{roundIndex.toString().padStart(2,"0")} / {roundList.length.toString().padStart(2,"0")}</strong></div>
                <div className="mission-progress-track"><i style={{width:`${roundIndex/Math.max(1,roundList.length)*100}%`}}/></div>
              </div>
              <div className="stratagem-display">
                <div className="display-corner corner-tl"/><div className="display-corner corner-tr"/><div className="display-corner corner-bl"/><div className="display-corner corner-br"/>
                <div className="stratagem-emblem">{activeStratagem.icon}</div><span className="section-index">{activeStratagem.category.toUpperCase()}</span><h2>{activeStratagem.name}</h2><p>{activeStratagem.description}</p>
                <div className="sequence-row">{activeStratagem.sequence.map((dir,i)=><div key={`${activeId}-${i}`} className={`sequence-key ${i<sequenceIndex?"key-done":i===sequenceIndex?"key-current":"key-waiting"}`}><IconArrow dir={dir} size={23}/><small>{keyGlyph[dir]}</small></div>)}</div>
                <div className="sequence-progress"><div><span>입력 순서</span><span>{sequenceIndex} / {activeStratagem.sequence.length}</span></div><div className="progress-track"><i style={{width:`${sequenceIndex/activeStratagem.sequence.length*100}%`}}/></div></div>
              </div>
              <div className="keyboard-hint"><Keyboard size={17}/><span>방향키 입력</span><strong>W</strong><strong>A</strong><strong>S</strong><strong>D</strong><span className="hint-tail">오입력 시 현재 순서 초기화</span></div>
            </div>
            <div className="game-side">
              <div className="metric-card timer-card"><span className="metric-label">경과 시간</span><div className="timer-value">{formatTime(elapsed)}<small>s</small></div><div className="metric-foot"><span className="live-dot"/> 실시간 계측</div></div>
              <div className="metric-card"><span className="metric-label">입력 정확도</span><div className="metric-value">{Math.round(accuracy)}<small>%</small></div><div className="metric-foot">현재 입력 정확도</div></div>
              <div className="metric-card"><span className="metric-label">입력 오류</span><div className="metric-value error-value">{errors.toString().padStart(2,"0")}</div><div className="metric-foot">입력 순서 초기화 횟수</div></div>
              <div className="metric-card"><span className="metric-label">개인 최고 기록</span><div className="metric-value">{formatTime(records[activeId]?.bestTime??null)}<small>s</small></div><div className="metric-foot">개별 최고 기록</div></div>
              <button className="btn btn-secondary full-width" onClick={pause}><Pause size={15}/> 훈련 일시 정지</button>
            </div>
          </div>}
          {gameState==="paused"&&<div className="modal-scrim"><div className="pause-modal"><div className="pause-symbol"><Pause size={30}/></div><span className="section-index">SIMULATION SUSPENDED</span><h2>PAUSED</h2><p>Chronometer stopped. Resume when ready.</p><button className="btn btn-primary full-width" onClick={pause}><Play size={16} fill="currentColor"/> 훈련 재개</button><button className="btn btn-secondary full-width" onClick={restart}><RotateCcw size={16}/> 훈련 재시작</button><button className="text-button" onClick={()=>{setGameState("idle");setPage("home");}}>작전 본부로 복귀</button></div></div>}
        </section>}

        {page==="loadout"&&<section className="page">
          <div className="page-heading"><div><span className="section-index">ARMORY / 03</span><h1>STRATAGEM <em>LOADOUT</em></h1><p>훈련에 등장할 스트라타젬을 선택합니다. 기본 훈련은 현재 설정한 {trainingCount}개, 연속 작전은 20개를 출제합니다.</p></div><div className="loadout-total"><strong>{selected.length}</strong><span> / {stratagems.length} SELECTED</span></div></div>
          <div className="toolbar">
            <div className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="스트라타젬 검색..."/></div>
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}><option value="ALL">전체 분류</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
            <button className="btn btn-small btn-secondary" onClick={()=>setSelected(stratagems.map(s=>s.id))}>전체 선택</button>
            <button className="btn btn-small btn-quiet" onClick={()=>setSelected([])}>선택 해제</button>
          </div>
          <div className="stratagem-grid">{filtered.map(s=><button key={s.id} className={`stratagem-card ${selected.includes(s.id)?"selected":""}`} onClick={()=>toggleSelected(s.id)}>
            <div className="card-top"><span className="card-icon">{s.icon}</span><span className={`check-box ${selected.includes(s.id)?"checked":""}`}>{selected.includes(s.id)&&<Check size={13}/>}</span></div>
            <span className="card-category">{s.category}</span><strong>{s.name}</strong><div className="card-bottom"><span>{s.sequence.map(d=>arrow[d]).join(" ")}</span><span className="card-record">{records[s.id]?`${formatTime(records[s.id].bestTime)}s`:"NO RECORD"}</span></div>
          </button>)}</div>
          <div className="sticky-action"><span>{selected.length} 개 스트라타젬 선택됨 FOR TRAINING</span><div className="sticky-buttons"><button className="btn btn-secondary" disabled={!selected.length} onClick={()=>{setMode("practice");beginRun(selected,"practice");}}><Crosshair size={15}/> 기본 훈련 시작 ({trainingCount}개)</button><button className="btn btn-primary" disabled={selected.length<20} onClick={()=>{setMode("challenge");beginRun(selected,"challenge");}}><Play size={15} fill="currentColor"/> 20개 연속 작전</button></div></div>
        </section>}

        {page==="records"&&<section className="page">
          <div className="page-heading"><div><span className="section-index">PERFORMANCE LOG / 04</span><h1>PERSONAL <em>RECORDS</em></h1><p>개별 스트라타젬의 최고 기록과 훈련 성과를 확인합니다.</p></div><div className="record-badge"><Trophy size={25}/><span>{Object.keys(records).length} RECORDED</span></div></div>
          <div className="record-overview">
            <div className="overview-card"><span>숙달한 스트라타젬</span><strong>{Object.keys(records).length}<small> / {stratagems.length}</small></strong></div>
            <div className="overview-card"><span>총 훈련 시도</span><strong>{Object.values(records).reduce((n,r)=>n+r.attempts,0)}</strong></div>
            <div className="overview-card"><span>평균 입력 반응속도</span><strong>{averageReactionTime===null?"--":`${(averageReactionTime/1000).toFixed(2)}초`}</strong></div>
            <div className="overview-card"><span>평균 정확도</span><strong>{averageOverallAccuracy===null?"--":`${averageOverallAccuracy.toFixed(1)}%`}</strong></div>
          </div>
          <section className="fastest-section">
            <div className="fastest-heading"><span className="section-index">FASTEST STRATAGEMS / TOP 02</span><h2>평균 입력 속도가 가장 빠른 스트라타젬</h2></div>
            {fastestStratagems.length ? <div className="fastest-grid">{fastestStratagems.map((row,index)=><article className="fastest-card" key={row.stratagem.id}>
              <span className="fastest-rank">0{index+1}</span><span className="fastest-icon">{row.stratagem.icon}</span><h3>{row.stratagem.name}</h3>
              <div className="fastest-stats"><div><strong>{((row.averageTime||0)/1000).toFixed(2)}초</strong><span>평균 입력 시간</span></div><div><strong>{(row.averageAccuracy||0).toFixed(1)}%</strong><span>평균 정확도</span></div></div>
            </article>)}</div> : <div className="fastest-empty">평균 기록이 아직 없습니다. 훈련을 완료하면 가장 빠른 스트라타젬이 여기에 표시됩니다.</div>}
          </section>
          <div className="records-toolbar"><span className="section-index">INDIVIDUAL STRATAGEM PERFORMANCE</span><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}><option value="ALL">전체 분류</option>{categories.map(c=><option key={c}>{c}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value as "name"|"time")}><option value="name">SORT: NAME</option><option value="time">SORT: 최고 기록</option></select></div>
          <div className="record-table-wrap"><table className="record-table"><thead><tr><th>STRATAGEM</th><th>CATEGORY</th><th>최고 기록</th><th>평균 입력 시간</th><th>평균 정확도</th><th>최고 기록 정확도</th><th>오류</th><th>시도 횟수</th></tr></thead><tbody>{stratagems.filter(s=>categoryFilter==="ALL"||s.category===categoryFilter).sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):((records[a.id]?.bestTime??Infinity)-(records[b.id]?.bestTime??Infinity))).map(s=><tr key={s.id}><td><span className="table-icon">{s.icon}</span>{s.name}</td><td className="muted-cell">{s.category}</td><td className="time-cell">{formatTime(records[s.id]?.bestTime??null)}{records[s.id]?"s":""}</td><td>{(records[s.id]?.aggregateAttempts||0)>0?`${(((records[s.id]?.totalTimeMs||0)/(records[s.id]?.aggregateAttempts||1))/1000).toFixed(2)}s`:"--"}</td><td>{(records[s.id]?.aggregateAttempts||0)>0?`${((records[s.id]?.totalAccuracySum||0)/(records[s.id]?.aggregateAttempts||1)).toFixed(1)}%`:"--"}</td><td>{records[s.id]?`${records[s.id].bestAccuracy.toFixed(0)}%`:"--"}</td><td>{records[s.id]?.bestErrorCount??"--"}</td><td>{records[s.id]?.attempts??0}</td></tr>)}</tbody></table></div>
          <div className="records-footer"><span>RECORDS SAVED AUTOMATICALLY TO THIS BROWSER</span><button className="text-button danger-text" onClick={()=>{if(window.confirm("모든 개인 기록을 삭제할까요? 이 작업은 되돌릴 수 없습니다.")){setRecords({});}}}>전적 초기화</button></div>
        </section>}

        {page==="settings"&&<section className="page">
          <div className="page-heading"><div><span className="section-index">SYSTEM CONFIGURATION / 05</span><h1>TACTICAL <em>SETTINGS</em></h1><p>전술 터미널의 화면과 훈련 피드백을 설정합니다.</p></div><div className="settings-symbol"><Settings size={28}/></div></div>
          <div className="settings-section"><div className="settings-heading"><div><span className="section-index">DISPLAY / 01</span><h2>색상 테마</h2><p>Select a Super Earth-inspired terminal palette.</p></div></div>
            <div className="theme-grid">{(["earth","olive","crimson","arctic"] as Theme[]).map(t=><button key={t} className={`theme-card theme-swatch-${t} ${theme===t?"chosen":""}`} onClick={()=>setTheme(t)}><div className="swatch-preview"><i/><i/><i/></div><div><strong>{themeNames[t]}</strong><small>{t==="earth"?"YELLOW / CHARCOAL":t==="olive"?"OLIVE / GRAPHITE":t==="crimson"?"RED / BLACK":"ICE / NAVY"}</small></div>{theme===t&&<Check size={17}/>}</button>)}</div>
          </div>
          <div className="settings-section"><div className="settings-heading"><div><span className="section-index">FEEDBACK / 02</span><h2>TRAINING EXPERIENCE</h2><p>Adjust optional interface effects.</p></div></div>
            <div className="setting-row"><div className="setting-icon"><Volume2 size={19}/></div><div className="setting-copy"><strong>효과음</strong><small>Play feedback sounds for correct and incorrect inputs.</small></div><button className={`toggle ${soundEnabled?"on":""}`} onClick={()=>setSoundEnabled(v=>!v)} aria-label="Toggle sound"><i/></button></div>
            <div className="setting-row"><div className="setting-icon"><Sparkles size={19}/></div><div className="setting-copy"><strong>화면 애니메이션</strong><small>Enable interface transitions and motion effects.</small></div><button className={`toggle ${animationEnabled?"on":""}`} onClick={()=>setAnimationEnabled(v=>!v)} aria-label="Toggle animations"><i/></button></div>
          </div>
          <div className="settings-section"><div className="settings-heading"><div><span className="section-index">CONTROLS / 03</span><h2>입력 설정</h2><p>Training uses WASD directional inputs.</p></div></div><div className="control-keys">{(["W","A","S","D"]).map(k=><div key={k} className="control-key">{k}</div>)}</div><div className="control-note"><Keyboard size={16}/> W = UP&nbsp;&nbsp; A = LEFT&nbsp;&nbsp; S = DOWN&nbsp;&nbsp; D = RIGHT</div></div>
          <div className="settings-section danger-zone"><div className="settings-heading"><div><span className="section-index">DATA MANAGEMENT / 04</span><h2>LOCAL DATA</h2><p>Remove saved settings, loadout, and records from this browser.</p></div></div><button className="btn btn-danger" onClick={()=>{if(window.confirm("모든 설정, 선택 목록, 기록을 초기화할까요?")){setRecords({});setSelected(stratagems.map(s=>s.id));setTheme("earth");setSoundEnabled(false);setAnimationEnabled(true);}}}><RotateCcw size={15}/> 전체 데이터 초기화</button></div>
        </section>}
      </main>
    </div>
    <footer className="footer"><span>STRATAGEM TRAINER <b>•</b> FAN-MADE TRAINING PROJECT</span><span>본 프로젝트는 Arrowhead Game Studios 및 Sony와 무관한 팬 제작 프로젝트입니다.</span></footer>
    {notice&&<div className="toast" onClick={()=>setNotice("")}>{notice}<X size={14}/></div>}
  </div>;
}
export default App;
