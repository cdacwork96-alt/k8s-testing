import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Bug, FileText, Brain, Zap, CheckCircle, AlertTriangle,
  XCircle, ChevronRight, ChevronDown, Terminal, Send, Bot, User,
  RefreshCw, Download, Copy, Layers, Database, Cpu, MemoryStick,
  Network, Clock, ArrowRight, Sparkles, Info, Play, Loader,
  BarChart2, Shield, AlertCircle, Hash, Filter, Box
} from "lucide-react";

// ─── Colors (matches main app) ───────────────────────────────────────────────
const C = {
  bg: "#030912", panel: "#07111F", card: "#0C1D30", cardHover: "#0F2236",
  border: "#1B3A5C", borderLight: "#254D78",
  blue: "#38BDF8", blueDim: "#1E6A9A", blueGlow: "rgba(56,189,248,0.12)",
  green: "#22C55E", amber: "#F59E0B", red: "#EF4444",
  purple: "#A855F7", cyan: "#06B6D4", teal: "#14B8A6", orange: "#F97316",
  text: "#E2E8F0", textMuted: "#64748B", textDim: "#94A3B8", navy: "#0A1628",
};

// ─── Demo Pod List ───────────────────────────────────────────────────────────
const DEMO_PODS = [
  { name: "aiworkloads-trainer-0018", ns: "ai-workloads", status: "CrashLoopBackOff", node: "gpu-node-03", restarts: 7, age: "2h", type: "oom" },
  { name: "inference-server-6d9f4b", ns: "inference", status: "Running", node: "gpu-node-05", restarts: 0, age: "14d", type: "healthy" },
  { name: "training-job-0042", ns: "training", status: "Pending", node: "—", restarts: 0, age: "23m", type: "pending" },
  { name: "distributed-trainer-7", ns: "ai-workloads", status: "CrashLoopBackOff", node: "gpu-node-01", restarts: 3, age: "45m", type: "cuda" },
  { name: "dataset-server-d89c", ns: "storage", status: "Running", node: "cpu-node-01", restarts: 1, age: "8d", type: "healthy" },
  { name: "llm-inference-0001", ns: "ai-workloads", status: "Running", node: "gpu-node-06", restarts: 0, age: "6h", type: "healthy" },
  { name: "monitoring-prom-0", ns: "monitoring", status: "Running", node: "cpu-node-02", restarts: 0, age: "142d", type: "healthy" },
  { name: "calico-node-xk9p2", ns: "kube-system", status: "Running", node: "gpu-node-04", restarts: 2, age: "142d", type: "network" },
  { name: "etcd-ctrl-node-01", ns: "kube-system", status: "Running", node: "ctrl-node-01", restarts: 0, age: "142d", type: "healthy" },
  { name: "nemo-finetuner-001", ns: "training", status: "CrashLoopBackOff", node: "gpu-node-08", restarts: 5, age: "1h", type: "gpu" },
];

// ─── Demo Log Templates ──────────────────────────────────────────────────────
const LOG_TEMPLATES = {
  oom: `2024-01-15T18:02:01.123Z INFO  [trainer] Starting distributed PyTorch training job
2024-01-15T18:02:01.456Z INFO  [trainer] Config: batch_size=512, lr=0.001, epochs=100, model=LLaMA-70B
2024-01-15T18:02:02.001Z INFO  [trainer] Loading dataset from /data/training/pile-v2 (2.3TB)
2024-01-15T18:02:05.234Z INFO  [trainer] Initializing NCCL distributed backend, world_size=8
2024-01-15T18:02:06.112Z INFO  [nccl] NCCL version 2.18.5+cuda12.2
2024-01-15T18:02:06.890Z INFO  [trainer] Model loaded on GPU:0 (A100-80GB) - 70B parameters
2024-01-15T18:02:08.003Z INFO  [trainer] Starting epoch 1/100, steps=45000
2024-01-15T18:02:10.445Z INFO  [trainer] Step 100/45000 | loss=3.421 | lr=1e-4 | gpu_mem=68.2GB/80GB
2024-01-15T18:02:15.891Z INFO  [trainer] Step 200/45000 | loss=3.198 | lr=1e-4 | gpu_mem=72.1GB/80GB
2024-01-15T18:02:22.334Z WARNING [trainer] GPU memory utilization at 89% - approaching limit
2024-01-15T18:02:28.112Z INFO  [trainer] Step 300/45000 | loss=2.987 | lr=1e-4 | gpu_mem=77.4GB/80GB
2024-01-15T18:02:35.789Z WARNING [trainer] GPU memory utilization at 96% - critical level
2024-01-15T18:02:41.002Z ERROR  [trainer] CUDA out of memory. Tried to allocate 4.50 GiB (GPU 0; 79.20 GiB total capacity; 74.80 GiB already allocated; 2.12 GiB free; 76.11 GiB reserved)
2024-01-15T18:02:41.003Z ERROR  [trainer] RuntimeError: CUDA out of memory
  File "/opt/conda/lib/python3.10/site-packages/torch/nn/modules/module.py", line 1501, in _call_impl
  File "/workspace/train.py", line 284, in forward
    output = self.model(input_ids, attention_mask=attention_mask)
  File "/workspace/models/llama.py", line 492, in forward
    hidden_states = layer(hidden_states, attention_mask)
torch.cuda.OutOfMemoryError: CUDA out of memory
2024-01-15T18:02:41.112Z ERROR  [k8s] OOMKilled: container trainer exceeded memory limit
2024-01-15T18:02:41.445Z INFO  [k8s] Container exiting with code 137 (SIGKILL)
2024-01-15T18:03:15.001Z INFO  [trainer] Starting distributed PyTorch training job [RESTART #1]
2024-01-15T18:03:20.334Z ERROR  [trainer] CUDA out of memory. Same error on restart.
2024-01-15T18:03:20.445Z INFO  [k8s] Container exiting with code 137 (SIGKILL) [RESTART #2]`,

  cuda: `2024-01-15T17:15:00.001Z INFO  [nemo] NeMo Framework v1.21.0 starting
2024-01-15T17:15:01.334Z INFO  [nemo] Loading model config: gpt3-5b-config.yaml
2024-01-15T17:15:02.001Z INFO  [nemo] Initializing CUDA device: GPU:0 A100-80GB
2024-01-15T17:15:03.445Z INFO  [nemo] Loading pretrained checkpoint from /checkpoints/gpt3-5b-step-80000
2024-01-15T17:15:08.778Z INFO  [nemo] Checkpoint loaded successfully (22.3GB)
2024-01-15T17:15:09.001Z INFO  [nemo] Building optimizer: FusedAdam(lr=5e-5, betas=[0.9, 0.98])
2024-01-15T17:15:09.334Z ERROR [nemo] CUDA error: device-side assert triggered
2024-01-15T17:15:09.335Z ERROR [nemo]   CUDA kernel errors might be asynchronously reported at some other API call
2024-01-15T17:15:09.336Z ERROR [nemo] RuntimeError: CUDA error: device-side assert triggered
2024-01-15T17:15:09.338Z ERROR [nemo] Traceback (most recent call last):
  File "/opt/nemo/examples/nlp/language_modeling/megatron_gpt_pretraining.py", line 98
    trainer.fit(model)
  File "/opt/conda/lib/python3.10/site-packages/pytorch_lightning/trainer/trainer.py", line 685
    self._fit_impl(model, train_dataloaders, val_dataloaders, datamodule, ckpt_path)
  File "/opt/nemo/nemo/collections/nlp/models/language_modeling/megatron_gpt_model.py", line 512
    loss = self.fwd_bwd_step(dataloader_iter, False)
RuntimeError: CUDA error: device-side assert triggered
2024-01-15T17:15:09.450Z ERROR [nemo] Vocabulary index out of bounds: token_id=50259 exceeds vocab_size=50257
2024-01-15T17:15:09.451Z ERROR [nemo] Check tokenizer config — likely mismatch between tokenizer vocab and model embedding layer
2024-01-15T17:15:09.512Z INFO  [k8s] Container exiting with code 1`,

  network: `2024-01-15T16:30:00.001Z INFO  [calico] Calico node v3.26.3 starting
2024-01-15T16:30:01.112Z INFO  [calico] Loading config from /etc/calico/calicoctl.cfg
2024-01-15T16:30:01.445Z INFO  [calico] Datastore type: kubernetes
2024-01-15T16:30:02.001Z INFO  [felix] Felix starting
2024-01-15T16:30:02.334Z WARNING [felix] CNI config file /etc/cni/net.d/10-calico.conflist not found, retrying...
2024-01-15T16:30:07.445Z WARNING [felix] CNI config file still missing after 5s
2024-01-15T16:30:10.001Z ERROR  [felix] Failed to connect to Kubernetes API server
  URL: https://10.0.0.10:6443
  Error: dial tcp 10.0.0.10:6443: connect: connection refused
2024-01-15T16:30:15.334Z ERROR  [felix] BIRD route reflector connection failed: dial tcp 10.0.0.10:179 i/o timeout
2024-01-15T16:30:20.001Z ERROR  [felix] Failed to set up IP tables rules: exit status 4
2024-01-15T16:30:20.112Z WARNING [calico] Node network not ready. Pod networking will be degraded.
2024-01-15T16:30:25.334Z ERROR  [calico] WireGuard tunnel failed to initialize on interface wg.calico
2024-01-15T16:30:30.001Z INFO  [calico] Attempting recovery...`,

  gpu: `2024-01-15T19:00:01.001Z INFO  [finetuner] NeMo Fine-tuning job starting
2024-01-15T19:00:01.334Z INFO  [finetuner] Target model: llama-2-70b-chat, task: instruction-tuning
2024-01-15T19:00:02.001Z INFO  [finetuner] Checking GPU availability...
2024-01-15T19:00:02.445Z ERROR [finetuner] nvidia-smi error: Failed to initialize NVML: Driver/library version mismatch
2024-01-15T19:00:02.446Z ERROR [finetuner] NVML: Driver Version: 525.105.17 | CUDA Driver Version: 12.0
2024-01-15T19:00:02.447Z ERROR [finetuner] NVML: Library Version: 535.54.03 | Expected >=525
2024-01-15T19:00:02.500Z ERROR [finetuner] torch.cuda.is_available() returned False
2024-01-15T19:00:02.501Z ERROR [finetuner] No CUDA-capable GPU detected. Cannot initialize distributed training.
2024-01-15T19:00:02.502Z CRITICAL [finetuner] Fatal: GPU initialization failed. Check nvidia-device-plugin DaemonSet status.
2024-01-15T19:00:02.503Z INFO  [k8s] Container exiting with code 1`,

  pending: `[Pod is in Pending state — no logs available yet]
Scheduling events:
  Warning  FailedScheduling  23m   default-scheduler  0/12 nodes are available:
    8 Insufficient nvidia.com/gpu (requested: 8, available: 0-3 per node)
    4 node(s) had untolerated taint {node-role.kubernetes.io/control-plane: ""}
  Warning  FailedScheduling  18m   default-scheduler  0/12 nodes are available: 8 Insufficient nvidia.com/gpu
  Normal   NotTriggerScaleUp  23m  cluster-autoscaler  pod didn't trigger scale-up: 1 Insufficient gpu quota`,

  healthy: `2024-01-15T20:00:01.001Z INFO  [server] Service starting on port 8080
2024-01-15T20:00:01.334Z INFO  [server] Health check endpoint: /healthz
2024-01-15T20:00:02.001Z INFO  [server] Connected to model registry at model-registry:5000
2024-01-15T20:00:02.445Z INFO  [server] Loaded model: llama-2-70b-chat-q4 (42.5GB)
2024-01-15T20:00:05.001Z INFO  [server] GPU warmup complete. Ready to serve requests.
2024-01-15T20:00:05.334Z INFO  [server] Listening for connections...
2024-01-15T20:10:15.001Z INFO  [server] Request completed: tokens=512, latency=1.2s, model=llama-2-70b
2024-01-15T20:15:22.334Z INFO  [server] Request completed: tokens=1024, latency=2.1s, model=llama-2-70b
2024-01-15T20:20:00.001Z INFO  [health] Health check OK - all systems nominal`,
};

// ─── RAG Analysis Presets ─────────────────────────────────────────────────────
const ANALYSIS_PRESETS = {
  oom: {
    rootCause: "CUDA Out of Memory — batch_size=512 exceeds A100-80GB capacity for LLaMA-70B",
    confidence: 97,
    category: "Resource Exhaustion",
    severity: "critical",
    errorLine: "torch.cuda.OutOfMemoryError: CUDA out of memory",
    timeline: [
      { time: "18:02:22", sev: "warning", msg: "GPU memory at 89% — approaching limit" },
      { time: "18:02:35", sev: "warning", msg: "GPU memory at 96% — critical level" },
      { time: "18:02:41", sev: "critical", msg: "OOMKilled: CUDA out of memory (4.50 GiB needed, 2.12 GiB free)" },
      { time: "18:02:41", sev: "critical", msg: "Container exited with code 137 (SIGKILL)" },
    ],
    fixes: [
      { priority: 1, title: "Reduce batch size", cmd: "# Edit your training config:\nbatch_size: 128  # down from 512\ngradient_accumulation_steps: 4  # maintain effective batch", impact: "Immediate fix, ~75% memory reduction", effort: "Low" },
      { priority: 2, title: "Enable gradient checkpointing", cmd: "# Add to your model init:\nmodel.gradient_checkpointing_enable()\n# Or in config.yaml:\nactivation_checkpointing: true", impact: "30-40% memory reduction at ~20% speed cost", effort: "Low" },
      { priority: 3, title: "Increase pod memory limit", cmd: "kubectl patch deployment aiworkloads-trainer -n ai-workloads -p \\\n'{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"trainer\",\"resources\":{\"limits\":{\"memory\":\"320Gi\"}}}]}}}}'", impact: "Provides more system RAM buffer for CUDA allocator", effort: "Medium" },
      { priority: 4, title: "Use model parallelism (tensor parallel)", cmd: "# In config.yaml:\ntensor_model_parallel_size: 2  # split model across 2 GPUs\npipeline_model_parallel_size: 4", impact: "Distributes 70B model across multiple GPUs", effort: "High" },
    ],
    affectedComponents: ["PyTorch CUDA allocator", "Training loop", "GPU memory manager"],
    relatedDocs: ["https://pytorch.org/docs/stable/notes/cuda.html#memory-management", "https://huggingface.co/docs/transformers/v4.20.0/en/perf_train_gpu_one"],
  },
  cuda: {
    rootCause: "Tokenizer vocab mismatch — token_id=50259 exceeds vocab_size=50257 in model embedding layer",
    confidence: 94,
    category: "Configuration Error",
    severity: "critical",
    errorLine: "RuntimeError: CUDA error: device-side assert triggered",
    timeline: [
      { time: "17:15:09", sev: "critical", msg: "CUDA device-side assert triggered in embedding layer" },
      { time: "17:15:09", sev: "critical", msg: "Vocabulary index out of bounds: token_id=50259 > vocab_size=50257" },
      { time: "17:15:09", sev: "critical", msg: "Container exited with code 1" },
    ],
    fixes: [
      { priority: 1, title: "Align tokenizer with model vocab size", cmd: "# Check tokenizer vocab size:\npython -c \"from transformers import AutoTokenizer; t=AutoTokenizer.from_pretrained('/checkpoints/gpt3-5b-step-80000'); print(len(t))\"\n\n# Should match model config vocab_size: 50257", impact: "Root cause fix — resolves the crash permanently", effort: "Low" },
      { priority: 2, title: "Add vocab size assertion in training script", cmd: "assert tokenizer.vocab_size == model.config.vocab_size, \\\n  f\"Tokenizer vocab ({tokenizer.vocab_size}) != model vocab ({model.config.vocab_size})\"", impact: "Prevents silent vocab mismatch in future runs", effort: "Low" },
    ],
    affectedComponents: ["NeMo tokenizer", "GPT3 embedding layer", "CUDA kernel"],
    relatedDocs: ["https://docs.nvidia.com/nemo-framework/user-guide/latest/nlp/nemo_megatron/gpt/gpt_training.html"],
  },
  network: {
    rootCause: "Calico CNI plugin failing due to API server connectivity loss and NVML driver mismatch on gpu-node-04",
    confidence: 88,
    category: "Network / Infrastructure",
    severity: "warning",
    errorLine: "Failed to connect to Kubernetes API server: connection refused",
    timeline: [
      { time: "16:30:02", sev: "warning", msg: "CNI config file not found" },
      { time: "16:30:10", sev: "critical", msg: "Kubernetes API server unreachable at 10.0.0.10:6443" },
      { time: "16:30:15", sev: "critical", msg: "BIRD route reflector connection timeout" },
      { time: "16:30:20", sev: "critical", msg: "iptables rules setup failed" },
    ],
    fixes: [
      { priority: 1, title: "Verify API server reachability from node", cmd: "# SSH into gpu-node-04 and run:\ncurl -k https://10.0.0.10:6443/healthz\n# If timeout: check firewall rules between node and control plane", impact: "Diagnoses root network connectivity issue", effort: "Low" },
      { priority: 2, title: "Restart Calico node DaemonSet pod", cmd: "kubectl delete pod calico-node-xk9p2 -n kube-system\n# DaemonSet will automatically recreate it", impact: "Forces fresh CNI config regeneration", effort: "Low" },
      { priority: 3, title: "Check and repair iptables rules", cmd: "# On gpu-node-04:\nsudo iptables -F && sudo iptables -X\nsudo systemctl restart kubelet\nsudo systemctl restart containerd", impact: "Clears corrupt iptables state", effort: "Medium" },
    ],
    affectedComponents: ["Calico Felix", "kube-apiserver", "iptables", "BIRD BGP"],
    relatedDocs: [],
  },
  gpu: {
    rootCause: "NVIDIA driver/library version mismatch — host driver 525.x but container library expects 535.x",
    confidence: 99,
    category: "Driver Mismatch",
    severity: "critical",
    errorLine: "Failed to initialize NVML: Driver/library version mismatch",
    timeline: [
      { time: "19:00:02", sev: "critical", msg: "NVML init failed: driver 525 vs library 535 mismatch" },
      { time: "19:00:02", sev: "critical", msg: "torch.cuda.is_available() = False" },
      { time: "19:00:02", sev: "critical", msg: "Container exited with code 1" },
    ],
    fixes: [
      { priority: 1, title: "Update NVIDIA driver on gpu-node-08 to match container", cmd: "# On gpu-node-08 (requires maintenance window):\nsudo apt-get install -y nvidia-driver-535\nsudo reboot\n\n# Verify after reboot:\nnvidia-smi | grep 'Driver Version'", impact: "Permanent fix — aligns host driver with container expectation", effort: "Medium" },
      { priority: 2, title: "Pin container image to match current driver", cmd: "# Change image tag in your deployment to match 525.x driver:\nimage: nvcr.io/nvidia/nemo:23.08  # compatible with driver 525\n# Instead of nemo:23.10 which requires 535+", impact: "Quick workaround without node maintenance", effort: "Low" },
      { priority: 3, title: "Cordon node until driver is updated", cmd: "kubectl cordon gpu-node-08\n# After driver update and reboot:\nkubectl uncordon gpu-node-08", impact: "Prevents further scheduling failures on this node", effort: "Low" },
    ],
    affectedComponents: ["nvidia-device-plugin", "NVML", "CUDA runtime", "nvidia-container-toolkit"],
    relatedDocs: [],
  },
  healthy: {
    rootCause: "No issues detected — pod is running normally",
    confidence: 100,
    category: "Healthy",
    severity: "info",
    errorLine: null,
    timeline: [
      { time: "20:00:01", sev: "info", msg: "Service started successfully on port 8080" },
      { time: "20:00:05", sev: "info", msg: "GPU warmup complete. Ready to serve." },
    ],
    fixes: [],
    affectedComponents: [],
    relatedDocs: [],
  },
  pending: {
    rootCause: "Pod stuck in Pending — insufficient GPU resources. All GPU nodes are at capacity.",
    confidence: 96,
    category: "Resource Quota",
    severity: "warning",
    errorLine: "0/12 nodes available: 8 Insufficient nvidia.com/gpu",
    timeline: [
      { time: "23m ago", sev: "warning", msg: "Scheduler: 0/12 nodes available — Insufficient GPU" },
      { time: "18m ago", sev: "warning", msg: "Still unscheduled — no GPU capacity freed" },
    ],
    fixes: [
      { priority: 1, title: "Check current GPU allocation", cmd: "kubectl get pods -A -o json | jq '.items[].spec.containers[].resources.limits[\"nvidia.com/gpu\"] // empty' | sort | uniq -c", impact: "Identifies which jobs are consuming GPU quota", effort: "Low" },
      { priority: 2, title: "Evict lower-priority jobs to free GPUs", cmd: "# List pods with GPU resources sorted by priority:\nkubectl get pods -n ai-workloads -o wide\n\n# Evict a lower-priority job:\nkubectl delete pod <lower-priority-pod> -n ai-workloads", impact: "Frees GPU slots for this pending pod", effort: "Medium" },
    ],
    affectedComponents: ["kube-scheduler", "nvidia-device-plugin", "resource quotas"],
    relatedDocs: [],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const StatusDot = ({ s }) => {
  const col = s === "Running" ? C.green : s === "Pending" ? C.amber : C.red;
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: col, boxShadow: s === "Running" ? `0 0 5px ${col}` : "none", flexShrink: 0 }} />;
};

const Badge = ({ label, color, bg }) => (
  <span style={{ background: bg || `${color}20`, color, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{label}</span>
);

const SevIcon = ({ s, size = 13 }) => {
  if (s === "critical") return <XCircle size={size} color={C.red} />;
  if (s === "warning") return <AlertTriangle size={size} color={C.amber} />;
  return <Info size={size} color={C.blue} />;
};

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ position: "relative", background: "#020710", border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      <button onClick={copy} style={{ position: "absolute", top: 8, right: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 5, padding: "3px 8px", cursor: "pointer", color: copied ? C.green : C.textMuted, fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
        <Copy size={9} />{copied ? "Copied!" : "Copy"}
      </button>
      <pre style={{ padding: "14px 16px", margin: 0, fontSize: 11, color: C.green, fontFamily: "monospace", overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre" }}>{code}</pre>
    </div>
  );
};

// ─── RAG Pipeline Steps Component ────────────────────────────────────────────
const RAGPipeline = ({ step, stats }) => {
  const steps = [
    { id: 1, icon: FileText, label: "Fetch Logs", detail: step >= 1 ? `${stats.lines} lines ingested` : "Waiting…" },
    { id: 2, icon: Layers, label: "Chunk & Index", detail: step >= 2 ? `${stats.chunks} chunks · ${stats.tokens} tokens` : "Waiting…" },
    { id: 3, icon: Search2, label: "Extract Signals", detail: step >= 3 ? `${stats.errors} errors · ${stats.warnings} warnings` : "Waiting…" },
    { id: 4, icon: Database, label: "Context Build", detail: step >= 4 ? `Top-${stats.topK} relevant chunks retrieved` : "Waiting…" },
    { id: 5, icon: Brain, label: "LLM Analysis", detail: step >= 5 ? "Root cause identified ✓" : "Waiting…" },
  ];

  function Search2({ size, color }) {
    return <Search size={size} color={color} />;
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim, marginBottom: 14, letterSpacing: "0.06em" }}>RAG PIPELINE</div>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {steps.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          const Icon = s.icon;
          const col = done ? C.green : active ? C.blue : C.textMuted;
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? `${C.green}20` : active ? `${C.blue}20` : `${C.border}44`, border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s", position: "relative" }}>
                  {active && <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `2px solid ${C.blue}`, animation: "ping 1.2s ease-out infinite", opacity: 0.5 }} />}
                  {done ? <CheckCircle size={16} color={C.green} /> : active ? <Loader size={16} color={C.blue} style={{ animation: "spin 1s linear infinite" }} /> : <Icon size={15} color={C.textMuted} />}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: col, whiteSpace: "nowrap" }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2, whiteSpace: "nowrap" }}>{s.detail}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ height: 2, width: 20, background: done ? C.green : C.border, transition: "background 0.4s", flexShrink: 0, marginBottom: 22 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Analysis Report Component ────────────────────────────────────────────────
const AnalysisReport = ({ analysis, pod }) => {
  const [expandedFix, setExpandedFix] = useState(0);
  const sevColor = analysis.severity === "critical" ? C.red : analysis.severity === "warning" ? C.amber : C.green;
  const sevBg = analysis.severity === "critical" ? "rgba(239,68,68,0.08)" : analysis.severity === "warning" ? "rgba(245,158,11,0.08)" : "rgba(34,197,94,0.08)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Root Cause Card */}
      <div style={{ background: sevBg, border: `1px solid ${sevColor}33`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Brain size={16} color={C.purple} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: "0.08em" }}>ROOT CAUSE ANALYSIS</span>
              <Badge label={analysis.category} color={sevColor} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.5, marginBottom: 8 }}>{analysis.rootCause}</div>
            {analysis.errorLine && (
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.red, background: "rgba(239,68,68,0.08)", padding: "6px 10px", borderRadius: 6, border: `1px solid rgba(239,68,68,0.2)` }}>
                ❯ {analysis.errorLine}
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: analysis.confidence > 90 ? C.green : C.amber, fontFamily: "monospace", lineHeight: 1 }}>{analysis.confidence}<span style={{ fontSize: 14, color: C.textMuted }}>%</span></div>
            <div style={{ fontSize: 10, color: C.textMuted }}>Confidence</div>
          </div>
        </div>

        {/* Affected components */}
        {analysis.affectedComponents.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: C.textMuted }}>Affected:</span>
            {analysis.affectedComponents.map(c => <Badge key={c} label={c} color={C.cyan} />)}
          </div>
        )}
      </div>

      {/* Error Timeline */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim, marginBottom: 12, letterSpacing: "0.06em" }}>ERROR TIMELINE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {analysis.timeline.map((t, i) => {
            const col = t.sev === "critical" ? C.red : t.sev === "warning" ? C.amber : C.blue;
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", position: "relative", paddingBottom: i < analysis.timeline.length - 1 ? 12 : 0 }}>
                {i < analysis.timeline.length - 1 && (
                  <div style={{ position: "absolute", left: 6, top: 16, width: 1, height: "calc(100% - 4px)", background: C.border }} />
                )}
                <div style={{ width: 13, height: 13, borderRadius: "50%", background: `${col}25`, border: `2px solid ${col}`, flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: C.textMuted, marginRight: 8 }}>{t.time}</span>
                  <span style={{ fontSize: 12, color: t.sev === "critical" ? C.text : C.textDim }}>{t.msg}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fix Recommendations */}
      {analysis.fixes.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim, marginBottom: 12, letterSpacing: "0.06em" }}>FIX RECOMMENDATIONS — PRIORITY ORDER</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {analysis.fixes.map((fix, i) => (
              <div key={i} style={{ border: `1px solid ${expandedFix === i ? C.blue + "55" : C.border}`, borderRadius: 8, overflow: "hidden", background: expandedFix === i ? C.blueGlow : "transparent" }}>
                <div onClick={() => setExpandedFix(expandedFix === i ? -1 : i)}
                  style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: i === 0 ? `${C.green}20` : `${C.blue}15`, border: `1px solid ${i === 0 ? C.green : C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? C.green : C.blue }}>{fix.priority}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{fix.title}</span>
                    <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 8 }}>{fix.impact}</span>
                  </div>
                  <Badge label={`Effort: ${fix.effort}`} color={fix.effort === "Low" ? C.green : fix.effort === "Medium" ? C.amber : C.red} />
                  {expandedFix === i ? <ChevronDown size={14} color={C.textMuted} /> : <ChevronRight size={14} color={C.textMuted} />}
                </div>
                {expandedFix === i && (
                  <div style={{ padding: "0 14px 14px" }}>
                    <CodeBlock code={fix.cmd} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Debug Chat ───────────────────────────────────────────────────────────────
const DebugChat = ({ pod, analysis, logs }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `I've analyzed **${pod.name}** (${pod.ns}) and identified the root cause with ${analysis.confidence}% confidence.\n\n**Diagnosis:** ${analysis.rootCause}\n\nAsk me anything about this pod — I have the full log context loaded.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const quickQ = [
    "How do I prevent this from recurring?",
    "What's the fastest fix right now?",
    "Is this affecting other pods?",
    "Show me the kubectl commands to apply",
    "Explain the error in simple terms",
  ];

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const systemPrompt = `You are an expert Kubernetes and ML infrastructure SRE debugging a specific pod issue.

Pod details:
- Name: ${pod.name}
- Namespace: ${pod.ns}
- Status: ${pod.status}
- Node: ${pod.node}
- Restarts: ${pod.restarts}

Root cause already identified: ${analysis.rootCause}
Severity: ${analysis.severity}
Category: ${analysis.category}

Pod logs (last 30 lines):
${logs.split('\n').slice(-30).join('\n')}

Provide concise, actionable answers. Format kubectl commands in code blocks. Be direct and technical — the user is an SRE managing India's national AI computing infrastructure.`;

    try {
      const history = messages.filter(m => !m.content.startsWith("I've analyzed")).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: systemPrompt,
          messages: [...history, { role: "user", content: msg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Unable to get response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ API error. In production, this connects to your GPT-120B endpoint." }]);
    }
    setLoading(false);
  };

  const formatMsg = (text) => {
    return text.split(/(```[\s\S]*?```|\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
        return <div key={i} style={{ background: "#020710", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", fontFamily: "monospace", fontSize: 11, color: C.green, margin: "6px 0", overflowX: "auto", whiteSpace: "pre" }}>{code}</div>;
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: C.text }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, display: "flex", flexDirection: "column", height: 420 }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        <Brain size={14} color={C.purple} />
        <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Debug Chat</span>
        <span style={{ fontSize: 10, color: C.textMuted }}>— log context injected into LLM</span>
        <div style={{ marginLeft: "auto" }}><Badge label="Context Loaded" color={C.green} /></div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: m.role === "user" ? `${C.blue}20` : `${C.purple}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {m.role === "user" ? <User size={12} color={C.blue} /> : <Bot size={12} color={C.purple} />}
            </div>
            <div style={{ maxWidth: "80%", background: m.role === "user" ? C.blueGlow : C.navy, border: `1px solid ${m.role === "user" ? C.blue + "33" : C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
              {formatMsg(m.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${C.purple}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={12} color={C.purple} /></div>
            <div style={{ background: C.navy, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.purple, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "8px 12px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {quickQ.map(q => (
            <button key={q} onClick={() => send(q)} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "3px 10px", color: C.textMuted, fontSize: 10, cursor: "pointer", whiteSpace: "nowrap" }}>{q}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, background: C.navy, border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: "6px 10px" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about this pod…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 12 }} />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            style={{ background: input.trim() ? C.blue : C.border, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: C.navy, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <Send size={11} />Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main PodDebugger View ────────────────────────────────────────────────────
export default function PodDebugger() {
  const [selectedPod, setSelectedPod] = useState(null);
  const [search, setSearch] = useState("");
  const [nsFilter, setNsFilter] = useState("All");
  const [ragStep, setRagStep] = useState(0);
  const [ragStats, setRagStats] = useState({ lines: 0, chunks: 0, tokens: 0, errors: 0, warnings: 0, topK: 0 });
  const [showReport, setShowReport] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logContent, setLogContent] = useState("");

  const namespaces = ["All", ...Array.from(new Set(DEMO_PODS.map(p => p.ns)))];
  const filtered = DEMO_PODS.filter(p =>
    (nsFilter === "All" || p.ns === nsFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const runDebug = useCallback(async (pod) => {
    setSelectedPod(pod);
    setShowReport(false);
    setShowLogs(false);
    setRagStep(0);
    setIsRunning(true);

    const logs = LOG_TEMPLATES[pod.type] || LOG_TEMPLATES.healthy;
    const lines = logs.split("\n").length;
    const chunks = Math.ceil(lines / 8);
    const tokens = lines * 18;
    const errors = (logs.match(/ERROR|CRITICAL|OOMKilled|Fatal/gi) || []).length;
    const warnings = (logs.match(/WARNING|WARN/gi) || []).length;

    // Animate through pipeline steps
    await new Promise(r => setTimeout(r, 400));
    setRagStep(1); setRagStats(s => ({ ...s, lines }));
    await new Promise(r => setTimeout(r, 900));
    setRagStep(2); setRagStats(s => ({ ...s, chunks, tokens }));
    setLogContent(logs);
    await new Promise(r => setTimeout(r, 800));
    setRagStep(3); setRagStats(s => ({ ...s, errors, warnings }));
    await new Promise(r => setTimeout(r, 700));
    setRagStep(4); setRagStats(s => ({ ...s, topK: Math.min(5, chunks) }));
    await new Promise(r => setTimeout(r, 1200));
    setRagStep(6);
    setShowReport(true);
    setIsRunning(false);
  }, []);

  const analysis = selectedPod ? ANALYSIS_PRESETS[selectedPod.type] : null;

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 90px)" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
        @keyframes ping { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.8);opacity:0} }
        input::placeholder { color: #64748B; }
        select option { background: #0C1D30; color: #E2E8F0; }
      `}</style>

      {/* ── Left: Pod Selector Panel ─────────────────────────────── */}
      <div style={{ width: 280, flexShrink: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Bug size={14} color={C.red} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Pod Debugger</span>
            <Badge label="AI" color={C.purple} />
          </div>
          <div style={{ background: C.navy, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 10px", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Search size={12} color={C.textMuted} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pods…"
              style={{ background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 12, flex: 1 }} />
          </div>
          <select value={nsFilter} onChange={e => setNsFilter(e.target.value)}
            style={{ width: "100%", background: C.navy, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 10px", color: C.text, fontSize: 12, outline: "none" }}>
            {namespaces.map(ns => <option key={ns}>{ns}</option>)}
          </select>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {filtered.map(pod => {
            const isActive = selectedPod?.name === pod.name;
            const statusCol = pod.status === "Running" ? C.green : pod.status === "Pending" ? C.amber : C.red;
            return (
              <button key={pod.name} onClick={() => runDebug(pod)}
                style={{ width: "100%", background: isActive ? C.blueGlow : "transparent", border: `1px solid ${isActive ? C.blue + "55" : "transparent"}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer", textAlign: "left", marginBottom: 4, transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <StatusDot s={pod.status} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.text, fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pod.name}</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Badge label={pod.ns} color={C.cyan} />
                  <Badge label={pod.status} color={statusCol} />
                  {pod.restarts > 0 && <Badge label={`↺${pod.restarts}`} color={C.red} />}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.textMuted }}>
          Click any pod to start AI debug analysis
        </div>
      </div>

      {/* ── Right: Debug Workspace ──────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {!selectedPod ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: C.textMuted }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.purple}15`, border: `2px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bug size={28} color={C.border} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textDim, marginBottom: 6 }}>Select a pod to debug</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>The AI will ingest its logs, run root cause analysis,<br />and suggest prioritized fixes</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["CrashLoopBackOff", "OOMKilled", "GPU Error"].map(t => (
                <div key={t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: C.textMuted }}>{t}</div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Pod header */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <Bug size={16} color={C.red} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{selectedPod.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                  {selectedPod.ns} · {selectedPod.node} · {selectedPod.age}
                </div>
              </div>
              <Badge label={selectedPod.status} color={selectedPod.status === "Running" ? C.green : selectedPod.status === "Pending" ? C.amber : C.red} />
              {selectedPod.restarts > 0 && <Badge label={`${selectedPod.restarts} restarts`} color={C.red} />}
              <button onClick={() => runDebug(selectedPod)}
                style={{ background: C.blueGlow, border: `1px solid ${C.blue}44`, borderRadius: 7, padding: "6px 12px", cursor: "pointer", color: C.blue, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <RefreshCw size={11} />Re-analyze
              </button>
            </div>

            {/* RAG Pipeline */}
            <RAGPipeline step={ragStep} stats={ragStats} />

            {/* Logs panel (collapsible) */}
            {logContent && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                <div onClick={() => setShowLogs(!showLogs)}
                  style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <Terminal size={13} color={C.textMuted} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Raw Logs</span>
                  <Badge label={`${ragStats.lines} lines`} color={C.blue} />
                  {ragStats.errors > 0 && <Badge label={`${ragStats.errors} errors`} color={C.red} />}
                  {ragStats.warnings > 0 && <Badge label={`${ragStats.warnings} warnings`} color={C.amber} />}
                  <div style={{ marginLeft: "auto" }}>
                    {showLogs ? <ChevronDown size={13} color={C.textMuted} /> : <ChevronRight size={13} color={C.textMuted} />}
                  </div>
                </div>
                {showLogs && (
                  <div style={{ borderTop: `1px solid ${C.border}`, maxHeight: 260, overflowY: "auto", background: "#020710" }}>
                    <pre style={{ padding: "12px 16px", margin: 0, fontSize: 10.5, fontFamily: "monospace", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                      {logContent.split("\n").map((line, i) => {
                        const col = line.includes("ERROR") || line.includes("CRITICAL") || line.includes("OOMKilled") ? C.red
                          : line.includes("WARNING") || line.includes("WARN") ? C.amber
                          : line.includes("INFO") ? C.textDim : C.textMuted;
                        return <div key={i} style={{ color: col }}>{line}</div>;
                      })}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Report */}
            {showReport && analysis && (
              <>
                <AnalysisReport analysis={analysis} pod={selectedPod} />
                <DebugChat pod={selectedPod} analysis={analysis} logs={logContent} />
              </>
            )}

            {/* Loading state */}
            {isRunning && !showReport && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <Loader size={24} color={C.blue} style={{ animation: "spin 1s linear infinite" }} />
                <div style={{ fontSize: 13, color: C.textDim }}>Analyzing logs with AI…</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

