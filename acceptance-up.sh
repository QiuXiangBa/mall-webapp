#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${ROOT_DIR}/../../.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/repos/backend/e-store"
LOG_DIR="${ROOT_DIR}/.acceptance-logs"
PID_FILE="${LOG_DIR}/acceptance.pids"

BACKEND_PORT="${BACKEND_PORT:-8092}"
FRONTEND_PORT="${FRONTEND_PORT:-5177}"
BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-http://127.0.0.1:${BACKEND_PORT}/}"
FRONTEND_URL="${FRONTEND_URL:-http://127.0.0.1:${FRONTEND_PORT}}"

mkdir -p "${LOG_DIR}"
BACKEND_LOG="${LOG_DIR}/backend.log"
FRONTEND_LOG="${LOG_DIR}/frontend.log"

is_port_listening() {
  local port="$1"
  lsof -iTCP:"${port}" -sTCP:LISTEN -n -P >/dev/null 2>&1
}

wait_http_ok() {
  local url="$1"
  local retries="$2"
  local sleep_seconds="$3"
  local current=0

  while (( current < retries )); do
    if curl -fsS "${url}" >/dev/null 2>&1; then
      return 0
    fi
    current=$((current + 1))
    sleep "${sleep_seconds}"
  done
  return 1
}

[[ -d "${BACKEND_DIR}" ]] || { echo "Backend directory not found: ${BACKEND_DIR}"; exit 1; }

if is_port_listening "${BACKEND_PORT}"; then
  echo "[mall-webapp acceptance-up] Backend port ${BACKEND_PORT} already in use, skip backend startup."
  BACKEND_PID="existing"
else
  echo "[mall-webapp acceptance-up] Starting backend on port ${BACKEND_PORT}..."
  (
    cd "${BACKEND_DIR}"
    nohup sh -c "mvn -DskipTests -q package -pl app/main -am && java -jar app/main/target/app.jar --spring.profiles.active=dev --server.port=${BACKEND_PORT}" >"${BACKEND_LOG}" 2>&1 &
    echo $! >"${LOG_DIR}/backend.pid"
  )
  BACKEND_PID="$(cat "${LOG_DIR}/backend.pid")"
fi

if is_port_listening "${FRONTEND_PORT}"; then
  echo "[mall-webapp acceptance-up] Frontend port ${FRONTEND_PORT} already in use, skip frontend startup."
  FRONTEND_PID="existing"
else
  echo "[mall-webapp acceptance-up] Starting rider webapp on port ${FRONTEND_PORT}..."
  (
    cd "${ROOT_DIR}"
    nohup npm run dev -- --host 127.0.0.1 --port "${FRONTEND_PORT}" >"${FRONTEND_LOG}" 2>&1 &
    echo $! >"${LOG_DIR}/frontend.pid"
  )
  FRONTEND_PID="$(cat "${LOG_DIR}/frontend.pid")"
fi

echo "backend_pid=${BACKEND_PID}" >"${PID_FILE}"
echo "frontend_pid=${FRONTEND_PID}" >>"${PID_FILE}"

if ! wait_http_ok "${BACKEND_HEALTH_URL}" 90 2; then
  echo "[mall-webapp acceptance-up] Backend health check failed."
  tail -n 80 "${BACKEND_LOG}" 2>/dev/null || true
  exit 1
fi

if ! wait_http_ok "${FRONTEND_URL}" 45 2; then
  echo "[mall-webapp acceptance-up] Frontend health check failed."
  tail -n 80 "${FRONTEND_LOG}" 2>/dev/null || true
  exit 1
fi

echo "[mall-webapp acceptance-up] Ready."
echo "Frontend URL: ${FRONTEND_URL}"
echo "Backend URL : http://127.0.0.1:${BACKEND_PORT}"
echo "Logs:"
echo "  - ${BACKEND_LOG}"
echo "  - ${FRONTEND_LOG}"
