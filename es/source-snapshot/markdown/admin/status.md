> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="status-page">
  # Página de estado
</div>

> Disponibilidad en tiempo real, incidentes activos e historial de tiempo de actividad de los servicios de Exa.

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

Exa publica la disponibilidad de sus servicios en [status.exa.ai](https://status.exa.ai): el estado actual de la Search API, Websets y Exa MCP, los incidentes activos con actualizaciones a medida que evolucionan y 90 días de historial de disponibilidad.

<ExaStatus />

<div id="subscribe-to-updates">
  ## Suscríbete a las actualizaciones
</div>

Suscríbete en la página de estado para recibir avisos cuando se abra, actualice o resuelva un incidente. Las notificaciones se envían por correo electrónico, Slack, Google Chat o webhook.

<div id="get-help">
  ## Obtener ayuda
</div>

Si las solicitudes siguen fallando aunque todos los sistemas figuren como operativos, lo más probable es que la causa esté en la propia solicitud: consulta primero los [Códigos de error](/es/docs/admin/error-codes).

<Columns cols={2}>
  <Card title="Soporte por correo" icon="mail" href="mailto:hello@exa.ai" cta="Escribir a soporte" arrow="true">
    Envía el estado de la respuesta, el cuerpo del error y el `requestId` para agilizar el diagnóstico.
  </Card>

  <Card title="Soporte empresarial" icon="headset" href="https://exa.ai/contact/sales" cta="Contactar con ventas" arrow="true">
    Los SLA de disponibilidad y soporte están disponibles en los planes Enterprise.
  </Card>
</Columns>