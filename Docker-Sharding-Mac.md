# Run Playwright shards in Docker (macOS)

Run the test suite as **4 shards, each in its own Docker container**, at the same time.
Each container writes its reports to your Mac through a volume. Then merge them into
one **reportingLabs**, one **Playwright HTML** and one **Allure** report and open them.

```
docker-compose.shard.yml
   shard1 ─┐
   shard2 ─┼── build: .  ──►  Dockerfile  ──►  one image (Playwright + browsers + your code)
   shard3 ─┤                                         │
   shard4 ─┘                                         ▼
                                    4 containers, each runs --shard=N/4
                                                     │  volumes
                                                     ▼
                     rl-shard1..4 · reports-shard1..4 · allure-shard1..4 · blob-shard1..4   (on your Mac)
                                                     │  merge
                                                     ▼
                 reporting-labs-merged/ · playwright-report/ · merged-allure-report/
```

---

## 1. What you need

| Tool | Why | Check |
|---|---|---|
| Docker Desktop for Mac (running) | Builds the image and runs the 4 containers | `docker compose version` |
| Node.js 18+ | Merging the reports on your Mac | `node -v` |
| `npm install` done in the project | `npx reporting-labs`, `npx playwright`, `npx allure` | `ls node_modules` |
| Java 17+ | Only for the Allure report | `java -version` |
| `config/.env.qa` | Base URL, user, password… passed to the containers at start | `ls config/.env.qa` |

> You do **not** need a Docker registry (Docker Hub / GHCR). The image is built and used on the same Mac.

---

## 2. The three files

### `Dockerfile`

```dockerfile
FROM mcr.microsoft.com/playwright:v1.63.0

WORKDIR /app

ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test", "--project=chromium"]
```

- `FROM mcr.microsoft.com/playwright:v1.63.0` – Microsoft's Playwright image: Ubuntu, Node.js, the browsers and
  their system libraries. That is why the Dockerfile has no `npx playwright install`.
- `RUN npm ci` – installs exactly what `package-lock.json` says (`@playwright/test`, `reporting-labs`, `allure-playwright`…).
- `COPY . .` – copies your framework code (tests, pages, configs) into `/app`, except what `.dockerignore` lists.
- `CMD` – the default command. `docker-compose.shard.yml` replaces it with one `--shard=N/4` command per container.

> **The image version must match `@playwright/test` in `package-lock.json`.**
> Image `v1.63.0` → `@playwright/test` `1.63.0`. If they differ, every test fails with
> `browserType.launch: Executable doesn't exist at /ms-playwright/...`. See [Troubleshooting](#7-troubleshooting).

### `.dockerignore`

```
node_modules
reports
allure-results
allure-report
test-results
playwright-report
.git
.github
config/.env.*
!config/.env.example
dist
*.log

# reportingLabs output (the history file reporting-labs.history.json is still copied, for the trend)
reporting-labs
reporting-labs-merged

# per-shard folders from docker-compose.shard.yml and shard-demo.cjs, and their merged reports
reports-shard*
allure-shard*
blob-shard*
rl-shard*
blob-report
all-blob-reports
all-allure-results
merged-allure-report
```

- `node_modules` – the image uses the Linux `node_modules` from `npm ci`, not the one from your Mac.
- `config/.env.*` – passwords are **never** baked into the image; they come in at start through `env_file`.
- The report folders – old reports are not copied into the image on every build (faster builds, smaller image).

### `docker-compose.shard.yml`

```yaml
version: '3.8'

services:
  shard1:
    build: .
    env_file:
      - config/.env.qa
    environment:
      - CI=true
      - TEST_ENV=qa                                  # the "env" chip in the reportingLabs header
    volumes:
      - ./reports-shard1:/app/reports/html-report
      - ./allure-shard1:/app/allure-results
      - ./blob-shard1:/app/blob-report
      - ./rl-shard1:/app/reporting-labs              # reportingLabs: index.html, report.pdf, report.json
    command: npx playwright test --project=chromium --shard=1/4

  shard2:
    build: .
    env_file:
      - config/.env.qa
    environment:
      - CI=true
      - TEST_ENV=qa                                  # the "env" chip in the reportingLabs header
    volumes:
      - ./reports-shard2:/app/reports/html-report
      - ./allure-shard2:/app/allure-results
      - ./blob-shard2:/app/blob-report
      - ./rl-shard2:/app/reporting-labs              # reportingLabs: index.html, report.pdf, report.json
    command: npx playwright test --project=chromium --shard=2/4

  shard3:
    build: .
    env_file:
      - config/.env.qa
    environment:
      - CI=true
      - TEST_ENV=qa                                  # the "env" chip in the reportingLabs header
    volumes:
      - ./reports-shard3:/app/reports/html-report
      - ./allure-shard3:/app/allure-results
      - ./blob-shard3:/app/blob-report
      - ./rl-shard3:/app/reporting-labs              # reportingLabs: index.html, report.pdf, report.json
    command: npx playwright test --project=chromium --shard=3/4

  shard4:
    build: .
    env_file:
      - config/.env.qa
    environment:
      - CI=true
      - TEST_ENV=qa                                  # the "env" chip in the reportingLabs header
    volumes:
      - ./reports-shard4:/app/reports/html-report
      - ./allure-shard4:/app/allure-results
      - ./blob-shard4:/app/blob-report
      - ./rl-shard4:/app/reporting-labs              # reportingLabs: index.html, report.pdf, report.json
    command: npx playwright test --project=chromium --shard=4/4
```

- `build: .` – every shard uses the image built from the `Dockerfile` in this folder.
- `env_file` – your `.env.qa` values go into each container when it starts.
- `volumes` – `<folder on your Mac>:<folder in the container>`. What the container writes there appears on your Mac.
  Docker creates the folders on the Mac by itself.
- `command` – replaces the Dockerfile `CMD`: each container runs its own part of the suite.

---

## 3. Run the shards

Run everything from the project folder (where `docker-compose.shard.yml` is).

**Clean the previous run**

```bash
rm -rf reports-shard* allure-shard* blob-shard* rl-shard* \
       all-blob-reports all-allure-results playwright-report merged-allure-report reporting-labs-merged
```

**Build the image and run the 4 shards**

```bash
docker compose -f docker-compose.shard.yml up --build
```

- `--build` rebuilds the image with your latest code. Without it the containers run the code from the last build.
- The 4 containers run in parallel; their output is prefixed with the container name (`...-shard1-1 | ...`).
- The command returns when all 4 containers are done, also when tests failed.

**Remove the stopped containers**

```bash
docker compose -f docker-compose.shard.yml down
```

After the run your project folder has:

```
rl-shard1 … rl-shard4            reportingLabs of each shard (index.html, report.pdf, report.json)
reports-shard1 … reports-shard4  Playwright HTML of each shard
allure-shard1 … allure-shard4    Allure results of each shard
blob-shard1 … blob-shard4        blob reports, for the Playwright merge
```

---

## 4. Merge the reports

**reportingLabs**

```bash
npx reporting-labs merge rl-shard1 rl-shard2 rl-shard3 rl-shard4 -o reporting-labs-merged
```

One report for all shards. The Timeline shows one row per worker of every shard (`S1·w0`, `S1·w1`, … `S4·w1`).

**Playwright HTML**

```bash
mkdir -p all-blob-reports && cp blob-shard*/* all-blob-reports/
PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR=playwright-report \
  npx playwright merge-reports --reporter=html ./all-blob-reports
```

`PLAYWRIGHT_HTML_OPEN=never` stops Playwright from starting a report server and waiting for Ctrl+C.

**Allure** (needs Java)

```bash
mkdir -p all-allure-results && cp -r allure-shard*/* all-allure-results/
npx allure generate all-allure-results --clean -o merged-allure-report
```

---

## 5. Open the reports

```bash
open reporting-labs-merged/index.html              # reportingLabs – one file, opens directly
npx playwright show-report playwright-report       # Playwright HTML – local server, Ctrl+C to stop
npx allure open merged-allure-report               # Allure – local server, Ctrl+C to stop
```

- **reportingLabs** is a single self-contained HTML file: `open` it, attach it, mail it. Use **Export PDF** in the
  report for a PDF of the merged run.
- **Playwright HTML** and **Allure** need a local server (opened as a plain file, Allure stays blank and the
  Playwright trace viewer does not load). Open them one after the other; stop each with Ctrl+C.

**One shard only**

```bash
open rl-shard2/index.html         # reportingLabs of shard 2
open rl-shard2/report.pdf         # its PDF
npx playwright show-report reports-shard2
```

---

## 6. All steps in one go

Save as `run-docker-shards.sh` in the project folder, then `chmod +x run-docker-shards.sh` and `./run-docker-shards.sh`.

```bash
#!/usr/bin/env bash
# 4 Playwright shards in Docker, then merged reportingLabs, Playwright HTML and Allure reports.

COMPOSE=docker-compose.shard.yml

echo "== Clean"
rm -rf reports-shard* allure-shard* blob-shard* rl-shard* \
       all-blob-reports all-allure-results playwright-report merged-allure-report reporting-labs-merged

echo "== Run 4 shards in Docker"
docker compose -f "$COMPOSE" up --build
docker compose -f "$COMPOSE" down

echo "== Merge: reportingLabs"
npx reporting-labs merge rl-shard1 rl-shard2 rl-shard3 rl-shard4 -o reporting-labs-merged

echo "== Merge: Playwright HTML"
mkdir -p all-blob-reports && cp blob-shard*/* all-blob-reports/
PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR=playwright-report \
  npx playwright merge-reports --reporter=html ./all-blob-reports

echo "== Merge: Allure"
mkdir -p all-allure-results && cp -r allure-shard*/* all-allure-results/
npx allure generate all-allure-results --clean -o merged-allure-report

echo
echo "Done:"
echo "  reportingLabs   : open reporting-labs-merged/index.html"
echo "  Playwright HTML : npx playwright show-report playwright-report"
echo "  Allure          : npx allure open merged-allure-report"
open reporting-labs-merged/index.html
```

---

## 7. Troubleshooting

**`Executable doesn't exist at /ms-playwright/...` – "Please update docker image as well"**

The image and `@playwright/test` are different versions. The message shows both:
`current:` is the image, `required:` is what your `@playwright/test` needs.

`npm ci` installs what `package-lock.json` says, not `package.json`. Editing `package.json` by hand is not enough:

```bash
npm i -D @playwright/test@1.63.0                     # same version as the image tag
grep -A1 -E '"node_modules/(@playwright/test|playwright|playwright-core)"' package-lock.json | grep version
npx playwright --version

docker compose -f docker-compose.shard.yml down
docker compose -f docker-compose.shard.yml build --no-cache
docker compose -f docker-compose.shard.yml up
```

When you upgrade Playwright later, change the `FROM ...playwright:vX.Y.Z` tag in the **same commit**.

**My code changes are not in the run**

Run with `--build` (`up --build`). The code is copied into the image at build time.

**`env file config/.env.qa not found`**

Create `config/.env.qa` (copy `config/.env.example`). It is on purpose not in Git and not in the image.

**`rl-shard1` is empty**

The tests did not reach the end of the run (for example the container was stopped). Look at the container output
for that shard. reportingLabs writes `index.html`, `report.pdf` and `report.json` when the run finishes.

**Allure: `JAVA_HOME is not set`**

Install Java (`brew install --cask temurin`) and open a new terminal.

**The env chip in the reportingLabs header says `local`**

`reporting-labs.config.ts` reads `TEST_ENV`. Keep `- TEST_ENV=qa` under `environment:` in the compose file.
