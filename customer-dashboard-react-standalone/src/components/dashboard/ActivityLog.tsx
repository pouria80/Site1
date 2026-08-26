import React from 'react';
import '../../css/dashboard-activity.css';
interface Activity{id:string;type:'login'|'charge'|'order'|'payment'|'withdrawal';description:string;timestamp:string}
const icons={login:'🔑',charge:'💳',order:'📦',payment:'✓',withdrawal:'💸'};
export default function ActivityLog({activities}:{activities:Activity[]}){return <section className="activity-log glass"><div className="section-header"><h3>Important Activity</h3><span className="activity-count">{activities.length} events</span></div><div className="activity-list">{activities.length===0?<p className="empty-state">No activity yet</p>:activities.map(a=><div key={a.id} className="activity-item"><span className="activity-icon">{icons[a.type]||'•'}</span><div className="activity-content"><p className="activity-desc">{a.description}</p><p className="activity-time">{new Date(a.timestamp).toLocaleString()}</p></div></div>)}</div></section>}
