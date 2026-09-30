'use client';
import {useEffect, useState} from 'react';
import {CloudRain, HeartPulse, School, Sparkles} from 'lucide-react';

type AIStatus = {configured: boolean; provider: string};
export default function CommunityBrief() {
  const [ai, setAI] = useState<AIStatus | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/analyse', {signal: controller.signal}).then(async response => {
      if (!response.ok) throw Error();
      setAI(await response.json());
    }).catch(() => {if (!controller.signal.aborted) setUnavailable(true);});
    return () => controller.abort();
  }, []);
  return <section className="panel community-brief" aria-labelledby="community-purpose">
    <div className="eyebrow green">STARTING IN UTTAR PRADESH · DESIGNED FOR LOCAL TEAMS</div>
    <h2 id="community-purpose">Everyday problems. A clearer path to action.</h2>
    <p>Residents know where services fall short. Jan Seva brings their reports into one place so local teams can review evidence and prioritise field visits.</p>
    <div className="community-use-cases">
      <div><CloudRain size={22}/><h3>Monsoon resilience</h3><p>Flag blocked drains, waterlogged lanes and damaged drinking-water pipes.</p></div>
      <div><HeartPulse size={22}/><h3>Access to care</h3><p>Highlight unsafe approach roads and sanitation problems near health centres.</p></div>
      <div><School size={22}/><h3>Safer school routes</h3><p>Report broken paths, exposed wires and unreliable street lighting.</p></div>
    </div>
    <div className="ai-disclosure" role="status"><Sparkles size={18}/><div><b>{ai ? ai.configured ? `AI summary provider configured · ${ai.provider}` : 'Built-in review · AI summaries not configured' : unavailable ? 'AI status unavailable · Review identifies the method used' : 'Checking AI summary availability…'}</b><p>AI can help summarise your words. Category and severity follow visible rules; people verify conditions and decide what happens next.</p></div></div>
    <small>75 districts accept reports · 11 mapped sample projects in 6 districts · No claim of statewide service delivery</small>
  </section>;
}
