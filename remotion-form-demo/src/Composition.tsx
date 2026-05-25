import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Field = {
  label: string;
  value: string;
  span?: "wide";
  multiline?: boolean;
  required?: boolean;
};

type TabKey = "details" | "bd" | "return" | "repeat" | "import";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
  easing: ease,
};

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], clamp);

const move = (frame: number, start: number, end: number, from: number, to: number) =>
  interpolate(frame, [start, end], [from, to], clamp);

const tabs: { key: TabKey; label: string; path: string }[] = [
  {
    key: "details",
    label: "Detalhes",
    path: "M8 5h8M8 9h8M8 13h5M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
  },
  {
    key: "bd",
    label: "Cadastrar Passageiro",
    path: "M15 19a6 6 0 0 0-12 0M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M16 11h6",
  },
  {
    key: "return",
    label: "Retorno",
    path: "M4 12a8 8 0 1 0 3-6.24M4 4v6h6",
  },
  {
    key: "repeat",
    label: "Repetir",
    path: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
  },
  {
    key: "import",
    label: "Serviços importados",
    path: "M14 3v4a1 1 0 0 0 1 1h4M8 13h8M8 17h8M8 9h2M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
  },
];

const detailFields: Field[] = [
  { label: "Data e horário de saída", value: "25/05/2026 14:30", required: true },
  { label: "Horário previsto de retorno", value: "25/05/2026 18:00" },
  { label: "Cliente", value: "Embraer", required: true },
  { label: "Solicitante", value: "Helena Martins", required: true },
  { label: "Tipo do serviço", value: "Guarulhos", required: true },
  { label: "Tipo do veículo", value: "Executivo", required: true },
  { label: "Motorista", value: "Carlos Andrade" },
  { label: "Trajeto", value: "GRU / São Paulo", span: "wide", required: true },
  {
    label: "Observação",
    value: "Mot: recepcionar no desembarque. Interna: diretoria em reunião externa.",
    span: "wide",
    multiline: true,
  },
];

const financeFields: Field[] = [
  { label: "Status de faturamento", value: "Pendente" },
  { label: "Cotação", value: "R$ 680,00" },
  { label: "OP", value: "OP-2026-0418" },
  { label: "Forma de pagamento", value: "Pedido de compra" },
  { label: "CR", value: "BR-ADM-042" },
];

const bdFields: Field[] = [
  { label: "Nome do passageiro", value: "Marina Couto", span: "wide", required: true },
  { label: "Telefone", value: "+55 11 97777-2210" },
  { label: "Classificação", value: "Passageiro Frequente", required: true },
  { label: "Cliente", value: "Embraer", required: true },
  { label: "Idioma", value: "Português", required: true },
  { label: "Email", value: "marina.couto@embraer.com", span: "wide" },
  { label: "Endereço de saída", value: "Terminal 3 - Porta C, GRU", span: "wide" },
  { label: "Perfil do passageiro", value: "Prefere veículo executivo, água sem gás.", span: "wide" },
];

const passengers = [
  {
    order: "01",
    name: "Rafael Azevedo",
    phone: "+55 11 98888-1040",
    address: "Terminal 3 - Porta C, Aeroporto GRU",
  },
  {
    order: "02",
    name: "Marina Couto",
    phone: "+55 11 97777-2210",
    address: "Terminal 3 - Porta C, Aeroporto GRU",
  },
];

const importRows = [
  {
    pg: "PG 905381",
    title: "Serviço 1",
    time: "14:30 -> 18:00",
    route: "GRU / São Paulo",
    pax: "2 pax",
    badge: "Manter espera",
    tone: "accent",
  },
  {
    pg: "PG 905381",
    title: "Serviço 2",
    time: "19:10",
    route: "Hotel Fasano / CGH",
    pax: "1 pax",
    badge: "Busca separada",
    tone: "manual",
  },
  {
    pg: "PG 905412",
    title: "Serviço 1",
    time: "21:40",
    route: "CGH / Alphaville",
    pax: "3 pax",
    badge: "Não editar",
    tone: "danger",
  },
];

const payloadRows = [
  ["cr40f_reservadeveculos", "create/update da reserva principal"],
  ["cr40f_servicosporpassageiro", "vínculo, ordem e endereço por passageiro"],
  ["cr40f_bancodedados", "cria passageiro importado ou reutiliza existente"],
  ["@odata.bind", "Cliente, solicitante, motorista, OP"],
];

const sceneForFrame = (frame: number): TabKey => {
  if (frame < 190) return "details";
  if (frame < 270) return "bd";
  if (frame < 340) return "return";
  if (frame < 405) return "repeat";
  if (frame < 485) return "import";
  return "details";
};

const headlineForFrame = (frame: number) => {
  if (frame < 80) return ["Formulário real", "Web resource operacional usado no Model-driven App"];
  if (frame < 190) return ["Detalhes do serviço", "Agenda, cliente, rota, passageiros, destino e faturamento"];
  if (frame < 270) return ["Cadastrar passageiro", "Novo cadastro, manutenção e bloqueio de duplicidade"];
  if (frame < 340) return ["Retorno", "Gera OS separada com trajeto invertido e endereço de retorno"];
  if (frame < 405) return ["Repetir", "Cria serviços frequentes com limite de período e fim de semana"];
  if (frame < 485) return ["Importação XLSX", "Planilha vira fila por PG, trecho, passageiro e decisão operacional"];
  return ["Salvar no Dataverse", "Valida campos, cria reserva e recria vínculos de passageiros"];
};

const Icon: React.FC<{ path: string }> = ({ path }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d={path} />
  </svg>
);

const CustomSelect: React.FC<{ label?: string; value: string; compact?: boolean }> = ({
  label,
  value,
  compact,
}) => (
  <div className={`select-shell ${compact ? "compact" : ""}`}>
    {label ? <span>{label}</span> : null}
    <div className="select-trigger">
      <strong>{value}</strong>
      <i />
    </div>
  </div>
);

const FieldBox: React.FC<Field & { active?: boolean; reveal?: number }> = ({
  label,
  value,
  span,
  multiline,
  required,
  active,
  reveal = 1,
}) => (
  <div className={`field ${span === "wide" ? "span-2" : ""} ${active ? "is-focus" : ""}`}>
    <span>
      {label}
      {required ? " *" : ""}
    </span>
    <div className={`field-control ${multiline ? "textarea" : ""}`}>
      <strong style={{ opacity: reveal }}>{value}</strong>
    </div>
  </div>
);

const Topbar: React.FC<{ frame: number }> = ({ frame }) => {
  const savePulse = spring({
    frame: Math.max(0, frame - 500),
    fps: 30,
    config: { damping: 9, stiffness: 90, mass: 0.45 },
  });

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">B</div>
        <div className="brand-text">
          <p>Betinhos Executive Service</p>
          <h1>Formulário de Agendamento</h1>
        </div>
      </div>
      <div className="top-actions">
        <CustomSelect label="Status" value="Solicitado" compact />
        <button className="secondary-action import-button" type="button">
          <span className="upload-icon">UP</span>
          Importar XLSX
        </button>
        <button
          className="primary-action"
          type="button"
          style={{ transform: `scale(${1 + savePulse * 0.035})` }}
        >
          Agendar serviços
        </button>
      </div>
    </header>
  );
};

const Tabs: React.FC<{ selected: TabKey; frame: number }> = ({ selected, frame }) => {
  const hover = fade(frame, 18, 48);
  const width = move(frame, 18, 48, 58, 214);

  return (
    <nav className="tabs" style={{ width }}>
      {tabs.map((tab, index) => (
        <div className={`tab ${selected === tab.key ? "is-active" : ""}`} key={tab.key}>
          <span className="tab-icon">
            <Icon path={tab.path} />
          </span>
          <span className="tab-label" style={{ opacity: hover }}>
            {tab.label}
          </span>
          {index === 4 && frame > 412 ? <span className="tab-dot" /> : null}
        </div>
      ))}
    </nav>
  );
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ title, children, className = "", style }) => (
  <section className={`form-section ${className}`} style={style}>
    <div className="form-section-title">
      <h3>{title}</h3>
    </div>
    {children}
  </section>
);

const PassengerRows: React.FC<{ frame: number; shared?: boolean }> = ({ frame, shared }) => (
  <div className={`passenger-rows ${shared ? "is-shared" : ""}`}>
    {passengers.map((passenger, index) => {
      const rowIn = fade(frame, 95 + index * 15, 116 + index * 15);
      return (
        <div
          className="passenger-row"
          key={passenger.order}
          style={{
            opacity: rowIn,
            transform: `translateY(${(1 - rowIn) * 18}px)`,
          }}
        >
          <div className="row-label">
            <span className="row-index">{passenger.order}</span>
            <button className="row-title" type="button">
              {passenger.name.split(" ")[0]}
            </button>
          </div>
          {!shared ? (
            <div className="address-cell">
              <span>Endereço de saída</span>
              <strong>{passenger.address}</strong>
            </div>
          ) : null}
          <button className="remove-row" type="button">
            X
          </button>
        </div>
      );
    })}
  </div>
);

const DetailsPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const activeIndex = Math.min(detailFields.length - 1, Math.max(0, Math.floor((frame - 42) / 12)));
  const passengerShared = frame > 145;

  return (
    <section className="panel details-panel">
      <div className="section-head">
        <h2>Detalhes do serviço</h2>
      </div>
      <div className="panel-stack">
        <Section title="Agenda, cliente e rota">
          <div className="form-grid">
            {detailFields.map((field, index) => (
              <FieldBox
                key={field.label}
                {...field}
                active={index === activeIndex && frame < 170}
                reveal={fade(frame, 40 + index * 8, 52 + index * 8)}
              />
            ))}
          </div>
        </Section>
        <section className={`passenger-block ${passengerShared ? "is-shared-address" : ""}`}>
          <div className="block-title">
            <div>
              <h3>Passageiros selecionados</h3>
            </div>
            <div className="passenger-toolbar">
              <button className={`secondary-action ${passengerShared ? "is-pressed" : ""}`} type="button">
                {passengerShared ? "Endereço por passageiro" : "Endereço único"}
              </button>
              <button className="secondary-action success" type="button">
                Adicionar
              </button>
            </div>
          </div>
          <div className="passenger-address-grid">
            <PassengerRows frame={frame} shared={passengerShared} />
            {passengerShared ? (
              <div className="shared-address">
                <span>Endereço único de saída</span>
                <strong>Terminal 3 - Porta C, Aeroporto GRU</strong>
                <small>Aplicado aos passageiros selecionados.</small>
              </div>
            ) : null}
          </div>
        </section>
        <Section title="Destino">
          <div className="form-grid compact">
            <FieldBox label="Destino *" value="Hotel Fasano, Rua Vittorio Fasano, São Paulo" span="wide" multiline />
          </div>
        </Section>
        <Section title="Faturamento">
          <div className="form-grid finance-grid">
            <div className="toggle-field">
              <span>Receber</span>
              <b>Ativado</b>
            </div>
            {financeFields.map((field) => (
              <FieldBox key={field.label} {...field} />
            ))}
          </div>
        </Section>
      </div>
    </section>
  );
};

const PassengerPicker: React.FC<{ frame: number }> = ({ frame }) => {
  const inFrame = fade(frame, 210, 226);
  return (
    <div
      className="floating-dialog passenger-picker"
      style={{
        opacity: inFrame,
        transform: `translateY(${(1 - inFrame) * 24}px) scale(${0.98 + inFrame * 0.02})`,
      }}
    >
      <header>
        <span>Banco de dados</span>
        <strong>Selecionar passageiro</strong>
      </header>
      <div className="search-field">Nome, telefone ou email: marina</div>
      <div className="picker-result is-active">
        <strong>Marina Couto</strong>
        <span>Embraer · +55 11 97777-2210 · Passageiro Frequente</span>
      </div>
      <div className="picker-result">
        <strong>Marina Costa</strong>
        <span>Cadastro parecido. Revisar antes de criar novo.</span>
      </div>
    </div>
  );
};

const BdPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const activeIndex = Math.min(bdFields.length - 1, Math.max(0, Math.floor((frame - 190) / 9)));

  return (
    <section className="panel bd-panel">
      <div className="section-head">
        <div>
          <h2>Cadastrar Passageiro</h2>
          <p>Cadastro e manutenção de passageiro sem sair do fluxo de agendamento.</p>
        </div>
      </div>
      <Section title="Novo passageiro">
        <div className="form-grid database-passenger-grid">
          {bdFields.map((field, index) => (
            <FieldBox key={field.label} {...field} active={index === activeIndex} reveal={fade(frame, 192 + index * 6, 204 + index * 6)} />
          ))}
        </div>
      </Section>
      <div className="footer-actions">
        <button className="primary-action" type="button">
          + Criar passageiro
        </button>
      </div>
      <PassengerPicker frame={frame} />
      {frame > 235 ? (
        <div className="duplicate-callout">
          <strong>Passageiro encontrado</strong>
          <span>Telefone, email, nome parecido, cliente, CR e departamento entram na conferência.</span>
        </div>
      ) : null}
    </section>
  );
};

const ReturnPanel: React.FC<{ frame: number }> = ({ frame }) => (
  <section className="panel return-panel">
    <div className="section-head inline">
      <div>
        <h2>Retorno</h2>
        <p>Disponível na criação. A edição bloqueia retorno novo.</p>
      </div>
      <div className="switch-on">
        <span />
      </div>
    </div>
    <Section title="Dados do retorno">
      <div className="form-grid">
        <FieldBox label="Data de retorno" value="25/05/2026 18:00" span="wide" active={frame < 310} />
        <FieldBox label="Endereço de Saída - Retorno" value="Hotel Fasano, São Paulo" span="wide" multiline />
        <FieldBox label="Destino" value="Terminal 3 - Porta C, Aeroporto GRU" span="wide" multiline />
        <FieldBox label="Observação retorno" value="Mot: retorno com horário flexível, sem paradas." span="wide" multiline />
      </div>
    </Section>
    <div className="logic-strip">
      <strong>Função real</strong>
      <span>Cria outra reserva. Inverte `Trajeto`. Reusa passageiros. Salva vínculos no `cr40f_servicosporpassageiro`.</span>
    </div>
  </section>
);

const RepeatPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const dates = ["26/05", "27/05", "28/05", "29/05", "01/06"];
  return (
    <section className="panel repeat-panel">
      <div className="section-head inline">
        <div>
          <h2>Repetir</h2>
          <p>Serviços frequentes com limite de datas e registros.</p>
        </div>
        <div className="switch-on">
          <span />
        </div>
      </div>
      <Section title="Serviços frequentes">
        <div className="form-grid">
          <FieldBox label="Data início" value="26/05/2026" />
          <FieldBox label="Data fim" value="01/06/2026" />
          <FieldBox label="Tipo de Serviço Frequente" value="Ida e retorno" />
          <div className="toggle-field">
            <span>Contabilizar Sáb e Dom?</span>
            <b>Sim</b>
          </div>
        </div>
      </Section>
      <div className="calendar-strip">
        {dates.map((date, index) => {
          const visible = fade(frame, 355 + index * 8, 365 + index * 8);
          return (
            <div key={date} style={{ opacity: visible, transform: `translateY(${(1 - visible) * 12}px)` }}>
              <strong>{date}</strong>
              <span>Ida + retorno</span>
            </div>
          );
        })}
      </div>
      <div className="logic-strip">
        <strong>Função real</strong>
        <span>Gera datas, remove fins de semana se desligado e bloqueia período acima do limite.</span>
      </div>
    </section>
  );
};

const ImportPanel: React.FC<{ frame: number }> = ({ frame }) => (
  <section className="panel import-panel">
    <div className="section-head inline import-review-head">
      <div>
        <p className="eyebrow-small">Importação XLSX</p>
        <h2>Serviços importados</h2>
      </div>
      <button className="secondary-action import-button" type="button">
        Importar XLSX
      </button>
    </div>
    <div className="import-review-stats">
      {[
        ["18", "Linhas"],
        ["3", "PGs"],
        ["5", "Trechos"],
        ["1", "Repetidos"],
        ["2", "Pendentes"],
        ["0", "Salvos"],
      ].map(([value, label]) => (
        <div className={`import-stat ${label === "Repetidos" ? "danger" : ""}`} key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
    <div className="import-review-issues">
      <p>1 serviço repetido por horário, trajeto, endereço, destino ou passageiros. Não edite nem salve por aqui.</p>
    </div>
    <div className="import-workbench">
      <section className="import-service-list">
        <div className="import-service-group-title">
          <div>
            <strong>PG 905381</strong>
            <span>2 serviço(s) · ST-4501</span>
          </div>
          {frame > 450 ? <button className="same-car-button">É o mesmo carro</button> : null}
        </div>
        {importRows.map((row, index) => {
          const rowIn = fade(frame, 420 + index * 9, 436 + index * 9);
          return (
            <div
              className={`import-service-row ${index === 0 ? "is-selected" : ""} ${row.tone === "danger" ? "is-duplicated" : ""}`}
              key={`${row.pg}-${row.title}`}
              style={{
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * -18}px)`,
              }}
            >
              <div className="import-service-main">
                <strong>{`${row.pg} · ${row.title}`}</strong>
                <span>{`${row.time} · ${row.route}`}</span>
              </div>
              <div className="import-service-side">
                <span>{row.pax}</span>
                <b className={`import-badge ${row.tone}`}>{row.badge}</b>
              </div>
            </div>
          );
        })}
      </section>
      <aside className="import-inspector">
        <div className="import-inspector-head">
          <div>
            <span>{frame > 456 ? "Edição habilitada" : "Conferência bloqueada"}</span>
            <strong>PG 905381 · 25/05/2026 14:30</strong>
          </div>
          <button className={`icon-button ${frame > 456 ? "is-active" : ""}`} type="button">
            {frame > 456 ? "OK" : "ED"}
          </button>
        </div>
        <div className="decision-panel">
          <span>Interpretação da PG</span>
          <strong>Manter espera</strong>
          <p>Uma OS cobre saída e retorno previsto. Separe se o carro não precisa ficar à disposição.</p>
          <div>
            <button>Manter espera</button>
            <button>Separar ida/busca</button>
          </div>
        </div>
        <div className="import-timeline">
          <div>
            <span>Saída</span>
            <strong>25/05/2026 14:30</strong>
          </div>
          <div>
            <span>Retorno previsto</span>
            <strong>25/05/2026 18:00</strong>
          </div>
          <div>
            <span>Passageiros</span>
            <strong>2 pax</strong>
          </div>
        </div>
        <div className="import-editor-stack">
          <Section title="Agenda" className="import-editor-section">
            <div className="import-hot-grid">
              <FieldBox label="Data e hora" value="25/05/2026 14:30" />
              <FieldBox label="Tipo de serviço" value="Guarulhos" />
              <FieldBox label="Tipo de veículo" value="Executivo" />
              <FieldBox label="Cotação" value="680" />
            </div>
          </Section>
          <Section title="Rota operacional" className="import-editor-section">
            <div className="import-hot-grid">
              <FieldBox label="Endereço de saída" value="GRU Terminal 3" span="wide" />
              <FieldBox label="Destino" value="Hotel Fasano" span="wide" />
            </div>
          </Section>
        </div>
        <div className="import-passengers">
          <strong>Passageiros</strong>
          <div>Rafael Azevedo · +55 11 98888-1040</div>
          <div>Marina Couto · +55 11 97777-2210</div>
        </div>
        <footer className="import-actions">
          <button>VALIDAR</button>
          <button>IGNORAR</button>
          <button className="primary">Salvar trecho</button>
        </footer>
      </aside>
    </div>
  </section>
);

const SavePanel: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = fade(frame, 492, 532);
  return (
    <div className="save-overlay" style={{ opacity: fade(frame, 486, 500) }}>
      <div className="save-dialog">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="save-head">
          <strong>Validação concluída</strong>
          <span>Campos obrigatórios aprovados. Passageiro duplicado bloqueado antes do save.</span>
        </div>
        <div className="payload-grid">
          {payloadRows.map(([entity, desc], index) => {
            const rowIn = fade(frame, 500 + index * 7, 512 + index * 7);
            return (
              <div className="payload-row" key={entity} style={{ opacity: rowIn }}>
                <strong>{entity}</strong>
                <span>{desc}</span>
              </div>
            );
          })}
        </div>
        <div className="success-line" style={{ opacity: fade(frame, 528, 540) }}>
          <span>OK</span>
          <strong>Serviço solicitado com sucesso.</strong>
        </div>
      </div>
    </div>
  );
};

const ScenePanel: React.FC<{ selected: TabKey; frame: number }> = ({ selected, frame }) => {
  if (selected === "bd") return <BdPanel frame={frame} />;
  if (selected === "return") return <ReturnPanel frame={frame} />;
  if (selected === "repeat") return <RepeatPanel frame={frame} />;
  if (selected === "import") return <ImportPanel frame={frame} />;
  return <DetailsPanel frame={frame} />;
};

const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const points = [
    [1088, 74],
    [70, 145],
    [516, 205],
    [1128, 74],
    [70, 211],
    [788, 352],
    [70, 276],
    [860, 196],
    [70, 340],
    [806, 302],
    [70, 407],
    [485, 270],
    [1110, 74],
  ];
  const ranges = [0, 36, 92, 170, 198, 246, 280, 318, 352, 392, 420, 464, 504];
  const segment = ranges.findIndex((start, index) => {
    const next = ranges[index + 1] ?? 540;
    return frame >= start && frame < next;
  });
  const from = points[Math.max(0, segment)];
  const to = points[Math.min(points.length - 1, segment + 1)];
  const start = ranges[Math.max(0, segment)];
  const end = ranges[segment + 1] ?? 540;
  const x = move(frame, start, end, from[0], to[0]);
  const y = move(frame, start, end, from[1], to[1]);
  const click = [92, 170, 246, 318, 392, 464, 504].some((target) => Math.abs(frame - target) < 5);
  return <div className={`cursor ${click ? "is-clicking" : ""}`} style={{ left: x, top: y }} />;
};

export const FormDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const selected = sceneForFrame(frame);
  const [headline, subhead] = headlineForFrame(frame);
  const intro = fade(frame, 0, fps);
  const railWidth = move(frame, 18, 48, 58, 214);

  return (
    <AbsoluteFill className="video-root">
      <div
        className="app-shell"
        style={{
          opacity: intro,
          gridTemplateColumns: `${railWidth}px minmax(0, 1fr)`,
          transform: `translateY(${(1 - intro) * 18}px)`,
        }}
      >
        <Topbar frame={frame} />
        <Tabs selected={selected} frame={frame} />
        <main className="content">
          <ScenePanel selected={selected} frame={frame} />
        </main>
      </div>
      <div className="caption">
        <strong>{headline}</strong>
        <span>{subhead}</span>
      </div>
      <SavePanel frame={frame} />
      <Cursor frame={frame} />
    </AbsoluteFill>
  );
};
