#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${ROOT_DIR}/.acceptance-logs"
PID_FILE="${LOG_DIR}/acceptance.pids"

kill_pid() {
  local pid="$1"
  if [[ -n "${pid}" && "${pid}" != "existing" ]] && kill -0 "${pid}" >/dev/null 2>&1; then
    kill "${pid}" >/dev/null 2>&1 || true
    sleep 1
    if kill -0 "${pid}" >/dev/null 2>&1; then
      kill -9 "${pid}" >/dev/null 2>&1 || true
    fi
  fi
}

kill_by_port() {
  local port="$1"
  local pids
  pids="$(lsof -tiTCP:${port} -sTCP:LISTEN -n -P 2>/dev/null || true)"
  if [[ -n "${pids}" ]]; then
    echo "${pids}" | xargs kill >/dev/null 2>&1 || true
    sleep 1
    echo "${pids}" | xargs kill -9 >/dev/null 2>&1 || true
  fi
}

backend_pid=""
frontend_pid=""
if [[ -f "${PID_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${PID_FILE}" || true
  backend_pid="${backend_pid:-}"
  frontend_pid="${frontend_pid:-}"
fi

kill_pid "${frontend_pid}"
kill_pid "${backend_pid}"
kill_by_port 5177
kill_by_port 8092

rm -f "${LOG_DIR}/backend.pid" "${LOG_DIR}/frontend.pid" "${PID_FILE}"
echo "[mall-webapp acceptance-down] Done."
