import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const dataDir = join(root, "data");
const uploadDir = join(root, "uploads");
const dataFile = join(dataDir, "projects.json");
const contentFile = join(dataDir, "content.json");
const port = Number(process.env.PORT ?? 8011);
const publicBaseUrl = process.env.PUBLIC_BASE_URL ?? `http://127.0.0.1:${port}`;

const jsonHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

await mkdir(dataDir, { recursive: true });
await mkdir(uploadDir, { recursive: true });

function send(response, status, body, headers = {}) {
  response.writeHead(status, { ...jsonHeaders, ...headers });
  response.end(body);
}

async function readProjects() {
  try {
    return JSON.parse(await readFile(dataFile, "utf8"));
  } catch {
    return [];
  }
}

async function writeProjects(projects) {
  await writeFile(dataFile, `${JSON.stringify(projects, null, 2)}\n`);
}

const defaultContent = {
  playground: {
    eyebrow: "04 / Playground / Creative Experiments",
    title: "Things I made because I couldn't leave the idea alone.",
    items: [
      {
        number: "001",
        title: "Scroll Typography Study",
        type: "Motion Prototype",
        technology: "Framer Motion / React",
        note: "A motion sketch for mapping scroll progress to staggered editorial type without hiding the actual message.",
        year: "2026",
      },
      {
        number: "002",
        title: "Cursor Distortion Experiment",
        type: "Interaction Study",
        technology: "Canvas / TypeScript",
        note: "A pointer-led distortion study with a static touch fallback so the idea is still readable without a cursor.",
        year: "2026",
      },
      {
        number: "003",
        title: "Interactive Album Poster",
        type: "Digital Poster",
        technology: "CSS / Framer Motion",
        note: "A responsive poster prototype where track metadata, halftone overlays, and motion cues behave like interface material.",
        year: "2026",
      },
    ],
  },
  visual: {
    eyebrow: "05 / Visual Design",
    title: "Beyond the Browser",
    description: "",
    items: [
      {
        title: "Poster Design",
        category: "Editorial Print",
        year: "2026",
        note: "A static typographic system built around tension, silence, and one aggressive pink mark.",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
        imageAlt: "High contrast editorial poster design with architectural geometry",
        variant: "large",
      },
      {
        title: "Album Cover",
        category: "Music Artwork",
        year: "2026",
        note: "Black-and-white texture, oversized type, and a sharp visual signature for a noisy release.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
        imageAlt: "Moody album cover direction with performer and dark stage lighting",
        variant: "image",
      },
      {
        title: "Typography Study",
        category: "Type System",
        year: "2025",
        note: "Static display-type studies balancing brutal scale with readable composition.",
        image: "",
        imageAlt: "",
        variant: "pink",
      },
    ],
  },
};

async function readContent() {
  try {
    return { ...defaultContent, ...JSON.parse(await readFile(contentFile, "utf8")) };
  } catch {
    return defaultContent;
  }
}

async function writeContent(content) {
  await writeFile(contentFile, `${JSON.stringify(content, null, 2)}\n`);
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `project-${Date.now()}`;
}

function parseList(value) {
  return String(value ?? "").split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function parseMultipart(buffer, contentType) {
  const boundary = contentType.match(/boundary=(.+)$/)?.[1];
  if (!boundary) return { fields: {}, files: {} };
  const fields = {};
  const files = {};
  const parts = buffer.toString("binary").split(`--${boundary}`);

  for (const part of parts) {
    const separator = part.indexOf("\r\n\r\n");
    if (separator === -1) continue;
    const rawHeaders = part.slice(0, separator);
    const body = part.slice(separator + 4, part.endsWith("\r\n") ? -2 : undefined);
    const name = rawHeaders.match(/name="([^"]+)"/)?.[1];
    const filename = rawHeaders.match(/filename="([^"]*)"/)?.[1];
    if (!name) continue;
    if (filename) {
      const file = {
        filename,
        data: Buffer.from(body, "binary"),
      };
      files[name] = files[name] ? [].concat(files[name], file) : file;
    } else {
      fields[name] = Buffer.from(body, "binary").toString("utf8");
    }
  }

  return { fields, files };
}

function projectFromFields(fields, imageUrl) {
  const title = fields.title?.trim() || "Untitled Project";
  const imageUrls = parseList(fields.imageUrls);
  const uploadedImages = Array.isArray(imageUrl) ? imageUrl : [imageUrl].filter(Boolean);
  const existingImages = parseList(fields.existingImages);
  const images = [...existingImages, ...uploadedImages, ...imageUrls].filter(Boolean);
  const primaryImage = images[0] || fields.image?.trim() || "";
  return {
    id: fields.id?.trim() || slugify(title),
    number: fields.number?.trim() || "01",
    title,
    year: fields.year?.trim() || new Date().getFullYear().toString(),
    role: fields.role?.trim() || "Web Design / Web Development",
    projectType: fields.projectType?.trim() || "Portfolio project",
    services: parseList(fields.services),
    responsibilities: parseList(fields.responsibilities),
    status: fields.status?.trim() || "Published",
    tools: fields.tools?.trim() || "",
    technologies: parseList(fields.technologies),
    category: fields.category?.trim() || "Selected Work",
    image: primaryImage,
    images: images.length > 0 ? images : [primaryImage].filter(Boolean),
    imageAlt: fields.imageAlt?.trim() || `${title} project preview`,
    description: fields.description?.trim() || "",
    challenge: fields.challenge?.trim() || "",
    solution: fields.solution?.trim() || "",
    interaction: fields.interaction?.trim() || "",
    accessibilityNotes: fields.accessibilityNotes?.trim() || "",
    result: fields.result?.trim() || "",
    variant: ["featured", "split", "pink"].includes(fields.variant) ? fields.variant : "split",
    liveUrl: fields.liveUrl?.trim() || "",
    githubUrl: fields.githubUrl?.trim() || "",
  };
}

function adminPage(projects) {
  const rows = projects.map((project) => `
    <tr>
      <td><span class="pill">${project.number}</span></td>
      <td class="project-cell">${project.image ? `<img src="${field(project.image)}" alt="" />` : `<div class="empty-thumb"></div>`}<div><strong>${project.title}</strong><small>${project.category}</small></div></td>
      <td>${project.year}</td>
      <td>${project.images?.length ?? (project.image ? 1 : 0)} image(s)</td>
      <td><a class="ghost-link" href="/admin/edit/${project.id}">Edit</a></td>
    </tr>
  `).join("");

  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SETAREH Admin</title>
    <style>
      :root{color-scheme:dark;--ink:#09090b;--panel:#121215;--panel2:#19191d;--bone:#f5efe6;--muted:#a9a19a;--pink:#f44ba0;--line:#f5efe62b}*{box-sizing:border-box}body{margin:0;background:#09090b;color:var(--bone);font-family:Inter,Arial,sans-serif}main{max-width:1160px;margin:auto;padding:24px 16px 44px}.top{display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:18px}.quick-actions,.section-picker{display:flex;gap:10px;flex-wrap:wrap}h1{font-size:clamp(38px,7vw,76px);line-height:.9;margin:0;text-transform:uppercase;letter-spacing:0}.kicker,.hint{font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:var(--pink)}.hint,.file-preview{color:var(--muted);line-height:1.6;text-transform:none;letter-spacing:0}.file-preview{min-height:20px;margin:0;font-size:12px}.section-picker{display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:20px}.section-card{border:1px solid var(--line);background:#141417;padding:16px;text-decoration:none;color:var(--bone)}.section-card:hover{border-color:var(--pink)}.section-card strong{display:block;margin:6px 0;font-size:18px;text-transform:uppercase}.section-card span{color:var(--pink);font-family:monospace;font-size:12px}.section-card p{margin:0;color:var(--muted);line-height:1.5}.shell{display:grid;gap:18px;grid-template-columns:1fr}.card{background:#121215;border:1px solid var(--line)}.card-head{display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid var(--line);padding:16px}.card-title{margin:0;font-size:18px;text-transform:uppercase}.form-body{display:grid;gap:18px;padding:16px}fieldset{border:0;margin:0;padding:0;display:grid;gap:12px}legend{margin-bottom:8px;color:var(--pink);font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:.14em}label{display:grid;gap:7px;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#ff8dc5}input,textarea,select{width:100%;background:var(--panel2);color:var(--bone);border:1px solid var(--line);padding:12px;font:inherit;outline:none}input:focus,textarea:focus,select:focus{border-color:var(--pink);box-shadow:0 0 0 3px #f44ba033}textarea{min-height:88px;resize:vertical}details{border:1px solid var(--line);background:#101013;padding:12px}summary{cursor:pointer;color:var(--bone);font-weight:900;text-transform:uppercase;font-size:12px;letter-spacing:.12em}details .grid,details fieldset{margin-top:14px}button,a.button,.ghost-link{display:inline-flex;align-items:center;justify-content:center;background:var(--pink);color:var(--ink);border:0;padding:12px 15px;font-weight:900;text-transform:uppercase;text-decoration:none;cursor:pointer}.button.secondary{background:var(--bone)}.ghost-link{background:transparent;color:var(--pink);border:1px solid #f44ba066;padding:8px 11px}.grid{display:grid;gap:12px}.actions{display:flex;gap:10px;flex-wrap:wrap}.table-wrap{overflow:auto}.pill{display:inline-flex;border:1px solid var(--pink);color:var(--pink);padding:7px 10px;font-family:monospace}.project-cell{display:flex;gap:12px;align-items:center;min-width:240px}.project-cell img,.empty-thumb{width:54px;height:54px;object-fit:cover;border:1px solid var(--line);background:var(--panel2)}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid var(--line);padding:12px;text-align:left;white-space:nowrap}th{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted)}small{display:block;color:var(--muted);margin-top:4px;white-space:normal}@media(min-width:860px){.section-picker{grid-template-columns:repeat(3,1fr)}.shell{grid-template-columns:minmax(0,1fr) 390px}.grid{grid-template-columns:repeat(2,1fr)}.span-2{grid-column:span 2}}</style>
  </head>
  <body>
    <main>
      <div class="top"><div><p class="kicker">SETAREH Portfolio CMS</p><h1>Admin</h1></div><div class="quick-actions"><a class="button" href="/admin">Refresh</a></div></div>
      <nav class="section-picker" aria-label="Portfolio sections">
        <a class="section-card" href="/admin#selected-work"><span>01</span><strong>Selected Work</strong><p>Full case-study projects with gallery, links, stack, challenge, and result.</p></a>
        <a class="section-card" href="/admin/content#playground"><span>02</span><strong>Things I made</strong><p>Creative experiment cards for the Playground section.</p></a>
        <a class="section-card" href="/admin/content#visual"><span>03</span><strong>Beyond the Browser</strong><p>Visual design projects with poster/image upload and compact notes.</p></a>
      </nav>
      <div class="shell">
        <form id="selected-work" class="card" action="/admin/projects" method="post" enctype="multipart/form-data">
          <div class="card-head"><h2 class="card-title">Add to Selected Work</h2><p class="hint">Upload one or many images. More than three images will show manual pagination on the site.</p></div>
          <div class="form-body">
            <fieldset><legend>Project Basics</legend><div class="grid">
              <label>Title<input name="title" required placeholder="Project name" /></label>
              <label>Year<input name="year" value="2026" /></label>
              <label>Category<input name="category" placeholder="Editorial Website" /></label>
            </div></fieldset>
            <fieldset><legend>Images</legend><div class="grid">
              <label>Upload Multiple Images<input class="multi-image-input" name="imageFile" type="file" accept="image/*" multiple data-empty-text="No files selected yet." /><p class="file-preview">No files selected yet.</p></label>
              <label class="span-2">Image Alt<input name="imageAlt" placeholder="Short description for accessibility" /></label>
            </div></fieldset>
            <fieldset><legend>Story</legend>
              <label>Description<textarea name="description"></textarea></label>
            </fieldset>
            <fieldset><legend>Details</legend>
              <label>Challenge<textarea name="challenge"></textarea></label>
              <label>Approach<textarea name="solution"></textarea></label>
              <label>Result<textarea name="result"></textarea></label>
            </fieldset>
            <fieldset><legend>Links</legend><div class="grid">
              <label>Live Link<input name="liveUrl" type="url" /></label>
              <label>GitHub Link<input name="githubUrl" type="url" /></label>
            </div></fieldset>
            <div class="actions"><button type="submit">Add Project</button></div>
          </div>
        </form>
        <section class="card">
          <div class="card-head"><h2 class="card-title">Existing Work</h2><p class="hint">${projects.length} projects</p></div>
          <div class="table-wrap"><table><thead><tr><th>No.</th><th>Project</th><th>Year</th><th>Gallery</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
        </section>
      </div>
    </main>
    <script>
      document.querySelectorAll(".multi-image-input").forEach((input) => {
        const selectedFiles = new Map();
        input.addEventListener("change", () => {
          const preview = input.parentElement.querySelector(".file-preview");
          Array.from(input.files || []).forEach((file) => {
            selectedFiles.set(file.name + "-" + file.size + "-" + file.lastModified, file);
          });

          const dataTransfer = new DataTransfer();
          selectedFiles.forEach((file) => dataTransfer.items.add(file));
          input.files = dataTransfer.files;

          const files = Array.from(input.files || []);
          preview.textContent = files.length
            ? files.length + " files selected: " + files.map((file) => file.name).join(" / ")
            : input.dataset.emptyText;
        });
      });
    </script>
  </body>
  </html>`;
}

function field(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function editPage(project) {
  if (!project) {
    return `<!doctype html><html><body><p>Project not found.</p><a href="/admin">Back</a></body></html>`;
  }

  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Edit ${field(project.title)}</title>
    <style>
      :root{color-scheme:dark;--ink:#09090b;--panel:#121215;--panel2:#19191d;--bone:#f5efe6;--muted:#a9a19a;--pink:#f44ba0;--line:#f5efe62b}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,#2b1122 0,#09090b 34rem);color:var(--bone);font-family:Inter,Arial,sans-serif}main{max-width:1180px;margin:auto;padding:28px 18px 48px}.top{display:flex;justify-content:space-between;gap:16px;align-items:end;flex-wrap:wrap;margin-bottom:22px}h1{font-size:clamp(40px,8vw,92px);line-height:.86;margin:0;text-transform:uppercase}.kicker,.hint{font-size:12px;text-transform:uppercase;letter-spacing:.16em;color:var(--pink)}.hint,.file-preview{color:var(--muted);line-height:1.7;text-transform:none;letter-spacing:0}.file-preview{min-height:22px;margin:0;font-size:12px}.card{background:color-mix(in srgb,var(--panel) 92%,transparent);border:1px solid var(--line);box-shadow:0 20px 60px #0008}.card-head{display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid var(--line);padding:18px}.form-body{display:grid;gap:22px;padding:18px}fieldset{border:0;margin:0;padding:0;display:grid;gap:14px}legend{margin-bottom:10px;color:var(--pink);font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:.16em}label{display:grid;gap:7px;font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#ff8dc5}input,textarea,select{width:100%;background:var(--panel2);color:var(--bone);border:1px solid var(--line);padding:13px 12px;font:inherit;outline:none}input:focus,textarea:focus,select:focus{border-color:var(--pink);box-shadow:0 0 0 3px #f44ba033}textarea{min-height:92px;resize:vertical}button,a.button{display:inline-flex;align-items:center;justify-content:center;background:var(--pink);color:var(--ink);border:0;padding:13px 16px;font-weight:900;text-transform:uppercase;text-decoration:none;cursor:pointer}.danger{background:var(--bone)}.grid{display:grid;gap:14px}.span-2{grid-column:1 / -1}.actions{display:flex;gap:10px;flex-wrap:wrap}.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}.gallery img{width:100%;aspect-ratio:4/3;object-fit:cover;border:1px solid var(--line)}@media(min-width:760px){.grid{grid-template-columns:repeat(2,1fr)}}</style>
  </head>
  <body>
    <main>
      <div class="top"><div><p class="kicker">Editing</p><h1>${field(project.title)}</h1></div><a class="button" href="/admin">Back</a></div>
      <form class="card" action="/admin/projects/${project.id}" method="post" enctype="multipart/form-data">
        <div class="card-head"><strong>Project Details</strong><p class="hint">Keep existing image URLs, add new URLs, or upload more files.</p></div>
        <div class="form-body">
          <fieldset><legend>Project Basics</legend><div class="grid">
            <label>Title<input name="title" required value="${field(project.title)}" /></label>
            <label>Year<input name="year" value="${field(project.year)}" /></label>
            <label>Category<input name="category" value="${field(project.category)}" /></label>
          </div></fieldset>
          <fieldset><legend>Images</legend>
            <div class="gallery">${(project.images ?? [project.image].filter(Boolean)).map((image) => `<img src="${field(image)}" alt="" />`).join("")}</div>
            <div class="grid">
              <label>Existing Images<textarea name="existingImages">${field((project.images ?? [project.image].filter(Boolean)).join("\n"))}</textarea></label>
              <label>Upload More Images<input class="multi-image-input" name="imageFile" type="file" accept="image/*" multiple data-empty-text="No new files selected yet." /><p class="file-preview">No new files selected yet.</p></label>
              <label>Image Alt<input name="imageAlt" value="${field(project.imageAlt)}" /></label>
            </div>
          </fieldset>
          <fieldset><legend>Story</legend>
            <label>Description<textarea name="description">${field(project.description)}</textarea></label>
            <label>Challenge<textarea name="challenge">${field(project.challenge)}</textarea></label>
            <label>Approach<textarea name="solution">${field(project.solution)}</textarea></label>
            <label>Result<textarea name="result">${field(project.result)}</textarea></label>
          </fieldset>
          <fieldset><legend>Links</legend><div class="grid">
            <label>Live Link<input name="liveUrl" type="url" value="${field(project.liveUrl)}" /></label>
            <label>GitHub Link<input name="githubUrl" type="url" value="${field(project.githubUrl)}" /></label>
          </div></fieldset>
          <div class="actions"><button type="submit">Save Project</button></div>
        </div>
      </form>
      <form action="/admin/projects/${project.id}/delete" method="post">
        <button class="danger" type="submit">Delete Project</button>
      </form>
    </main>
    <script>
      document.querySelectorAll(".multi-image-input").forEach((input) => {
        const selectedFiles = new Map();
        input.addEventListener("change", () => {
          const preview = input.parentElement.querySelector(".file-preview");
          Array.from(input.files || []).forEach((file) => {
            selectedFiles.set(file.name + "-" + file.size + "-" + file.lastModified, file);
          });

          const dataTransfer = new DataTransfer();
          selectedFiles.forEach((file) => dataTransfer.items.add(file));
          input.files = dataTransfer.files;

          const files = Array.from(input.files || []);
          preview.textContent = files.length
            ? files.length + " files selected: " + files.map((file) => file.name).join(" / ")
            : input.dataset.emptyText;
        });
      });
    </script>
  </body>
  </html>`;
}

function contentPage(content) {
  const playground = content.playground ?? defaultContent.playground;
  const visual = content.visual ?? defaultContent.visual;
  const items = playground.items?.length ? playground.items : defaultContent.playground.items;
  const visualItems = visual.items?.length ? visual.items : defaultContent.visual.items;

  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Edit Portfolio Sections</title>
    <style>
      :root{color-scheme:dark;--ink:#09090b;--panel:#121215;--panel2:#19191d;--bone:#f5efe6;--muted:#a9a19a;--pink:#f44ba0;--line:#f5efe62b}*{box-sizing:border-box}body{margin:0;background:#09090b;color:var(--bone);font-family:Inter,Arial,sans-serif}main{max-width:1080px;margin:auto;padding:24px 16px 44px}.top{display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:18px}.jump{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}h1{font-size:clamp(38px,7vw,76px);line-height:.9;margin:0;text-transform:uppercase}.kicker,.hint{font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:var(--pink)}.hint,.file-preview{color:var(--muted);line-height:1.6;text-transform:none;letter-spacing:0}.file-preview{min-height:20px;margin:0;font-size:12px}.card,.item{background:#121215;border:1px solid var(--line)}.card{margin-bottom:22px}.card-head{display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid var(--line);padding:16px}.card-head strong{font-size:18px;text-transform:uppercase}.form-body{display:grid;gap:18px;padding:16px}.grid{display:grid;gap:12px}fieldset{border:0;margin:0;padding:0;display:grid;gap:12px}legend{margin-bottom:8px;color:var(--pink);font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:.14em}label{display:grid;gap:7px;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#ff8dc5}input,textarea,select{width:100%;background:var(--panel2);color:var(--bone);border:1px solid var(--line);padding:12px;font:inherit;outline:none}input:focus,textarea:focus,select:focus{border-color:var(--pink);box-shadow:0 0 0 3px #f44ba033}textarea{min-height:88px;resize:vertical}button,a.button{display:inline-flex;align-items:center;justify-content:center;background:var(--pink);color:var(--ink);border:0;padding:12px 15px;font-weight:900;text-transform:uppercase;text-decoration:none;cursor:pointer}.button.secondary,.add{background:var(--bone)}.actions{display:flex;gap:10px;flex-wrap:wrap}.item{display:grid;gap:12px;padding:14px;margin-bottom:12px}.item-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.item-title{margin:0;color:var(--bone);font-size:15px;text-transform:uppercase}.remove{background:transparent;color:var(--pink);border:1px solid #f44ba066}.thumb{width:100%;max-width:150px;aspect-ratio:4/3;object-fit:cover;border:1px solid var(--line);background:var(--panel2)}details{border:1px solid var(--line);background:#101013;padding:12px}summary{cursor:pointer;color:var(--bone);font-weight:900;text-transform:uppercase;font-size:12px;letter-spacing:.12em}details .grid{margin-top:12px}@media(min-width:760px){.grid{grid-template-columns:repeat(2,1fr)}.span-2{grid-column:span 2}}</style>
  </head>
  <body>
    <main>
      <div class="top"><div><p class="kicker">Portfolio Buckets</p><h1>Sections</h1></div><a class="button secondary" href="/admin">Back to Admin</a></div>
      <nav class="jump"><a class="button" href="#playground">Things I Made</a><a class="button" href="#visual">Beyond the Browser</a></nav>
      <form id="playground" class="card" action="/admin/content" method="post" enctype="multipart/form-data">
        <input type="hidden" name="section" value="playground" />
        <div class="card-head"><strong>Things I made because I couldn't leave the idea alone.</strong><p class="hint">Creative experiment projects.</p></div>
        <div class="form-body">
          <fieldset>
            <legend>Section Header</legend>
            <label>Small Label<input name="playgroundEyebrow" value="${field(playground.eyebrow)}" /></label>
            <label>Main Title<textarea name="playgroundTitle">${field(playground.title)}</textarea></label>
          </fieldset>
          <fieldset>
            <legend>Experiment Cards</legend>
            <div id="items">
              ${items.map((item, index) => experimentFields(item, index)).join("")}
            </div>
            <button class="add" type="button" id="add-item">Add Card</button>
          </fieldset>
          <div class="actions"><button type="submit">Save Playground</button></div>
        </div>
      </form>
      <form id="visual" class="card" action="/admin/content" method="post" enctype="multipart/form-data">
        <input type="hidden" name="section" value="visual" />
        <div class="card-head"><strong>Beyond the Browser</strong><p class="hint">Poster, identity, typography, and visual design projects.</p></div>
        <div class="form-body">
          <fieldset>
            <legend>Section Header</legend>
            <label>Small Label<input name="visualEyebrow" value="${field(visual.eyebrow)}" /></label>
            <label>Main Title<input name="visualTitle" value="${field(visual.title)}" /></label>
            <label>Description<textarea name="visualDescription">${field(visual.description)}</textarea></label>
          </fieldset>
          <fieldset>
            <legend>Visual Projects</legend>
            <div id="visual-items">
              ${visualItems.map((item, index) => visualFields(item, index)).join("")}
            </div>
            <button class="add" type="button" id="add-visual">Add Visual Project</button>
          </fieldset>
          <div class="actions"><button type="submit">Save Beyond the Browser</button></div>
        </div>
      </form>
    </main>
    <template id="item-template">${experimentFields({}, "__INDEX__")}</template>
    <template id="visual-template">${visualFields({}, "__INDEX__")}</template>
    <script>
      const items = document.querySelector("#items");
      const template = document.querySelector("#item-template");
      function syncIndexes() {
        items.querySelectorAll(".item").forEach((item, index) => {
          item.querySelector(".item-title").textContent = "Card " + String(index + 1).padStart(2, "0");
          item.querySelectorAll("[name]").forEach((field) => {
            field.name = field.name.replace(/items\\[[^\\]]+\\]/, "items[" + index + "]");
          });
        });
      }
      document.querySelector("#add-item").addEventListener("click", () => {
        items.insertAdjacentHTML("beforeend", template.innerHTML.replaceAll("__INDEX__", items.children.length));
        syncIndexes();
      });
      items.addEventListener("click", (event) => {
        if (!event.target.matches("[data-remove]")) return;
        event.target.closest(".item").remove();
        syncIndexes();
      });
      const visualItems = document.querySelector("#visual-items");
      const visualTemplate = document.querySelector("#visual-template");
      function syncVisualIndexes() {
        visualItems.querySelectorAll(".item").forEach((item, index) => {
          item.querySelector(".item-title").textContent = "Visual Project " + String(index + 1).padStart(2, "0");
          item.querySelectorAll("[name]").forEach((field) => {
            field.name = field.name.replace(/visualItems\\[[^\\]]+\\]/, "visualItems[" + index + "]");
          });
          const upload = item.querySelector("input[type=file]");
          if (upload) upload.name = "visualImages_" + index;
        });
      }
      document.querySelector("#add-visual").addEventListener("click", () => {
        visualItems.insertAdjacentHTML("beforeend", visualTemplate.innerHTML.replaceAll("__INDEX__", visualItems.children.length));
        syncVisualIndexes();
      });
      visualItems.addEventListener("click", (event) => {
        if (!event.target.matches("[data-remove]")) return;
        event.target.closest(".item").remove();
        syncVisualIndexes();
      });
      document.querySelectorAll(".image-input").forEach((input) => {
        input.addEventListener("change", () => {
          const preview = input.parentElement.querySelector(".file-preview");
          const files = Array.from(input.files || []);
          preview.textContent = files.length ? files.map((file) => file.name).join(" / ") : input.dataset.emptyText;
        });
      });
    </script>
  </body>
  </html>`;
}

function experimentFields(item, index) {
  const images = item.images?.length ? item.images : [item.image].filter(Boolean);
  return `<section class="item">
    <div class="item-head"><h3 class="item-title">Card ${String(Number(index) + 1).padStart(2, "0")}</h3><button class="remove" type="button" data-remove>Remove</button></div>
    ${images[0] ? `<img class="thumb" src="${field(images[0])}" alt="" />` : ""}
    <div class="grid">
      <label class="span-2">Title<input name="items[${index}][title]" value="${field(item.title)}" placeholder="Experiment title" /></label>
      <label>Choose Multiple Images<input class="image-input" name="itemImages_${index}" type="file" accept="image/*" multiple data-empty-text="No new images selected." /><p class="file-preview">Hold Ctrl and select more than one image.</p></label>
      <label class="span-2">Note<textarea name="items[${index}][note]">${field(item.note)}</textarea></label>
    </div>
    <details>
      <summary>Optional info</summary>
      <div class="grid">
        <label>Number<input name="items[${index}][number]" value="${field(item.number)}" placeholder="001" /></label>
        <label>Year<input name="items[${index}][year]" value="${field(item.year)}" placeholder="2026" /></label>
        <label>Type<input name="items[${index}][type]" value="${field(item.type)}" placeholder="Motion Prototype" /></label>
        <label>Technology<input name="items[${index}][technology]" value="${field(item.technology)}" placeholder="React / CSS" /></label>
        <label class="span-2">Existing Images<textarea name="items[${index}][existingImages]">${field(images.join("\n"))}</textarea></label>
        <label class="span-2">Image Alt<input name="items[${index}][imageAlt]" value="${field(item.imageAlt)}" /></label>
      </div>
    </details>
  </section>`;
}

function visualFields(item, index) {
  const images = item.images?.length ? item.images : [item.image].filter(Boolean);
  return `<section class="item">
    <div class="item-head"><h3 class="item-title">Visual Project ${String(Number(index) + 1).padStart(2, "0")}</h3><button class="remove" type="button" data-remove>Remove</button></div>
    ${images[0] ? `<img class="thumb" src="${field(images[0])}" alt="" />` : ""}
    <div class="grid">
      <label>Title<input name="visualItems[${index}][title]" value="${field(item.title)}" placeholder="Poster Design" /></label>
      <label>Category<input name="visualItems[${index}][category]" value="${field(item.category)}" placeholder="Editorial Print" /></label>
      <label>Choose Multiple Images<input class="image-input" name="visualImages_${index}" type="file" accept="image/*" multiple data-empty-text="No new images selected." /><p class="file-preview">Hold Ctrl and select more than one image.</p></label>
      <label class="span-2">Note<textarea name="visualItems[${index}][note]">${field(item.note)}</textarea></label>
    </div>
    <details>
      <summary>Optional info</summary>
      <div class="grid">
        <label>Year<input name="visualItems[${index}][year]" value="${field(item.year)}" placeholder="2026" /></label>
        <label>Variant<select name="visualItems[${index}][variant]"><option value="image" ${item.variant === "image" ? "selected" : ""}>Image</option><option value="large" ${item.variant === "large" ? "selected" : ""}>Large</option><option value="wide" ${item.variant === "wide" ? "selected" : ""}>Wide</option><option value="pink" ${item.variant === "pink" ? "selected" : ""}>Pink</option><option value="dark" ${item.variant === "dark" ? "selected" : ""}>Dark</option></select></label>
        <label class="span-2">Existing Images<textarea name="visualItems[${index}][existingImages]">${field(images.join("\n"))}</textarea></label>
        <label class="span-2">Image Alt<input name="visualItems[${index}][imageAlt]" value="${field(item.imageAlt)}" /></label>
      </div>
    </details>
  </section>`;
}

async function contentFromFields(fields, files, currentContent) {
  if (fields.section === "visual") return visualContentFromFields(fields, files, currentContent);

  const grouped = {};
  for (const [name, value] of Object.entries(fields)) {
    const match = name.match(/^items\[(\d+)\]\[(\w+)\]$/);
    if (!match) continue;
    grouped[match[1]] = { ...(grouped[match[1]] ?? {}), [match[2]]: value.trim() };
  }

  const items = await Promise.all(
    Object.keys(grouped)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => grouped[key])
      .filter((item) => item.title || item.note)
      .map(async (item, index) => {
        const uploaded = await saveUploadedImages(files[`itemImages_${index}`]);
        const images = [...parseList(item.existingImages), ...uploaded].filter(Boolean);
        return {
          number: item.number || String(index + 1).padStart(3, "0"),
          title: item.title || "Untitled Experiment",
          type: item.type || "Creative Study",
          technology: item.technology || "",
          note: item.note || "",
          year: item.year || new Date().getFullYear().toString(),
          image: images[0] || "",
          images,
          imageAlt: item.imageAlt || `${item.title || "Experiment"} preview`,
        };
      }),
  );

  return {
    ...currentContent,
    playground: {
      eyebrow: fields.playgroundEyebrow?.trim() || defaultContent.playground.eyebrow,
      title: fields.playgroundTitle?.trim() || defaultContent.playground.title,
      items,
    },
  };
}

async function visualContentFromFields(fields, files, currentContent) {
  const grouped = {};
  for (const [name, value] of Object.entries(fields)) {
    const match = name.match(/^visualItems\[(\d+)\]\[(\w+)\]$/);
    if (!match) continue;
    grouped[match[1]] = { ...(grouped[match[1]] ?? {}), [match[2]]: value.trim() };
  }

  const items = [];
  for (const key of Object.keys(grouped).sort((a, b) => Number(a) - Number(b))) {
    const item = grouped[key];
    if (!item.title && !item.note) continue;
    const uploaded = await saveUploadedImages(files[`visualImages_${key}`]);
    const images = [...parseList(item.existingImages), ...uploaded].filter(Boolean);
    const image = images[0] || "";
    items.push({
      title: item.title || "Untitled Visual Project",
      category: item.category || "Visual Design",
      year: item.year || new Date().getFullYear().toString(),
      note: item.note || "",
      image,
      images,
      imageAlt: item.imageAlt || `${item.title || "Visual project"} preview`,
      variant: ["large", "image", "wide", "pink", "dark"].includes(item.variant) ? item.variant : "image",
    });
  }

  return {
    ...currentContent,
    visual: {
      eyebrow: fields.visualEyebrow?.trim() || defaultContent.visual.eyebrow,
      title: fields.visualTitle?.trim() || defaultContent.visual.title,
      description: fields.visualDescription?.trim() || defaultContent.visual.description,
      items,
    },
  };
}

async function saveUploadedImages(fileInput) {
  const files = Array.isArray(fileInput) ? fileInput : [fileInput].filter(Boolean);
  const urls = [];

  for (const file of files) {
    if (!file?.filename || file.data.length === 0) continue;
    const extension = extname(file.filename).toLowerCase() || ".jpg";
    const filename = `${Date.now()}-${urls.length}-${slugify(file.filename.replace(extension, ""))}${extension}`;
    await writeFile(join(uploadDir, filename), file.data);
    urls.push(`${publicBaseUrl}/uploads/${filename}`);
  }

  return urls;
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "OPTIONS") return send(response, 204, "");

  if (request.method === "GET" && url.pathname === "/api/projects") {
    return send(response, 200, JSON.stringify(await readProjects()), { "Content-Type": "application/json" });
  }

  if (request.method === "GET" && url.pathname === "/api/content") {
    return send(response, 200, JSON.stringify(await readContent()), { "Content-Type": "application/json" });
  }

  if (request.method === "GET" && url.pathname === "/admin") {
    return send(response, 200, adminPage(await readProjects()), { "Content-Type": "text/html; charset=utf-8" });
  }

  if (request.method === "GET" && url.pathname === "/admin/content") {
    return send(response, 200, contentPage(await readContent()), { "Content-Type": "text/html; charset=utf-8" });
  }

  if (request.method === "POST" && url.pathname === "/admin/content") {
    const { fields, files } = parseMultipart(await readBody(request), request.headers["content-type"] ?? "");
    const currentContent = await readContent();
    await writeContent(await contentFromFields(fields, files, currentContent));
    response.writeHead(303, { Location: "/admin/content" });
    return response.end();
  }

  if (request.method === "POST" && url.pathname === "/admin/projects") {
    const { fields, files } = parseMultipart(await readBody(request), request.headers["content-type"] ?? "");
    const projects = await readProjects();
    const imageUrls = await saveUploadedImages(files.imageFile);
    projects.push(projectFromFields(fields, imageUrls));
    await writeProjects(projects);
    response.writeHead(303, { Location: "/admin" });
    return response.end();
  }

  if (request.method === "GET" && url.pathname.startsWith("/admin/edit/")) {
    const id = decodeURIComponent(url.pathname.replace("/admin/edit/", ""));
    const projects = await readProjects();
    return send(response, 200, editPage(projects.find((project) => project.id === id)), { "Content-Type": "text/html; charset=utf-8" });
  }

  if (request.method === "POST" && url.pathname.startsWith("/admin/projects/")) {
    const parts = url.pathname.split("/");
    const id = decodeURIComponent(parts[3] ?? "");
    const projects = await readProjects();

    if (parts[4] === "delete") {
      await writeProjects(projects.filter((project) => project.id !== id));
      response.writeHead(303, { Location: "/admin" });
      return response.end();
    }

    const { fields, files } = parseMultipart(await readBody(request), request.headers["content-type"] ?? "");
    const current = projects.find((project) => project.id === id);
    const imageUrls = await saveUploadedImages(files.imageFile);
    const next = projectFromFields(
      { ...fields, id, existingImages: fields.existingImages || current?.images?.join("\n") || current?.image },
      imageUrls,
    );
    await writeProjects(projects.map((project) => (project.id === id ? next : project)));
    response.writeHead(303, { Location: "/admin" });
    return response.end();
  }

  if (request.method === "GET" && url.pathname.startsWith("/uploads/")) {
    const filename = url.pathname.replace("/uploads/", "");
    const stream = createReadStream(join(uploadDir, filename));
    stream.on("error", () => send(response, 404, "Not found"));
    response.writeHead(200, { ...jsonHeaders });
    return stream.pipe(response);
  }

  return send(response, 404, "Not found");
}).listen(port, "127.0.0.1", () => {
  console.log(`Backend: http://127.0.0.1:${port}`);
  console.log(`Admin:   http://127.0.0.1:${port}/admin`);
});
