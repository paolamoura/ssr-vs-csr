const USERS = [
  { id: 1, name: "Axl Rose",    email: "axl@example.com",    role: "Designer" },
  { id: 2, name: "Lana del Rey",   email: "lana@example.com",  role: "Frontend" },
  { id: 3, name: "Fagner",  email: "fagner@example.com",  role: "Backend" },
  { id: 4, name: "Pabllo Vittar",  email: "pabllo@example.com",  role: "Data" },
  { id: 5, name: "Joao Gomes",  email: "joao@example.com",  role: "PM" },
  { id: 6, name: "Charli xcx",  email: "charli@example.com", role: "DevOps" },
];

const $list   = document.querySelector('#user-list');
const $tpl    = document.querySelector('#user-item');
const $search = document.querySelector('#search');
const $status = document.querySelector('#status');
const $prev   = document.querySelector('#prev');
const $next   = document.querySelector('#next');
const $pinfo  = document.querySelector('#page-info');

const $modal  = document.querySelector('#user-modal');
const $close  = document.querySelector('#close-modal');
const $mName  = document.querySelector('#m-name');
const $mEmail = document.querySelector('#m-email');
const $mRole  = document.querySelector('#m-role');

let state = {
  q: "",
  page: 1,
  pageSize: 4,
  filtered: USERS
};

function filterUsers(q) {
  q = q.trim().toLowerCase();
  if (!q) return USERS;
  return USERS.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.role.toLowerCase().includes(q)
  );
}

function paginate(items, page, pageSize) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * pageSize;
  return {
    page: p,
    pages,
    total,
    slice: items.slice(start, start + pageSize)
  };
}

function renderList(items) {
  $list.innerHTML = '';
  for (const u of items) {
    const node = $tpl.content.cloneNode(true);
    node.querySelector('.user-card').dataset.id = String(u.id);
    node.querySelector('.title').textContent = u.name;
    node.querySelector('.email').textContent = `Email: ${u.email}`;
    node.querySelector('.role').textContent  = `Cargo: ${u.role}`;
    $list.appendChild(node);
  }
}

function update() {
  state.filtered = filterUsers(state.q);
  const { page, pages, total, slice } = paginate(state.filtered, state.page, state.pageSize);
  state.page = page;

  renderList(slice);
  $pinfo.textContent = `Página ${page}/${pages} • ${total} resultado(s)`;
  $prev.disabled = page <= 1;
  $next.disabled = page >= pages;
}

function openModalById(id) {
  const u = USERS.find(x => String(x.id) === String(id));
  if (!u) return;
  $mName.textContent = u.name;
  $mEmail.textContent = `Email: ${u.email}`;
  $mRole.textContent  = `Cargo: ${u.role}`;
  if (typeof $modal.showModal === 'function') $modal.showModal(); else $modal.setAttribute('open', '');
}

function init() {
  setTimeout(() => {
    $status.textContent = 'Pronto';
    update();
  }, 200);

  $search.addEventListener('input', () => {
    state.q = $search.value;
    state.page = 1;
    update();
  });

  $prev.addEventListener('click', () => { state.page--; update(); });
  $next.addEventListener('click', () => { state.page++; update(); });

  $list.addEventListener('click', (e) => {
    const btn = e.target.closest('.see-more');
    if (!btn) return;
    const li = btn.closest('.user-card');
    openModalById(li?.dataset.id);
  });

  $close.addEventListener('click', () => $modal.close?.());
  $modal.addEventListener('click', (e) => {
    if (e.target === $modal) $modal.close?.();
  });
}

document.addEventListener('DOMContentLoaded', init);
