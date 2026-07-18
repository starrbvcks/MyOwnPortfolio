import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const dataDir = join(root, "data");
const uploadDir = join(root, "uploads");
const dataFile = join(dataDir, "projects.json");
const port = Number(process.env.PORT ?? 8011);

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
      :root{color-scheme:dark;--ink:#09090b;--panel:#121215;--panel2:#19191d;--bone:#f5efe6;--muted:#a9a19a;--pink:#f44ba0;--line:#f5efe62b}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,#2b1122 0,#09090b 34rem);color:var(--bone);font-family:Inter,Arial,sans-serif}main{max-width:1220px;margin:auto;padding:28px 18px 48px}.top{display:flex;justify-content:space-between;gap:16px;align-items:end;flex-wrap:wrap;margin-bottom:22px}h1{font-size:clamp(44px,8vw,100px);line-height:.86;margin:0;text-transform:uppercase;letter-spacing:0}.kicker,.hint{font-size:12px;text-transform:uppercase;letter-spacing:.16em;color:var(--pink)}.hint{color:var(--muted);line-height:1.7;text-transform:none;letter-spacing:0}.shell{display:grid;gap:22px;grid-template-columns:1fr}.card{background:color-mix(in srgb,var(--panel) 92%,transparent);border:1px solid var(--line);box-shadow:0 20px 60px #0008}.card-head{display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid var(--line);padding:18px}.card-title{margin:0;font-size:18px;text-transform:uppercase}.form-body{display:grid;gap:22px;padding:18px}fieldset{border:0;margin:0;padding:0;display:grid;gap:14px}legend{margin-bottom:10px;color:var(--pink);font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:.16em}label{display:grid;gap:7px;font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#ff8dc5}input,textarea,select{width:100%;background:var(--panel2);color:var(--bone);border:1px solid var(--line);padding:13px 12px;font:inherit;outline:none}input:focus,textarea:focus,select:focus{border-color:var(--pink);box-shadow:0 0 0 3px #f44ba033}textarea{min-height:92px;resize:vertical}button,a.button,.ghost-link{display:inline-flex;align-items:center;justify-content:center;background:var(--pink);color:var(--ink);border:0;padding:13px 16px;font-weight:900;text-transform:uppercase;text-decoration:none;cursor:pointer}.ghost-link{background:transparent;color:var(--pink);border:1px solid #f44ba066;padding:9px 12px}.grid{display:grid;gap:14px}.actions{display:flex;gap:10px;flex-wrap:wrap}.table-wrap{overflow:auto}.pill{display:inline-flex;border:1px solid var(--pink);color:var(--pink);padding:7px 10px;font-family:monospace}.project-cell{display:flex;gap:12px;align-items:center;min-width:260px}.project-cell img,.empty-thumb{width:58px;height:58px;object-fit:cover;border:1px solid var(--line);background:var(--panel2)}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid var(--line);padding:14px;text-align:left;white-space:nowrap}th{font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)}small{display:block;color:var(--muted);margin-top:4px;white-space:normal}@media(min-width:860px){.shell{grid-template-columns:minmax(0,1.25fr) minmax(360px,.75fr)}.grid{grid-template-columns:repeat(2,1fr)}.span-2{grid-column:span 2}}</style>
  </head>
  <body>
    <main>
      <div class="top"><div><p class="kicker">SETAREH Portfolio CMS</p><h1>Admin</h1></div><a class="button" href="/admin">Refresh</a></div>
      <div class="shell">
        <form class="card" action="/admin/projects" method="post" enctype="multipart/form-data">
          <div class="card-head"><h2 class="card-title">Add New Work</h2><p class="hint">Upload one or many images. More than three images will show manual pagination on the site.</p></div>
          <div class="form-body">
            <fieldset><legend>Project Basics</legend><div class="grid">
              <label>Title<input name="title" required placeholder="Project name" /></label>
              <label>Number<input name="number" placeholder="04" /></label>
              <label>Year<input name="year" value="2026" /></label>
              <label>Category<input name="category" placeholder="Editorial Website" /></label>
              <label>Role<input name="role" placeholder="Web Design / Development" /></label>
              <label>Status<input name="status" placeholder="Published" /></label>
              <label>Project Type<input name="projectType" placeholder="Client project / Concept" /></label>
              <label>Variant<select name="variant"><option value="split">Split</option><option value="featured">Featured</option><option value="pink">Pink</option></select></label>
            </div></fieldset>
            <fieldset><legend>Images</legend><div class="grid">
              <label>Upload Images<input name="imageFile" type="file" accept="image/*" multiple /></label>
              <label>Image URLs<textarea name="imageUrls" placeholder="One URL per line, or comma separated"></textarea></label>
              <label class="span-2">Image Alt<input name="imageAlt" placeholder="Short description for accessibility" /></label>
            </div></fieldset>
            <fieldset><legend>Story</legend>
              <label>Description<textarea name="description"></textarea></label>
              <div class="grid">
                <label>Services<input name="services" placeholder="Design, Development" /></label>
                <label>Responsibilities<input name="responsibilities" placeholder="Art direction, UI system" /></label>
                <label>Technologies<input name="technologies" placeholder="React, TypeScript" /></label>
                <label>Tools<input name="tools" placeholder="Figma / React / Tailwind" /></label>
              </div>
              <label>Challenge<textarea name="challenge"></textarea></label>
              <label>Approach<textarea name="solution"></textarea></label>
              <label>Interaction<textarea name="interaction"></textarea></label>
              <label>Accessibility<textarea name="accessibilityNotes"></textarea></label>
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
      :root{color-scheme:dark;--ink:#09090b;--panel:#121215;--panel2:#19191d;--bone:#f5efe6;--muted:#a9a19a;--pink:#f44ba0;--line:#f5efe62b}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,#2b1122 0,#09090b 34rem);color:var(--bone);font-family:Inter,Arial,sans-serif}main{max-width:1180px;margin:auto;padding:28px 18px 48px}.top{display:flex;justify-content:space-between;gap:16px;align-items:end;flex-wrap:wrap;margin-bottom:22px}h1{font-size:clamp(40px,8vw,92px);line-height:.86;margin:0;text-transform:uppercase}.kicker,.hint{font-size:12px;text-transform:uppercase;letter-spacing:.16em;color:var(--pink)}.hint{color:var(--muted);line-height:1.7;text-transform:none;letter-spacing:0}.card{background:color-mix(in srgb,var(--panel) 92%,transparent);border:1px solid var(--line);box-shadow:0 20px 60px #0008}.card-head{display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid var(--line);padding:18px}.form-body{display:grid;gap:22px;padding:18px}fieldset{border:0;margin:0;padding:0;display:grid;gap:14px}legend{margin-bottom:10px;color:var(--pink);font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:.16em}label{display:grid;gap:7px;font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#ff8dc5}input,textarea,select{width:100%;background:var(--panel2);color:var(--bone);border:1px solid var(--line);padding:13px 12px;font:inherit;outline:none}input:focus,textarea:focus,select:focus{border-color:var(--pink);box-shadow:0 0 0 3px #f44ba033}textarea{min-height:92px;resize:vertical}button,a.button{display:inline-flex;align-items:center;justify-content:center;background:var(--pink);color:var(--ink);border:0;padding:13px 16px;font-weight:900;text-transform:uppercase;text-decoration:none;cursor:pointer}.danger{background:var(--bone)}.grid{display:grid;gap:14px}.span-2{grid-column:1 / -1}.actions{display:flex;gap:10px;flex-wrap:wrap}.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}.gallery img{width:100%;aspect-ratio:4/3;object-fit:cover;border:1px solid var(--line)}@media(min-width:760px){.grid{grid-template-columns:repeat(2,1fr)}}</style>
  </head>
  <body>
    <main>
      <div class="top"><div><p class="kicker">Editing</p><h1>${field(project.title)}</h1></div><a class="button" href="/admin">Back</a></div>
      <form class="card" action="/admin/projects/${project.id}" method="post" enctype="multipart/form-data">
        <div class="card-head"><strong>Project Details</strong><p class="hint">Keep existing image URLs, add new URLs, or upload more files.</p></div>
        <div class="form-body">
          <fieldset><legend>Project Basics</legend><div class="grid">
            <label>Title<input name="title" required value="${field(project.title)}" /></label>
            <label>Number<input name="number" value="${field(project.number)}" /></label>
            <label>Year<input name="year" value="${field(project.year)}" /></label>
            <label>Category<input name="category" value="${field(project.category)}" /></label>
            <label>Role<input name="role" value="${field(project.role)}" /></label>
            <label>Status<input name="status" value="${field(project.status)}" /></label>
            <label>Project Type<input name="projectType" value="${field(project.projectType)}" /></label>
            <label>Variant<select name="variant"><option value="split" ${project.variant === "split" ? "selected" : ""}>Split</option><option value="featured" ${project.variant === "featured" ? "selected" : ""}>Featured</option><option value="pink" ${project.variant === "pink" ? "selected" : ""}>Pink</option></select></label>
          </div></fieldset>
          <fieldset><legend>Images</legend>
            <div class="gallery">${(project.images ?? [project.image].filter(Boolean)).map((image) => `<img src="${field(image)}" alt="" />`).join("")}</div>
            <div class="grid">
              <label>Existing Images<textarea name="existingImages">${field((project.images ?? [project.image].filter(Boolean)).join("\n"))}</textarea></label>
              <label>Add Image URLs<textarea name="imageUrls" placeholder="New URLs only"></textarea></label>
              <label>Upload More Images<input name="imageFile" type="file" accept="image/*" multiple /></label>
              <label>Image Alt<input name="imageAlt" value="${field(project.imageAlt)}" /></label>
            </div>
          </fieldset>
          <fieldset><legend>Story</legend>
            <label>Description<textarea name="description">${field(project.description)}</textarea></label>
            <div class="grid">
              <label>Services<input name="services" value="${field(project.services?.join(", "))}" /></label>
              <label>Responsibilities<input name="responsibilities" value="${field(project.responsibilities?.join(", "))}" /></label>
              <label>Technologies<input name="technologies" value="${field(project.technologies?.join(", "))}" /></label>
              <label>Tools<input name="tools" value="${field(project.tools)}" /></label>
            </div>
            <label>Challenge<textarea name="challenge">${field(project.challenge)}</textarea></label>
            <label>Approach<textarea name="solution">${field(project.solution)}</textarea></label>
            <label>Interaction<textarea name="interaction">${field(project.interaction)}</textarea></label>
            <label>Accessibility<textarea name="accessibilityNotes">${field(project.accessibilityNotes)}</textarea></label>
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
  </body>
  </html>`;
}

async function saveUploadedImages(fileInput) {
  const files = Array.isArray(fileInput) ? fileInput : [fileInput].filter(Boolean);
  const urls = [];

  for (const file of files) {
    if (!file?.filename || file.data.length === 0) continue;
    const extension = extname(file.filename).toLowerCase() || ".jpg";
    const filename = `${Date.now()}-${urls.length}-${slugify(file.filename.replace(extension, ""))}${extension}`;
    await writeFile(join(uploadDir, filename), file.data);
    urls.push(`/uploads/${filename}`);
  }

  return urls;
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "OPTIONS") return send(response, 204, "");

  if (request.method === "GET" && url.pathname === "/api/projects") {
    return send(response, 200, JSON.stringify(await readProjects()), { "Content-Type": "application/json" });
  }

  if (request.method === "GET" && url.pathname === "/admin") {
    return send(response, 200, adminPage(await readProjects()), { "Content-Type": "text/html; charset=utf-8" });
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
