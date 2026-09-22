> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 다음 주소에서 가져오세요: https://exa.ai/docs/llms.txt
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 상태 페이지 {#status-page}

> Exa 서비스의 실시간 가용성, 진행 중인 incident, uptime 기록을 확인하세요.

export const ExaStatus = () => {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    try {
      const [summaryRes, componentsRes] = await Promise.all([fetch("https://status.exa.ai/summary.json"), fetch("https://status.exa.ai/v2/components.json")]);
      if (!summaryRes.ok || !componentsRes.ok) throw new Error("status fetch failed");
      const summary = await summaryRes.json();
      const components = await componentsRes.json();
      setData({
        overall: summary.page?.status,
        incidents: summary.activeIncidents || [],
        maintenances: summary.activeMaintenances || [],
        services: (components.components || []).filter(c => !c.group),
        checkedAt: new Date()
      });
      setFailed(false);
    } catch (err) {
      setFailed(true);
    }
  };
  useEffect(() => {
    load();
    const timer = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);
  const SERVICE_STATUS = {
    OPERATIONAL: {
      label: "Operational",
      color: "var(--color-success-foreground-secondary)",
      background: "var(--color-success-subtle)"
    },
    DEGRADEDPERFORMANCE: {
      label: "Degraded performance",
      color: "var(--color-warning-foreground-secondary)",
      background: "var(--color-warning-subtle)"
    },
    PARTIALOUTAGE: {
      label: "Partial outage",
      color: "var(--color-warning-foreground-secondary)",
      background: "var(--color-warning-subtle)"
    },
    MAJOROUTAGE: {
      label: "Major outage",
      color: "var(--color-danger-foreground-secondary)",
      background: "var(--color-danger-subtle)"
    },
    UNDERMAINTENANCE: {
      label: "Under maintenance",
      color: "var(--color-neutral-foreground-secondary)",
      background: "var(--color-neutral-subtle)"
    }
  };
  const OVERALL_STATUS = {
    UP: {
      label: "All systems operational",
      color: "var(--color-success-foreground-secondary)",
      background: "var(--color-success-subtle)"
    },
    HASISSUES: {
      label: "Experiencing issues",
      color: "var(--color-warning-foreground-secondary)",
      background: "var(--color-warning-subtle)"
    },
    UNDERMAINTENANCE: {
      label: "Under maintenance",
      color: "var(--color-neutral-foreground-secondary)",
      background: "var(--color-neutral-subtle)"
    }
  };
  if (failed) {
    return <div className="not-prose my-6 rounded-xl border border-border bg-card p-5">
        <a href="https://status.exa.ai" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:no-underline">
          Couldn't load live status — open status.exa.ai →
        </a>
      </div>;
  }
  const overall = OVERALL_STATUS[data?.overall] || ({
    label: "Checking Exa services…",
    color: "var(--color-neutral-foreground-secondary)",
    background: "var(--color-neutral-subtle)"
  });
  return <div className="not-prose my-6">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className={"h-2.5 w-2.5 rounded-full" + (data ? "" : " animate-pulse")} style={{
    backgroundColor: overall.color
  }}></span>
            <span className="text-base font-semibold text-foreground">{overall.label}</span>
          </div>
          <a href="https://status.exa.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
            status.exa.ai ↗
          </a>
        </div>
        {data && <div>
            {data.services.map(service => {
    const s = SERVICE_STATUS[service.status] || ({
      label: service.status,
      color: "var(--color-neutral-foreground-secondary)",
      background: "var(--color-neutral-subtle)"
    });
    return <div key={service.id} className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
                  <span className="text-sm text-foreground">{service.name}</span>
                  <span className="rounded-md px-2.5 py-0.5 text-xs font-medium" style={{
      color: s.color,
      backgroundColor: s.background
    }}>
                    {s.label}
                  </span>
                </div>;
  })}
          </div>}
      </div>
      {data && data.incidents.length > 0 && <div className="mt-4 rounded-xl border p-5" style={{
    borderColor: "var(--color-danger-border)",
    backgroundColor: "var(--color-danger-subtle)"
  }}>
          <div className="mb-2 text-sm font-semibold" style={{
    color: "var(--color-danger-foreground-secondary)"
  }}>
            Active incidents
          </div>
          {data.incidents.map(incident => <div key={incident.name} className="mb-2 last:mb-0">
              <div className="text-sm font-medium text-foreground">{incident.name}</div>
              <div className="text-xs text-muted-foreground">
                {incident.status} · started {new Date(incident.started).toLocaleString()}
              </div>
              {incident.url && <a href={incident.url} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground underline hover:no-underline">
                  Incident updates →
                </a>}
            </div>)}
        </div>}
      {data && data.maintenances.length > 0 && <div className="mt-4 rounded-xl border p-5" style={{
    borderColor: "var(--color-warning-border)",
    backgroundColor: "var(--color-warning-subtle)"
  }}>
          <div className="mb-2 text-sm font-semibold" style={{
    color: "var(--color-warning-foreground-secondary)"
  }}>
            Scheduled maintenance
          </div>
          {data.maintenances.map(maintenance => <div key={maintenance.name} className="mb-2 last:mb-0">
              <div className="text-sm font-medium text-foreground">{maintenance.name}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(maintenance.start).toLocaleString()}
                {maintenance.duration ? ` · ${maintenance.duration} minutes` : ""}
              </div>
            </div>)}
        </div>}
      {data && <div className="mt-3 text-xs text-muted-foreground">
          Checked {data.checkedAt.toLocaleTimeString()} · refreshes every 5 minutes
        </div>}
    </div>;
};

***

Exa는 [status.exa.ai](https://status.exa.ai)에서 서비스 가용성을 공개합니다. Search API, Websets, Exa MCP의 현재 상태, 진행 상황에 따라 업데이트되는 진행 중인 incident, 그리고 90일간의 uptime 기록을 확인할 수 있습니다.

<ExaStatus />

## 업데이트 구독 {#subscribe-to-updates}

상태 페이지에서 구독하면 incident가 발생하거나 업데이트되거나 해결될 때 알림을 받을 수 있습니다. 알림은 이메일, Slack, Google Chat 또는 웹훅으로 전달됩니다.

## 도움 받기 {#get-help}

모든 시스템이 정상으로 표시되는데도 요청이 계속 실패한다면 원인은 요청 수준에 있을 가능성이 높습니다. 먼저 [오류 코드](/ko/docs/admin/error-codes)를 확인하세요.

<Columns cols={2}>
  <Card title="이메일 지원" icon="mail" href="mailto:hello@exa.ai" cta="이메일 지원" arrow="true">
    가장 빠르게 진단받으려면 response 상태, 오류 본문, `requestId`를 함께 보내주세요.
  </Card>

  <Card title="Enterprise 지원" icon="headset" href="https://exa.ai/contact/sales" cta="영업팀 문의" arrow="true">
    Uptime 및 지원 SLA는 Enterprise 플랜에서 제공됩니다.
  </Card>
</Columns>