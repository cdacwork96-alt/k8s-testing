import { useState, useEffect, useRef, useCallback } from "react";
import PodDebugger from "./PodDebugger.jsx";
import {
  LayoutDashboard, Server, Box, Layers, Cpu, Bell, Activity,
  Database, MessageSquare, AlertTriangle, CheckCircle, XCircle,
  Clock, Zap, TrendingUp, RefreshCw, Search, HardDrive,
  Terminal, Brain, Shield, ChevronRight, ChevronDown,
  BarChart2, GitBranch, Eye, ArrowUp, ArrowDown, Filter,
  Settings, Wifi, Circle, Play, Pause, ToggleLeft, ToggleRight,
  Thermometer, Gauge, Network, Send, Bot, User, Sparkles,
  AlertCircle, Info, MemoryStick, MonitorCheck, Radio, Bug
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";

// ─── Color System ───────────────────────────────────────────────────────────
const C = {
  bg: "#030912", panel: "#07111F", card: "#0C1D30", cardHover: "#0F2236",
  border: "#1B3A5C", borderLight: "#254D78",
  blue: "#38BDF8", blueDim: "#1E6A9A", blueGlow: "rgba(56,189,248,0.15)",
  green: "#22C55E", greenDim: "#166534",
  amber: "#F59E0B", amberDim: "#92400E",
  red: "#EF4444", redDim: "#7F1D1D",
  purple: "#A855F7", purpleDim: "#581C87",
  cyan: "#06B6D4", teal: "#14B8A6",
  text: "#E2E8F0", textMuted: "#64748B", textDim: "#94A3B8",
  navy: "#0A1628",
};

// ─── Demo Data ───────────────────────────────────────────────────────────────
const CLUSTERS = {
  airawat: {
    name: "AIRAWAT", full: "National AI Computing Facility", flag: "🇮🇳",
    region: "Pune, Maharashtra", version: "1.29.3",
    nodes: [
      { name: "gpu-node-01", role: "worker", status: "Ready", cpu: 78, mem: 82, gpus: 8, gpuUtil: 94, pods: 24, age: "142d", ip: "10.0.1.11", gpuModel: "A100-80GB", temp: 71, power: 5800 },
      { name: "gpu-node-02", role: "worker", status: "Ready", cpu: 65, mem: 74, gpus: 8, gpuUtil: 87, pods: 22, age: "142d", ip: "10.0.1.12", gpuModel: "A100-80GB", temp: 68, power: 5200 },
      { name: "gpu-node-03", role: "worker", status: "Ready", cpu: 91, mem: 88, gpus: 8, gpuUtil: 98, pods: 28, age: "142d", ip: "10.0.1.13", gpuModel: "A100-80GB", temp: 79, power: 6200 },
      { name: "gpu-node-04", role: "worker", status: "NotReady", cpu: 12, mem: 18, gpus: 8, gpuUtil: 0, pods: 0, age: "142d", ip: "10.0.1.14", gpuModel: "A100-80GB", temp: 35, power: 400 },
      { name: "gpu-node-05", role: "worker", status: "Ready", cpu: 83, mem: 79, gpus: 8, gpuUtil: 91, pods: 26, age: "98d", ip: "10.0.1.15", gpuModel: "A100-80GB", temp: 73, power: 5900 },
      { name: "gpu-node-06", role: "worker", status: "Ready", cpu: 70, mem: 71, gpus: 8, gpuUtil: 76, pods: 20, age: "98d", ip: "10.0.1.16", gpuModel: "A100-80GB", temp: 65, power: 4800 },
      { name: "gpu-node-07", role: "worker", status: "Ready", cpu: 55, mem: 60, gpus: 8, gpuUtil: 62, pods: 18, age: "56d", ip: "10.0.1.17", gpuModel: "A100-80GB", temp: 58, power: 3900 },
      { name: "gpu-node-08", role: "worker", status: "Ready", cpu: 88, mem: 91, gpus: 8, gpuUtil: 96, pods: 30, age: "56d", ip: "10.0.1.18", gpuModel: "A100-80GB", temp: 76, power: 6100 },
      { name: "cpu-node-01", role: "worker", status: "Ready", cpu: 45, mem: 52, gpus: 0, gpuUtil: 0, pods: 42, age: "142d", ip: "10.0.2.11", gpuModel: "—", temp: 48, power: 280 },
      { name: "cpu-node-02", role: "worker", status: "Ready", cpu: 38, mem: 44, gpus: 0, gpuUtil: 0, pods: 38, age: "142d", ip: "10.0.2.12", gpuModel: "—", temp: 45, power: 260 },
      { name: "ctrl-node-01", role: "control-plane", status: "Ready", cpu: 22, mem: 35, gpus: 0, gpuUtil: 0, pods: 28, age: "142d", ip: "10.0.0.10", gpuModel: "—", temp: 42, power: 220 },
      { name: "ctrl-node-02", role: "control-plane", status: "Ready", cpu: 18, mem: 31, gpus: 0, gpuUtil: 0, pods: 26, age: "142d", ip: "10.0.0.11", gpuModel: "—", temp: 40, power: 210 },
    ],
  },
  paramsiddhi: {
    name: "PARAM SIDDHI", full: "National Supercomputing Mission", flag: "🇮🇳",
    region: "Pune, Maharashtra", version: "1.28.7",
    nodes: [
      { name: "ps-gpu-01", role: "worker", status: "Ready", cpu: 72, mem: 75, gpus: 8, gpuUtil: 88, pods: 20, age: "210d", ip: "10.1.1.11", gpuModel: "A100-40GB", temp: 69, power: 4800 },
      { name: "ps-gpu-02", role: "worker", status: "Ready", cpu: 58, mem: 62, gpus: 8, gpuUtil: 71, pods: 16, age: "210d", ip: "10.1.1.12", gpuModel: "A100-40GB", temp: 62, power: 4100 },
      { name: "ps-gpu-03", role: "worker", status: "Ready", cpu: 84, mem: 86, gpus: 8, gpuUtil: 95, pods: 24, age: "210d", ip: "10.1.1.13", gpuModel: "A100-40GB", temp: 75, power: 5400 },
      { name: "ps-gpu-04", role: "worker", status: "Ready", cpu: 67, mem: 69, gpus: 8, gpuUtil: 79, pods: 18, age: "180d", ip: "10.1.1.14", gpuModel: "A100-40GB", temp: 64, power: 4400 },
      { name: "ps-cpu-01", role: "worker", status: "Ready", cpu: 52, mem: 58, gpus: 0, gpuUtil: 0, pods: 36, age: "210d", ip: "10.1.2.11", gpuModel: "—", temp: 46, power: 240 },
      { name: "ps-cpu-02", role: "worker", status: "NotReady", cpu: 5, mem: 8, gpus: 0, gpuUtil: 0, pods: 0, age: "210d", ip: "10.1.2.12", gpuModel: "—", temp: 38, power: 80 },
      { name: "ps-ctrl-01", role: "control-plane", status: "Ready", cpu: 25, mem: 38, gpus: 0, gpuUtil: 0, pods: 22, age: "210d", ip: "10.1.0.10", gpuModel: "—", temp: 41, power: 190 },
    ],
  }
};

const NAMESPACES = ["default", "kube-system", "ai-workloads", "monitoring", "inference", "training", "storage", "networking"];

const generatePods = (clusterKey) => {
  const cluster = CLUSTERS[clusterKey];
  const pods = [];
  const statuses = ["Running", "Running", "Running", "Running", "Pending", "CrashLoopBackOff", "Running"];
  const images = ["pytorch/pytorch:2.1.0", "tensorflow/tensorflow:2.14", "nvcr.io/nvidia/nemo:23.10", "ghcr.io/vllm-project/vllm:latest", "kubeflow/trainer:v1.6", "nginx:alpine", "redis:7.2", "prometheus/prometheus:v2.48"];
  let id = 0;
  NAMESPACES.forEach(ns => {
    const count = ns === "ai-workloads" ? 18 : ns === "training" ? 12 : ns === "inference" ? 8 : 5;
    for (let i = 0; i < count; i++) {
      const node = cluster.nodes[id % cluster.nodes.length];
      pods.push({
        name: `${ns.replace("-", "")}-${["worker", "server", "trainer", "agent", "controller"][id % 5]}-${String(id).padStart(4, "0")}`,
        namespace: ns, status: statuses[id % statuses.length],
        restarts: id % 7 === 0 ? Math.floor(Math.random() * 8) + 1 : 0,
        cpu: `${Math.floor(Math.random() * 4000)}m`, mem: `${Math.floor(Math.random() * 16000)}Mi`,
        node: node.name, age: `${Math.floor(Math.random() * 120) + 1}d`,
        image: images[id % images.length], id: id++,
      });
    }
  });
  return pods;
};

const generateMetrics = () => {
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const h = String(i).padStart(2, "0");
    data.push({
      time: `${h}:00`,
      cpu: Math.floor(60 + Math.random() * 30),
      mem: Math.floor(65 + Math.random() * 25),
      gpu: Math.floor(70 + Math.random() * 25),
      net: Math.floor(20 + Math.random() * 60),
    });
  }
  return data.reverse();
};

const ALERTS_DATA = [
  { id: 1, sev: "critical", title: "Node gpu-node-04 NotReady", msg: "Node has been in NotReady state for 23 minutes. kubelet not responding.", ns: "kube-system", time: "2m ago", fix: "Check node health: kubectl describe node gpu-node-04. Likely kubelet crash — run: systemctl restart kubelet on the node. If GPU driver issue, check nvidia-smi output." },
  { id: 2, sev: "critical", title: "Pod CrashLoopBackOff in ai-workloads", msg: "aiworkloads-trainer-0018 has restarted 7 times. OOMKilled.", ns: "ai-workloads", time: "8m ago", fix: "Pod is being OOMKilled. Increase memory limits in the deployment spec: resources.limits.memory: 32Gi. Current value is likely too low for the batch size." },
  { id: 3, sev: "warning", title: "High GPU Temperature on gpu-node-03", msg: "GPU 2 temperature 79°C exceeds threshold of 75°C. Check cooling system.", ns: "monitoring", time: "15m ago", fix: "Reduce GPU clock speeds temporarily or reduce batch size for workloads on gpu-node-03. Verify datacenter cooling is operational." },
  { id: 4, sev: "warning", title: "PVC near capacity in training namespace", msg: "training-data-pvc is 87% full (435Gi / 500Gi). Workloads may fail if full.", ns: "training", time: "32m ago", fix: "Either expand the PVC (kubectl patch pvc training-data-pvc -p '{\"spec\":{\"resources\":{\"requests\":{\"storage\":\"1Ti\"}}}}') or clean up old checkpoints." },
  { id: 5, sev: "warning", title: "Etcd disk I/O latency high", msg: "etcd commit_duration_seconds p99 is 850ms. Healthy threshold is <200ms.", ns: "kube-system", time: "1h ago", fix: "High etcd latency typically indicates disk I/O contention. Verify etcd is on SSD/NVMe. Defragment etcd: etcdctl defrag --endpoints=https://127.0.0.1:2379." },
  { id: 6, sev: "info", title: "Kubernetes upgrade available", msg: "Cluster is running v1.29.3. v1.30.1 is now available.", ns: "kube-system", time: "2h ago", fix: "Plan upgrade during off-peak training hours. Upgrade control plane first, then worker nodes. Use: kubeadm upgrade plan." },
  { id: 7, sev: "info", title: "Deployment scaling event", msg: "inference-server scaled from 3 to 6 replicas due to high request volume.", ns: "inference", time: "3h ago", fix: "This is an auto-scaling event. Monitor if the scale-up was necessary and adjust HPA minReplicas if it happens frequently." },
];

const EVENTS_DATA = [
  { type: "Warning", reason: "NodeNotReady", obj: "Node/gpu-node-04", msg: "Node gpu-node-04 not ready", time: "2m ago" },
  { type: "Warning", reason: "BackOff", obj: "Pod/aiworkloads-trainer-0018", msg: "Back-off restarting failed container", time: "8m ago" },
  { type: "Normal", reason: "Pulling", obj: "Pod/inference-server-6d9f", msg: "Pulling image nvcr.io/nvidia/nemo:23.10", time: "12m ago" },
  { type: "Normal", reason: "Scaled", obj: "Deployment/inference-server", msg: "Scaled up replica set to 6", time: "3h ago" },
  { type: "Warning", reason: "FailedMount", obj: "Pod/training-job-0042", msg: "Unable to attach volume 'training-data-pvc'", time: "4h ago" },
  { type: "Normal", reason: "NodeReady", obj: "Node/gpu-node-07", msg: "Node gpu-node-07 status is now: NodeReady", time: "5h ago" },
  { type: "Normal", reason: "Scheduled", obj: "Pod/llm-inference-0001", msg: "Successfully assigned ai-workloads/llm-inference-0001 to gpu-node-05", time: "6h ago" },
  { type: "Warning", reason: "HighTemp", obj: "Node/gpu-node-03", msg: "GPU temperature exceeded threshold", time: "15m ago" },
];

const WORKLOADS_DATA = {
  deployments: [
    { name: "inference-server", ns: "inference", desired: 6, ready: 6, updated: 6, available: 6, age: "14d", image: "nvcr.io/nvidia/nemo:23.10" },
    { name: "monitoring-stack", ns: "monitoring", desired: 3, ready: 3, updated: 3, available: 3, age: "142d", image: "prometheus/prometheus:v2.48" },
    { name: "api-gateway", ns: "default", desired: 2, ready: 2, updated: 2, available: 2, age: "56d", image: "nginx:1.25" },
    { name: "model-registry", ns: "ai-workloads", desired: 1, ready: 1, updated: 1, available: 1, age: "28d", image: "mlflow/mlflow:2.9" },
    { name: "dataset-server", ns: "storage", desired: 2, ready: 1, updated: 2, available: 1, age: "8d", image: "minio/minio:RELEASE.2024" },
  ],
  statefulsets: [
    { name: "training-worker", ns: "training", desired: 8, ready: 8, age: "5d" },
    { name: "etcd-cluster", ns: "kube-system", desired: 3, ready: 3, age: "142d" },
    { name: "prometheus-db", ns: "monitoring", desired: 1, ready: 1, age: "142d" },
    { name: "distributed-trainer", ns: "ai-workloads", desired: 16, ready: 16, age: "3d" },
  ],
  daemonsets: [
    { name: "nvidia-device-plugin", ns: "kube-system", desired: 8, ready: 8, age: "142d" },
    { name: "node-exporter", ns: "monitoring", desired: 12, ready: 11, age: "142d" },
    { name: "calico-node", ns: "kube-system", desired: 12, ready: 12, age: "142d" },
    { name: "dcgm-exporter", ns: "monitoring", desired: 8, ready: 8, age: "98d" },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusColor = (s) => s === "Ready" || s === "Running" ? C.green : s === "Pending" ? C.amber : C.red;
const statusBg = (s) => s === "Ready" || s === "Running" ? "rgba(34,197,94,0.12)" : s === "Pending" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)";
const sevColor = (s) => s === "critical" ? C.red : s === "warning" ? C.amber : C.blue;
const sevBg = (s) => s === "critical" ? "rgba(239,68,68,0.1)" : s === "warning" ? "rgba(245,158,11,0.1)" : "rgba(56,189,248,0.1)";
const SevIcon = ({ s, size = 14 }) => s === "critical" ? <XCircle size={size} color={C.red} /> : s === "warning" ? <AlertTriangle size={size} color={C.amber} /> : <Info size={size} color={C.blue} />;
const Bar = ({ val, max = 100, color = C.blue, h = 4 }) => (
  <div style={{ background: C.border, borderRadius: 99, height: h, overflow: "hidden", minWidth: 60 }}>
    <div style={{ width: `${Math.min(val, max)}%`, height: "100%", background: val > 85 ? C.red : val > 70 ? C.amber : color, borderRadius: 99, transition: "width 0.4s" }} />
  </div>
);
const Badge = ({ label, color, bg }) => (
  <span style={{ background: bg || `${color}22`, color: color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, letterSpacing: "0.03em" }}>{label}</span>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ background: `${color}18`, borderRadius: 8, padding: 8 }}><Icon size={18} color={color} /></div>
      {trend && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: trend > 0 ? C.green : C.red }}>
        {trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{Math.abs(trend)}%
      </div>}
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.navy, border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: C.textDim, marginBottom: 6, fontFamily: "monospace" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", color: p.color }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
          <span style={{ color: C.textDim }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

// ─── Views ───────────────────────────────────────────────────────────────────
const DashboardView = ({ cluster, metrics }) => {
  const nodes = cluster.nodes;
  const readyNodes = nodes.filter(n => n.status === "Ready").length;
  const gpuNodes = nodes.filter(n => n.gpus > 0);
  const avgGpuUtil = Math.round(gpuNodes.reduce((a, n) => a + n.gpuUtil, 0) / gpuNodes.length);
  const totalGPUs = nodes.reduce((a, n) => a + n.gpus, 0);
  const healthScore = Math.round((readyNodes / nodes.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Cluster header */}
      <div style={{ background: `linear-gradient(135deg, ${C.card} 0%, ${C.navy} 100%)`, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, color: C.blue, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 4 }}>ACTIVE CLUSTER</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{cluster.flag} {cluster.name}</div>
          <div style={{ fontSize: 13, color: C.textDim, marginTop: 2 }}>{cluster.full} · {cluster.region} · k8s {cluster.version}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: healthScore >= 90 ? C.green : healthScore >= 70 ? C.amber : C.red, fontFamily: "monospace", lineHeight: 1 }}>{healthScore}<span style={{ fontSize: 20, color: C.textMuted }}>%</span></div>
          <div style={{ fontSize: 12, color: C.textMuted }}>Cluster Health</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <StatCard icon={Server} label="Total Nodes" value={nodes.length} sub={`${readyNodes} Ready · ${nodes.length - readyNodes} Not Ready`} color={C.blue} />
        <StatCard icon={Box} label="Running Pods" value={276} sub="Across 8 namespaces" color={C.green} trend={4} />
        <StatCard icon={Cpu} label="GPU Utilization" value={`${avgGpuUtil}%`} sub={`${totalGPUs} GPUs · ${gpuNodes.length} nodes`} color={C.purple} />
        <StatCard icon={Bell} label="Active Alerts" value={ALERTS_DATA.filter(a => a.sev === "critical" || a.sev === "warning").length} sub={`${ALERTS_DATA.filter(a => a.sev === "critical").length} Critical`} color={C.red} />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { key: "cpu", label: "CPU Usage", color: C.blue },
          { key: "gpu", label: "GPU Utilization", color: C.purple },
        ].map(({ key, label, color }) => (
          <div key={key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label} (24h)</span>
              <span style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "monospace" }}>{metrics[metrics.length - 1]?.[key]}%</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={metrics} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
                <defs>
                  <linearGradient id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="time" tick={{ fill: C.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey={key} name={label} stroke={color} strokeWidth={2} fill={`url(#g-${key})`} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Node grid + alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14 }}>
        {/* Node grid */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Node Health Matrix</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
            {nodes.map(n => (
              <div key={n.name} title={`${n.name}\n${n.status}\nCPU: ${n.cpu}%\nMem: ${n.mem}%`}
                style={{ aspectRatio: "1", background: statusColor(n.status) + "25", border: `1px solid ${statusColor(n.status)}55`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "default", position: "relative" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(n.status), boxShadow: n.status === "Ready" ? `0 0 6px ${statusColor(n.status)}` : "none" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            {[["Ready", C.green], ["NotReady", C.red], ["Cordoned", C.amber]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.textMuted }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Active Alerts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ALERTS_DATA.slice(0, 4).map(a => (
              <div key={a.id} style={{ background: sevBg(a.sev), border: `1px solid ${sevColor(a.sev)}33`, borderRadius: 8, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <SevIcon s={a.sev} size={14} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{a.ns} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(56,189,248,0.06) 100%)`, border: `1px solid rgba(168,85,247,0.25)`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Brain size={16} color={C.purple} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>AI Cluster Insights</span>
          <Badge label="AI-Powered" color={C.purple} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { icon: AlertTriangle, color: C.red, title: "Node Recovery Needed", body: "gpu-node-04 has been NotReady for 23 minutes. Estimated impact: 64 GPUs offline. Recommended: kubelet restart." },
            { icon: TrendingUp, color: C.amber, title: "Memory Pressure Detected", body: "gpu-node-03 and gpu-node-08 are >88% memory. Scale down batch sizes or schedule maintenance window." },
            { icon: Zap, color: C.green, title: "Optimization Opportunity", body: "GPU utilization is 87% avg. Consider using MIG (Multi-Instance GPU) partitioning to improve job scheduling efficiency." },
          ].map(({ icon: I, color, title, body }) => (
            <div key={title} style={{ background: C.navy, borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <I size={13} color={color} /><span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{title}</span>
              </div>
              <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NodesView = ({ cluster }) => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const nodes = cluster.nodes.filter(n => n.name.includes(search));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={14} color={C.textMuted} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search nodes…" style={{ background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, flex: 1 }} />
        </div>
        <Badge label={`${cluster.nodes.filter(n => n.status === "Ready").length}/${cluster.nodes.length} Ready`} color={C.green} />
        <Badge label={`${cluster.nodes.reduce((a, n) => a + n.gpus, 0)} GPUs`} color={C.purple} />
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.navy }}>
              {["Node", "Role", "Status", "CPU", "Memory", "GPU Util", "Pods", "Temp", "Age"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map((n, i) => (
              <>
                <tr key={n.name} onClick={() => setExpanded(expanded === n.name ? null : n.name)}
                  style={{ borderTop: `1px solid ${C.border}`, cursor: "pointer", background: expanded === n.name ? C.cardHover : "transparent", transition: "background 0.15s" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor(n.status), boxShadow: n.status === "Ready" ? `0 0 5px ${C.green}` : "none" }} />
                      <span style={{ color: C.text, fontFamily: "monospace", fontSize: 12 }}>{n.name}</span>
                      {expanded === n.name ? <ChevronDown size={12} color={C.textMuted} /> : <ChevronRight size={12} color={C.textMuted} />}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}><Badge label={n.role} color={n.role === "control-plane" ? C.cyan : C.blue} /></td>
                  <td style={{ padding: "10px 14px" }}><Badge label={n.status} color={statusColor(n.status)} bg={statusBg(n.status)} /></td>
                  <td style={{ padding: "10px 14px", minWidth: 100 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Bar val={n.cpu} color={C.blue} h={4} />
                      <span style={{ color: n.cpu > 85 ? C.red : C.textDim, fontFamily: "monospace", minWidth: 34 }}>{n.cpu}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", minWidth: 100 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Bar val={n.mem} color={C.teal} h={4} />
                      <span style={{ color: n.mem > 85 ? C.red : C.textDim, fontFamily: "monospace", minWidth: 34 }}>{n.mem}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", minWidth: 100 }}>
                    {n.gpus > 0 ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Bar val={n.gpuUtil} color={C.purple} h={4} />
                        <span style={{ color: n.gpuUtil > 95 ? C.amber : C.textDim, fontFamily: "monospace", minWidth: 34 }}>{n.gpuUtil}%</span>
                      </div>
                    ) : <span style={{ color: C.textMuted }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 14px", color: C.textDim, fontFamily: "monospace" }}>{n.pods}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ color: n.temp > 75 ? C.red : n.temp > 65 ? C.amber : C.textDim, fontFamily: "monospace" }}>{n.temp}°C</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: C.textMuted, fontFamily: "monospace" }}>{n.age}</td>
                </tr>
                {expanded === n.name && (
                  <tr key={`${n.name}-detail`} style={{ background: C.navy }}>
                    <td colSpan={9} style={{ padding: "14px 20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                        {[
                          ["IP Address", n.ip, C.textDim], ["GPU Model", n.gpuModel, C.purple],
                          ["GPU Count", n.gpus || "—", C.purple], ["Power Draw", n.gpus ? `${n.power}W` : "—", C.amber],
                          ["Architecture", "x86_64", C.textDim],
                        ].map(([label, val, col]) => (
                          <div key={label} style={{ background: C.card, borderRadius: 8, padding: "10px 14px", border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: 13, color: col, fontFamily: "monospace", fontWeight: 600 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PodsView = ({ clusterKey }) => {
  const [pods] = useState(() => generatePods(clusterKey));
  const [search, setSearch] = useState("");
  const [nsFilter, setNsFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = pods.filter(p =>
    (nsFilter === "All" || p.namespace === nsFilter) &&
    (statusFilter === "All" || p.status === statusFilter) &&
    (p.name.includes(search) || p.node.includes(search))
  );

  const statuses = ["All", "Running", "Pending", "CrashLoopBackOff"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200 }}>
          <Search size={14} color={C.textMuted} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pods or nodes…" style={{ background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, flex: 1 }} />
        </div>
        <select value={nsFilter} onChange={e => setNsFilter(e.target.value)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 12, outline: "none" }}>
          {["All", ...NAMESPACES].map(ns => <option key={ns} value={ns}>{ns}</option>)}
        </select>
        <div style={{ display: "flex", gap: 2, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", background: statusFilter === s ? C.blue : "transparent", color: statusFilter === s ? C.navy : C.textMuted, transition: "all 0.15s" }}>
              {s}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: C.textMuted }}>{filtered.length} pods</span>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", maxHeight: 460, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr style={{ background: C.navy }}>
              {["Pod", "Namespace", "Status", "Restarts", "CPU", "Memory", "Node", "Age"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 60).map(p => (
              <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "8px 14px" }}>
                  <span style={{ color: C.text, fontFamily: "monospace", fontSize: 11 }}>{p.name}</span>
                </td>
                <td style={{ padding: "8px 14px" }}><Badge label={p.namespace} color={C.cyan} /></td>
                <td style={{ padding: "8px 14px" }}><Badge label={p.status} color={statusColor(p.status)} bg={statusBg(p.status)} /></td>
                <td style={{ padding: "8px 14px", fontFamily: "monospace" }}>
                  <span style={{ color: p.restarts > 3 ? C.red : p.restarts > 0 ? C.amber : C.textMuted }}>{p.restarts}</span>
                </td>
                <td style={{ padding: "8px 14px", color: C.textDim, fontFamily: "monospace" }}>{p.cpu}</td>
                <td style={{ padding: "8px 14px", color: C.textDim, fontFamily: "monospace" }}>{p.mem}</td>
                <td style={{ padding: "8px 14px", color: C.textDim, fontFamily: "monospace", fontSize: 11 }}>{p.node}</td>
                <td style={{ padding: "8px 14px", color: C.textMuted, fontFamily: "monospace" }}>{p.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GPUView = ({ cluster }) => {
  const gpuNodes = cluster.nodes.filter(n => n.gpus > 0);
  const allGPUs = gpuNodes.flatMap(n =>
    Array.from({ length: n.gpus }, (_, i) => ({
      id: `${n.name}/gpu-${i}`, node: n.name, idx: i,
      util: Math.max(0, n.gpuUtil + (Math.random() - 0.5) * 20 | 0),
      vram: Math.max(10, n.mem + (Math.random() - 0.5) * 15 | 0),
      temp: n.temp + (Math.random() - 0.5) * 8 | 0,
      power: (n.power / n.gpus + (Math.random() - 0.5) * 100) | 0,
      model: n.gpuModel,
    }))
  );

  const gpuTimeData = Array.from({ length: 12 }, (_, i) => ({
    time: `${12 - i}h`,
    util: Math.floor(65 + Math.random() * 30),
    vram: Math.floor(70 + Math.random() * 20),
    temp: Math.floor(60 + Math.random() * 18),
  })).reverse();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Total GPUs", val: allGPUs.length, color: C.purple, icon: Cpu },
          { label: "Avg Utilization", val: `${Math.round(allGPUs.reduce((a, g) => a + g.util, 0) / allGPUs.length)}%`, color: C.blue, icon: Activity },
          { label: "Avg VRAM", val: `${Math.round(allGPUs.reduce((a, g) => a + g.vram, 0) / allGPUs.length)}%`, color: C.teal, icon: MemoryStick },
          { label: "Max Temp", val: `${Math.max(...allGPUs.map(g => g.temp))}°C`, color: C.amber, icon: Thermometer },
        ].map(({ label, val, color, icon: I }) => (
          <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: `${color}18`, borderRadius: 8, padding: 8 }}><I size={16} color={color} /></div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "monospace" }}>{val}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* GPU utilization chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>GPU Cluster Metrics (12h)</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={gpuTimeData} margin={{ top: 0, right: 10, bottom: 0, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="time" tick={{ fill: C.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="util" name="GPU Util" stroke={C.purple} strokeWidth={2} dot={false} />
            <Line dataKey="vram" name="VRAM" stroke={C.teal} strokeWidth={2} dot={false} strokeDasharray="4 2" />
            <Line dataKey="temp" name="Temp°C" stroke={C.amber} strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-GPU grid */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Per-GPU Metrics — {cluster.name}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {allGPUs.slice(0, 24).map(g => (
            <div key={g.id} style={{ background: C.navy, border: `1px solid ${g.util > 90 ? C.purple + "44" : C.border}`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>GPU:{g.idx}</span>
                <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>{g.node.split("-").slice(-1)[0]}</span>
              </div>
              {[["UTIL", g.util, C.purple], ["VRAM", g.vram, C.teal], ["TEMP", g.temp, C.amber, 100]].map(([lbl, val, col, maxVal]) => (
                <div key={lbl} style={{ marginBottom: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 9, color: C.textMuted }}>{lbl}</span>
                    <span style={{ fontSize: 9, fontFamily: "monospace", color: col }}>{val}{lbl === "TEMP" ? "°C" : "%"}</span>
                  </div>
                  <Bar val={lbl === "TEMP" ? (val / 90 * 100) : val} color={val > 85 ? C.red : col} h={3} />
                </div>
              ))}
              <div style={{ marginTop: 6, fontSize: 9, color: C.textMuted, display: "flex", justifyContent: "space-between" }}>
                <span>{g.model}</span><span style={{ color: C.amber }}>{g.power}W</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkloadsView = () => {
  const [tab, setTab] = useState("deployments");
  const data = WORKLOADS_DATA[tab];
  const headers = tab === "deployments"
    ? ["Name", "Namespace", "Desired", "Ready", "Updated", "Available", "Image", "Age"]
    : ["Name", "Namespace", "Desired", "Ready", "Age"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 2, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3, alignSelf: "flex-start" }}>
        {["deployments", "statefulsets", "daemonsets"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: tab === t ? C.blue : "transparent", color: tab === t ? C.navy : C.textMuted, textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.navy }}>
              {headers.map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 14px", color: C.text, fontFamily: "monospace", fontSize: 12 }}>{d.name}</td>
                <td style={{ padding: "10px 14px" }}><Badge label={d.ns} color={C.cyan} /></td>
                <td style={{ padding: "10px 14px", color: C.textDim, fontFamily: "monospace" }}>{d.desired}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ color: d.ready === d.desired ? C.green : C.amber, fontFamily: "monospace" }}>{d.ready}/{d.desired}</span>
                </td>
                {tab === "deployments" && <>
                  <td style={{ padding: "10px 14px", color: C.textDim, fontFamily: "monospace" }}>{d.updated}</td>
                  <td style={{ padding: "10px 14px", color: C.textDim, fontFamily: "monospace" }}>{d.available}</td>
                  <td style={{ padding: "10px 14px", color: C.textMuted, fontSize: 10, fontFamily: "monospace", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.image}</td>
                </>}
                <td style={{ padding: "10px 14px", color: C.textMuted, fontFamily: "monospace" }}>{d.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AlertsView = () => {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const alerts = filter === "all" ? ALERTS_DATA : ALERTS_DATA.filter(a => a.sev === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 2, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3, alignSelf: "flex-start" }}>
        {[["all", "All", null], ["critical", "Critical", C.red], ["warning", "Warning", C.amber], ["info", "Info", C.blue]].map(([v, l, c]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: filter === v ? (c || C.blue) : "transparent", color: filter === v ? "#fff" : C.textMuted }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {alerts.map(a => (
          <div key={a.id} style={{ background: C.card, border: `1px solid ${sevColor(a.sev)}33`, borderRadius: 10, overflow: "hidden" }}>
            <div onClick={() => setExpanded(expanded === a.id ? null : a.id)} style={{ padding: "14px 18px", display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}>
              <SevIcon s={a.sev} size={16} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.title}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{a.msg}</div>
              </div>
              <Badge label={a.ns} color={C.cyan} />
              <span style={{ fontSize: 11, color: C.textMuted, minWidth: 50 }}>{a.time}</span>
              {expanded === a.id ? <ChevronDown size={14} color={C.textMuted} /> : <ChevronRight size={14} color={C.textMuted} />}
            </div>
            {expanded === a.id && (
              <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 18px", background: C.navy }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Brain size={14} color={C.purple} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.purple, marginBottom: 6 }}>AI REMEDIATION SUGGESTION</div>
                    <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7, fontFamily: "monospace", background: C.card, borderRadius: 6, padding: "10px 12px", border: `1px solid ${C.border}` }}>{a.fix}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsView = () => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Cluster Events</span>
      <Badge label="Live Stream" color={C.green} />
    </div>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr style={{ background: C.navy }}>
          {["Type", "Reason", "Object", "Message", "Time"].map(h => (
            <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: "0.05em" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {EVENTS_DATA.map((e, i) => (
          <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
            <td style={{ padding: "10px 14px" }}><Badge label={e.type} color={e.type === "Warning" ? C.amber : C.green} /></td>
            <td style={{ padding: "10px 14px", color: C.textDim, fontFamily: "monospace" }}>{e.reason}</td>
            <td style={{ padding: "10px 14px", color: C.text, fontFamily: "monospace", fontSize: 11 }}>{e.obj}</td>
            <td style={{ padding: "10px 14px", color: C.textMuted, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.msg}</td>
            <td style={{ padding: "10px 14px", color: C.textMuted, fontFamily: "monospace" }}>{e.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AIAssistantView = ({ cluster }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `👋 Namaste! I'm your AI SRE assistant for **${cluster.name}**.\n\nI have full visibility into your cluster state — nodes, pods, GPU utilization, alerts, and workloads. Ask me anything about your cluster health, or get remediation advice for active issues.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const clusterSummary = `Cluster: ${cluster.name} (${cluster.full}), k8s ${cluster.version}. 
Nodes: ${cluster.nodes.length} total, ${cluster.nodes.filter(n => n.status === "Ready").length} ready.
NotReady nodes: ${cluster.nodes.filter(n => n.status !== "Ready").map(n => n.name).join(", ") || "none"}.
GPU nodes: ${cluster.nodes.filter(n => n.gpus > 0).length} nodes with ${cluster.nodes.reduce((a, n) => a + n.gpus, 0)} total ${cluster.nodes[0]?.gpuModel} GPUs.
Avg GPU utilization: ${Math.round(cluster.nodes.filter(n => n.gpus > 0).reduce((a, n) => a + n.gpuUtil, 0) / cluster.nodes.filter(n => n.gpus > 0).length)}%.
Active alerts: ${ALERTS_DATA.map(a => `[${a.sev}] ${a.title}`).join("; ")}.
Region: ${cluster.region}.`;

  const quickPrompts = [
    "What's causing the NotReady node?",
    "How can I improve GPU utilization?",
    "Explain the CrashLoopBackOff issue",
    "Suggest capacity planning for next month",
    "What's the risk of the current alerts?",
    "Best practices for AI training on K8s",
  ];

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const history = messages.filter(m => m.role !== "assistant" || !m.content.startsWith("👋")).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert Kubernetes SRE and AI infrastructure specialist for India's National AI Computing infrastructure. You have real-time access to the following cluster state:\n\n${clusterSummary}\n\nProvide concise, actionable responses. When suggesting kubectl commands, format them in code blocks. Focus on production reliability, GPU optimization, and HPC workload best practices. Keep responses focused and under 300 words unless deep analysis is requested.`,
          messages: [...history, { role: "user", content: msg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Unable to get response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ API connection error. In production mode, this will connect to your GPT-120B endpoint." }]);
    }
    setLoading(false);
  };

  const formatContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
        return <div key={i} style={{ background: "#020710", border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: C.green, marginTop: 8, marginBottom: 8, overflowX: "auto", whiteSpace: "pre" }}>{code}</div>;
      }
      return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part.replace(/\*\*(.*?)\*\*/g, "$1")}</span>;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", minHeight: 500 }}>
      <div style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(56,189,248,0.06) 100%)`, border: `1px solid rgba(168,85,247,0.3)`, borderRadius: 10, padding: "12px 18px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <Brain size={18} color={C.purple} />
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>AI SRE Assistant</span>
          <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 10 }}>Powered by claude-sonnet · Upgrade to GPT-120B for production</span>
        </div>
        <Badge label="Live Context" color={C.green} />
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {quickPrompts.map(q => (
          <button key={q} onClick={() => sendMessage(q)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "5px 12px", color: C.textDim, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>{q}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.role === "user" ? C.blue + "22" : C.purple + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {m.role === "user" ? <User size={14} color={C.blue} /> : <Bot size={14} color={C.purple} />}
            </div>
            <div style={{ maxWidth: "78%", background: m.role === "user" ? C.blueGlow : C.card, border: `1px solid ${m.role === "user" ? C.blue + "44" : C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: C.text, lineHeight: 1.7 }}>
              {formatContent(m.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.purple + "22", display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={14} color={C.purple} /></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 6, alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.purple, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 10, padding: "8px 12px" }}>
        <Terminal size={14} color={C.textMuted} style={{ marginTop: 6, flexShrink: 0 }} />
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder={`Ask about ${cluster.name} cluster… (press Enter)`}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13 }} />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ background: input.trim() ? C.blue : C.border, border: "none", borderRadius: 6, padding: "6px 12px", cursor: input.trim() ? "pointer" : "default", color: C.navy, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
          <Send size={12} />{loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [demoMode, setDemoMode] = useState(true);
  const [clusterKey, setClusterKey] = useState("airawat");
  const [view, setView] = useState("dashboard");
  const [metrics] = useState(generateMetrics);
  const [alertCount] = useState(ALERTS_DATA.filter(a => a.sev === "critical").length);

  const cluster = CLUSTERS[clusterKey];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "nodes", label: "Nodes", icon: Server },
    { id: "pods", label: "Pods", icon: Box },
    { id: "workloads", label: "Workloads", icon: Layers },
    { id: "gpu", label: "GPU Monitor", icon: Cpu, accent: true },
    { id: "alerts", label: "Alerts", icon: Bell, badge: alertCount },
    { id: "events", label: "Events", icon: Activity },
    { id: "debug", label: "Pod Debugger", icon: Bug, accent: true },
    { id: "ai", label: "AI Assistant", icon: Brain, accent: true },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', -apple-system, sans-serif", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: ${C.border} transparent; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        input::placeholder { color: ${C.textMuted}; }
        select option { background: ${C.card}; color: ${C.text}; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: C.panel, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, padding: "0 0 16px" }}>
        {/* Logo */}
        <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MonitorCheck size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>K8s AI Ops</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>CDAC · NSM Platform</div>
            </div>
          </div>
        </div>

        {/* Cluster selector */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.1em", marginBottom: 6 }}>SELECT CLUSTER</div>
          {Object.entries(CLUSTERS).map(([key, c]) => (
            <button key={key} onClick={() => setClusterKey(key)}
              style={{ width: "100%", padding: "7px 10px", borderRadius: 7, border: `1px solid ${clusterKey === key ? C.blue : "transparent"}`, background: clusterKey === key ? C.blueGlow : "transparent", cursor: "pointer", marginBottom: 3, display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "blink 2s ease-in-out infinite" }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: clusterKey === key ? C.blue : C.text }}>{c.name}</div>
                <div style={{ fontSize: 9, color: C.textMuted }}>{c.nodes.length} nodes</div>
              </div>
            </button>
          ))}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {navItems.map(({ id, label, icon: Icon, badge, accent }) => (
            <button key={id} onClick={() => setView(id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", marginBottom: 2, cursor: "pointer", background: view === id ? (accent ? `${C.purple}22` : C.blueGlow) : "transparent", color: view === id ? (accent ? C.purple : C.blue) : C.textMuted, fontSize: 13, fontWeight: view === id ? 600 : 400, textAlign: "left", transition: "all 0.15s" }}>
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge > 0 && <span style={{ background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "10px", padding: "1px 6px" }}>{badge}</span>}
              {accent && !badge && <Sparkles size={11} color={accent ? C.purple : C.blue} />}
            </button>
          ))}
        </nav>

        {/* Demo toggle */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ background: demoMode ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${demoMode ? C.amber + "44" : C.green + "44"}`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>DATA SOURCE</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: demoMode ? C.amber : C.green, fontWeight: 600 }}>{demoMode ? "🟡 Demo Mode" : "🟢 Live API"}</span>
              <button onClick={() => setDemoMode(!demoMode)} style={{ background: demoMode ? C.amber : C.green, border: "none", borderRadius: 20, cursor: "pointer", padding: "3px 10px", fontSize: 10, fontWeight: 700, color: "#000" }}>
                {demoMode ? "DEMO" : "LIVE"}
              </button>
            </div>
            {!demoMode && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>Connect your K8s API endpoint in Settings</div>}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text, textTransform: "capitalize" }}>
              {navItems.find(n => n.id === view)?.label}
            </span>
            <span style={{ fontSize: 11, color: C.textMuted }}>· {cluster.name}</span>
            {demoMode && <Badge label="DEMO DATA" color={C.amber} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {cluster.nodes.filter(n => n.status !== "Ready").length > 0 && (
                <Badge label={`${cluster.nodes.filter(n => n.status !== "Ready").length} Node Down`} color={C.red} />
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.green }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "blink 1.5s ease-in-out infinite" }} />
              API Connected
            </div>
            <button onClick={() => {}} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: C.textMuted, display: "flex", alignItems: "center" }}>
              <RefreshCw size={13} />
            </button>
            <button style={{ position: "relative", background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: C.textMuted, display: "flex", alignItems: "center" }}>
              <Bell size={13} />
              {alertCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: C.red, width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>{alertCount}</span>}
            </button>
            <button style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: C.textMuted, display: "flex", alignItems: "center" }}>
              <Settings size={13} />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {view === "dashboard" && <DashboardView cluster={cluster} metrics={metrics} />}
          {view === "nodes" && <NodesView cluster={cluster} />}
          {view === "pods" && <PodsView clusterKey={clusterKey} />}
          {view === "workloads" && <WorkloadsView />}
          {view === "gpu" && <GPUView cluster={cluster} />}
          {view === "alerts" && <AlertsView />}
          {view === "events" && <EventsView />}
          {view === "ai" && <AIAssistantView cluster={cluster} />}
          {view === "debug" && <PodDebugger />}
        </div>
      </div>
    </div>
  );
}