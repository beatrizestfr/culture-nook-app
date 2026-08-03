# My Culture Nook — Study Guide (Demo + Theory Exam)

This guide pairs each theory topic from your `theory/` slide decks with the matching real code in your project, explained line by line, beginner-style. It ends with a prioritized revision plan.

---

## 0. The Big Picture — what this app actually is

**My Culture Nook** is a personal media-tracking app (movies/books/albums). A user logs in, the app loads *their* items and lists from a fake backend (`json-server` reading `db.json`), and they can add/edit/delete items, organize them into lists, rate them, and tag them.

Tech stack mapped to your theory decks:
- **React** (07, 08, 09, 11) — components, props, state, hooks
- **React Router** (13) — page navigation (`/`, `/items/:id`, `/lists`, `/login`...)
- **Forms & controlled inputs** (10) — login form, add/edit item form, list creation
- **HTTP requests / useEffect** (12) — fetching items/lists from `json-server` at `http://localhost:3001`
- **Bootstrap / responsive design** (06) — *mostly NOT used*; the project uses hand-written CSS + inline styles + CSS variables instead (see the "confusing/notable" section — this is something a teacher could ask about)
- **State management / Context** (11) — `LibraryContext.jsx` is the centerpiece

**Files you will reference constantly during the demo:**
1. `src/App.js` — routing setup
2. `src/context/LibraryContext.jsx` — all shared state + API calls (the "brain")
3. `src/pages/Library.jsx` — main page, filtering, lists rendering
4. `src/pages/EditItem.jsx` — the big form (controlled inputs, arrays in state)
5. `src/components/Navbar.jsx` — small component, conditional rendering, events

---

## TOPIC 1 — JSX, Components, and the file/folder structure

### Beginner-friendly explanation
React doesn't build pages out of plain HTML files. Instead, you build small reusable pieces called **components**. Each component is a JavaScript **function** that returns something that *looks* like HTML but is actually **JSX** (JavaScript XML) — a syntax that lets you mix HTML-like tags with JavaScript logic. The browser cannot read JSX directly; a build tool (Vite/CRA) converts it into plain JavaScript calls that create the page.

Rules of JSX (from theory deck 07, slide 17):
- Every tag must be closed: `<br />`, `<img />`
- A component must return **one single root element** (wrap multiple elements in a `<div>` or a **Fragment** `<>...</>`)
- To insert JavaScript values/expressions inside the markup, wrap them in curly braces `{ }`

Component naming rule (deck 07, slide 13): the function name **must start with an uppercase letter** (PascalCase) — this is how React tells your custom component `<Navbar />` apart from a built-in HTML tag like `<nav>`.

### Example from the theory presentation
Slide 16-19 of deck 07 shows: define a function `App`, `return` JSX that "looks like HTML but is not always the same", then `export` it so other files can `import` and use it.

### Matching example from your project code
[`src/components/Navbar.jsx:7`](src/components/Navbar.jsx#L7):
```jsx
export default function Navbar() {
  const { user, logout } = useLibrary();
  ...
  return (
    <nav style={{ ... }}>
      <div className="page-container" ...>
        ...
      </div>
    </nav>
  );
}
```

### Line-by-line explanation
- `export default function Navbar() {` — declares a component named `Navbar` (capital N) and makes it the default export of this file, so `App.js` can `import Navbar from './components/Navbar'`.
- `const { user, logout } = useLibrary();` — calls a custom hook to read shared data (explained in Topic 6).
- `return ( <nav> ... </nav> )` — the component returns **one root element**, `<nav>`, which itself contains a `<div>`. This satisfies the "single root element" JSX rule.
- Inside, you'll find `{ }` blocks like `{user?.initials || 'U'}` — JavaScript expressions evaluated and inserted into the markup.

### Why it matters for my project
Your whole app (`App.js`) is just a tree of components: `App` → `LibraryProvider` → `BrowserRouter` → `AppRoutes` → (`Navbar` + a page like `LibraryPage`) → (`ItemCard`, `MediaCover`...). Understanding that pages = components made of smaller components is the key mental model.

### Why it would break if changed
- If you renamed `Navbar` to `navbar` (lowercase), React would try to render an HTML tag `<navbar>` instead of your component — it simply wouldn't show your code.
- If `Navbar` returned two sibling elements without wrapping them (`return <div/><div/>`), you'd get a JSX compile error: "Adjacent JSX elements must be wrapped in an enclosing tag."

### How to explain it in the demo
"Each visual piece of my app — the navbar, an item card, a list card — is its own component, which is just a function that returns JSX. I organized them in `components/` (small reusable pieces) and `pages/` (full screens that the router displays)."

### Possible teacher questions and simple answers
- **Q: Why must component names start with a capital letter?**
  A: So React can distinguish your custom components from built-in HTML elements (`<div>`, `<nav>`) — lowercase tag names are treated as HTML, uppercase as component references.
- **Q: What is JSX, really?**
  A: Syntax that looks like HTML but compiles down to JavaScript function calls (`React.createElement(...)`) that build the UI tree.
- **Q: Why do all your components return one root element?**
  A: Because a function can only return one value; JSX enforces a single root node (or a Fragment) so React knows the shape of what to render.

---

## TOPIC 2 — Fragments, imports/exports, and file organization

### Beginner-friendly explanation
- **`export default`** marks the "main" thing a file provides; **`export function X`** marks a "named" export (a file can have many).
- **`import X from './path'`** brings a default export in; **`import { Y } from './path'`** brings a named export in.
- A **Fragment** `<>...</>` groups elements without adding an extra wrapper `<div>` to the actual HTML — useful when you don't want to affect your CSS layout (deck 07, slide 17).

### Matching example from your project code
[`src/App.js:26-42`](src/App.js#L26-L42):
```jsx
return (
  <>
    <Navbar />
    <div className="page-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <Routes>
        ...
      </Routes>
    </div>
  </>
);
```
And exports/imports across the app, e.g. [`src/context/LibraryContext.jsx:12`](src/context/LibraryContext.jsx#L12) `export function LibraryProvider(...)` (named export) plus [`:245`](src/context/LibraryContext.jsx#L245) `export function useLibrary()` (a second named export from the same file), consumed via `import { LibraryProvider, useLibrary } from './context/LibraryContext';` in [`App.js:2`](src/App.js#L2).

### Line-by-line explanation
- `<>` ... `</>` — a Fragment. It lets `Navbar` and the page `<div>` sit side-by-side as "siblings" while still satisfying JSX's single-root-element rule, **without** adding a meaningless extra `<div>` wrapper to the DOM.
- `export function LibraryProvider` and `export function useLibrary` — two **named exports** from one file; that's why the import uses `{ }`.

### Why it matters / what would happen if changed
If you replaced the Fragment with a `<div>`, it would still work visually (because `Navbar` is `position: sticky`), but you'd add an unnecessary wrapper element to the DOM — a small inefficiency a teacher might probe ("why Fragment here and not div?").

If you changed `export function useLibrary` to `export default function useLibrary`, every import like `import { useLibrary } from ...` across 8 files would break and need to change to `import useLibrary from ...`.

### How to explain it in the demo
"I use a Fragment in `App.js` so I can place the Navbar and the page content next to each other without adding an extra wrapping div that would mess up my CSS."

### Possible teacher questions and simple answers
- **Q: What's the difference between default and named exports?**
  A: A file can have only one default export (imported without braces, can be renamed freely), but many named exports (imported with braces, names must match).
- **Q: Why use a Fragment instead of a div?**
  A: To group elements for JSX's "one root" rule without adding a real extra DOM node that could affect styling/layout.

---

## TOPIC 3 — Props (passing data into components)

### Beginner-friendly explanation
A **prop** (property) is how a parent component passes data *down* into a child component — like a function argument. You write `<Child myProp={value} />`, and inside `Child`, React collects all of these into one object called `props`. You can read `props.myProp`, or use **object destructuring** `function Child({ myProp })` to pull out fields directly (deck 08, slides 10-17).

Props can be **any JS value**: strings, numbers (`rating={5}` needs braces, not quotes — quotes would make it a string), objects (`{{ }}`), arrays, even functions.

There's also a **special `children` prop** — whatever you put *between* a component's opening and closing tags is automatically passed as `props.children`.

### Example from the theory presentation
Slide 11-17 of deck 08: `<CourseDetail course={selectedCourse} />`, then inside the child: `function CourseDetail({ course }) { return <h2>{course.title}</h2> }`.

### Matching example from your project code
[`src/components/ItemCard.jsx:6`](src/components/ItemCard.jsx#L6):
```jsx
export default function ItemCard({ item }) {
  const rating = Number(item.rating) || 0;
  ...
  <h3 ...>{item.title}</h3>
```
Called from [`src/pages/Library.jsx:99`](src/pages/Library.jsx#L99):
```jsx
{filtered.map(item => <ItemCard key={item.id} item={item} />)}
```

Another good one — a component receiving **several** props with **default values**, [`src/components/MediaCover.jsx:3`](src/components/MediaCover.jsx#L3):
```jsx
export default function MediaCover({ item, type = '', title = '', square = false }) {
```

### Line-by-line explanation
- `<ItemCard key={item.id} item={item} />` — the parent (`LibraryPage`) passes one prop named `item`, whose value is the current item object from the array. `key` is a special React-only prop (Topic 5).
- `export default function ItemCard({ item })` — **destructuring** pulls `item` straight out of the incoming props object, so inside the function you write `item.title` instead of `props.item.title`.
- `const rating = Number(item.rating) || 0;` — converts whatever `item.rating` is into a number; if that conversion fails (`NaN`, which is falsy), default to `0`.
- In `MediaCover`, `{ item, type = '', title = '', square = false }` destructures **four** props and gives three of them **default values** — so the component still works even if the parent doesn't pass `type`/`title`/`square`.

### Why it matters for my project
`ItemCard` is reused dozens of times (once per item in the grid) — each card gets *different* data through the `item` prop but uses the *same* JSX template. This is the "reusable component with input data" idea from deck 08 slide 10. `MediaCover` is reused in at least 5 places (`ItemCard`, `ListCard`, `ItemDetail`, `EditItem`, `ListDetail`) precisely because its props let it adapt: sometimes it gets a full `item` object, sometimes just a `type`/`title` (e.g., for an empty list preview), sometimes `square` for a small thumbnail layout.

### Why it would break if changed/removed
- If you wrote `<ItemCard item={item.id} />` (passing the id instead of the whole object), `item.title` inside the card would be `undefined` because `item` would be a number, not an object.
- If you removed the default `square = false` and called `<MediaCover item={item} />` without passing `square`, `square` would be `undefined`, and `undefined ? 'media-cover-square' : ''` evaluates to `''` anyway — so this *particular* default wouldn't break anything, but `type = ''` and `title = ''` defaults matter because of the fallback chain `item?.type || type || 'item'`.

### How to explain it in the demo
"`ItemCard` doesn't know anything about the whole library — it just receives one `item` object as a prop and displays it. That's what makes it reusable: the Library page maps over all items and creates one card per item, each with its own data passed through props."

### Possible teacher questions and simple answers
- **Q: Why curly braces for `rating={5}` but quotes for `type="movie"`?**
  A: Quotes pass a string. Curly braces let you pass any JS value/expression — needed for numbers, booleans, objects, arrays, or variables.
- **Q: What is `props.children`?**
  A: Whatever JSX you put between a component's opening/closing tags, automatically available as `props.children`. (Your project doesn't directly use `children` by name, but `LibraryProvider({ children })` in `LibraryContext.jsx:12` is exactly this — the `<App>`'s nested JSX becomes the provider's `children`.)
- **Q: How do you give a prop a default value?**
  A: Destructure it with `= defaultValue`, e.g. `function MediaCover({ square = false })`.

---

## TOPIC 4 — Dynamic content & attributes with `{ }`

### Beginner-friendly explanation
Inside JSX markup, anything in curly braces `{ }` is evaluated as a JavaScript **expression** (something that produces a value) and the result is inserted into the page. You can put variables, function calls, ternaries, template literals — but **not** statements like `if` or function *declarations* (deck 08, slides 2-3).

### Matching example from your project code
[`src/pages/ItemDetail.jsx:89`](src/pages/ItemDetail.jsx#L89):
```jsx
<p ...>{item.type?.toUpperCase()} {item.year && `- ${item.year}`}</p>
```
[`src/components/ItemCard.jsx:37`](src/components/ItemCard.jsx#L37):
```jsx
{'★'.repeat(rating)}<span className="stars-empty">{'☆'.repeat(5 - rating)}</span>
```

### Line-by-line explanation
- `{item.type?.toUpperCase()}` — calls a method on a value and inserts the *result* (a string like `"MOVIE"`).
- `item.year && \`- ${item.year}\`` — short-circuit: if `item.year` is truthy, evaluate and render the template string `- 1992`; if falsy (`undefined`/`""`), render nothing (`false`/`undefined` render as nothing in JSX).
- `'★'.repeat(rating)` — `★` is the Unicode star character `★`. `.repeat(n)` builds a string with the character repeated `n` times — this is how a number (e.g., `4`) becomes `★★★★`. The empty stars `☆` (`☆`) fill the remainder: `5 - rating`.

### Why it matters / what would break
This star-rendering trick (`repeat`) appears in **four different files** (`ItemCard`, `ItemDetail`, `EditItem`, `ListDetail`) with **identical code** — that's a sign of duplication a teacher might point out (see "Confusing/Repeated code" section below; a `<StarRating rating={n} />` component would be the cleaner fix).

If `rating` were a string `"4"` instead of a number `4`, `'★'.repeat("4")` would still work (JS coerces), but `5 - "4"` → `1` also coerces — so it "works by accident." That's why the code is careful to do `Number(item.rating) || 0` first.

### How to explain it in the demo
"To turn a numeric rating into stars, I use the string `repeat()` method on a Unicode star character — `'★'.repeat(4)` gives `★★★★`. I do the same for the empty stars to always show 5 total."

### Possible teacher questions and simple answers
- **Q: Can you write an `if` statement inside `{ }` in JSX?**
  A: No — only expressions. You use ternaries (`cond ? a : b`) or `&&` for conditional rendering instead.
- **Q: Why `item.type?.toUpperCase()` and not `item.type.toUpperCase()`?**
  A: The `?.` (optional chaining) prevents a crash if `item.type` is `undefined`/`null` — it short-circuits to `undefined` instead of throwing "Cannot read properties of undefined."

---

## TOPIC 5 — Lists, `.map()`, and the `key` prop

### Beginner-friendly explanation
To display an array of data as repeated UI elements, you transform the data array into an array of JSX elements using `.map()` (deck 08, slides 22-25). Each element in that array needs a unique **`key`** prop so React can efficiently track which item is which when the list changes (add/remove/reorder) — without keys, React may re-render or mix up elements incorrectly.

### Example from the theory presentation
Slide 24: `courses.map(courseItem => <CourseDetail key={courseItem.title} course={courseItem} />)`.

### Matching example from your project code
[`src/pages/Library.jsx:99`](src/pages/Library.jsx#L99):
```jsx
{filtered.map(item => <ItemCard key={item.id} item={item} />)}
```
[`src/pages/EditItem.jsx:119-129`](src/pages/EditItem.jsx#L119-L129) (mapping over a constant array, not data from state):
```jsx
{GENRES.map(g => (
  <button key={g} type="button" onClick={() => toggleGenre(g)} style={{ ... }}>
    {g}
  </button>
))}
```

### Line-by-line explanation
- `filtered.map(item => <ItemCard key={item.id} item={item} />)` — for every `item` object in the `filtered` array, produce one `<ItemCard>` element. The arrow function `item => (...)` is a **single-expression arrow function** — no `{ }` body needed, the JSX after `=>` is automatically returned.
- `key={item.id}` — uses the item's unique database id as the key (a stable, unique value — the right choice; using the array *index* would be wrong here because items can be filtered/reordered/deleted).
- `GENRES.map(g => (...))` — maps over a plain string array; `key={g}` works because genre names are unique strings.

### Why it matters for my project
Your app constantly converts arrays (`items`, `lists`, `genres`, `vibes`, `availableItems`...) into lists of UI elements. This is probably the single most-used JSX pattern in your whole codebase — you'll find `.map()` in `Library.jsx`, `Lists.jsx`, `ListDetail.jsx`, `EditItem.jsx`, `ItemDetail.jsx`, `ItemCard.jsx`, `ListCard.jsx`, `Login.jsx`, and `Navbar`'s implicit list rendering.

### Why it would break if changed/removed
- Remove `key`: React logs a console warning "Each child in a list should have a unique key prop" and may behave oddly when the list changes (e.g., input focus jumping to the wrong row, stale DOM nodes).
- Use `key={index}` instead of `key={item.id}`: if you delete item #2 from the middle of the list, React would think item #3 is now "item #2" (same index), potentially reusing the wrong DOM state. Using the database `id` avoids this entirely — a great thing to mention if asked "why id and not index?"

### How to explain it in the demo
"The Library page keeps the items as an array in state, then `.map()`s over them to create one `ItemCard` per item. Each card needs a `key` — I use the item's database id, which is stable and unique, so React can correctly track each card even as I filter, add, or delete items."

### Possible teacher questions and simple answers
- **Q: Why does React need a `key` for list items?**
  A: To efficiently and correctly match old and new elements when re-rendering — without it, React can't tell which item changed, was added, or removed.
- **Q: Why not use the array index as the key?**
  A: Because indexes shift when items are added/removed/reordered, which can cause React to mismatch state between renders (e.g., wrong input keeps its old value).

---

## TOPIC 6 — State with `useState`, and the custom `useLibrary` hook

### Beginner-friendly explanation
A component "remembers" things between renders using **state**. `useState(initialValue)` returns a pair: `[currentValue, setterFunction]` — this is **array destructuring**. Calling the setter both updates the stored value *and* tells React to re-render the component with the new value (deck 09, slide 19).

A **hook** is a special function starting with `use` that can only be called at the top level of a component (not inside loops/conditions) (deck 09, slide 20). `useState`, `useEffect`, `useContext` are built-in hooks; you can also write your **own custom hooks** that wrap built-in ones.

### Example from the theory presentation
Slide 19 of deck 09: `const [count, setCount] = useState(0)`.

### Matching example from your project code
[`src/components/Navbar.jsx:12`](src/components/Navbar.jsx#L12):
```jsx
const [menuOpen, setMenuOpen] = useState(false);
...
<button onClick={() => setMenuOpen(o => !o)}>
```
And the **custom hook** [`src/context/LibraryContext.jsx:245-248`](src/context/LibraryContext.jsx#L245-L248):
```jsx
export function useLibrary() {
  return useContext(LibraryContext);
}
```

### Line-by-line explanation
- `const [menuOpen, setMenuOpen] = useState(false);` — declares a state variable `menuOpen` starting as `false`, plus a setter `setMenuOpen`. Array destructuring names them whatever you like (the order matters, not the names).
- `onClick={() => setMenuOpen(o => !o)}` — when clicked, calls the setter with an **updater function** `o => !o`: "take the previous value `o`, return its opposite." This is the safe way to update state based on the *previous* state (deck 09, slides 31-32) — using `setMenuOpen(!menuOpen)` directly can be unreliable if multiple updates queue up in the same event.
- `export function useLibrary() { return useContext(LibraryContext); }` — this is a **custom hook**: a thin wrapper around the built-in `useContext` hook, so that everywhere else in the app you write the short `const { user, items } = useLibrary();` instead of `const { user, items } = useContext(LibraryContext);` and importing `LibraryContext` directly.

### Why it matters for my project
Almost every interactive piece of your UI is driven by `useState`:
- `Navbar`: `menuOpen` (profile dropdown)
- `Library`: `search`, `format`, `genre` (filters)
- `EditItem`: `form` (the entire form data as one object), `vibeInput`
- `Login`: `tab`, `email`, `password`, `name`, `error`
- `LibraryContext`: `items`, `lists`, `loading`, `error`, `user` — the **shared** state

### Why it would break if changed/removed
- If `Navbar` used a plain variable `let menuOpen = false` instead of `useState`, clicking the button would change the variable but **React would never know to re-render** — the dropdown would never visually appear (this directly illustrates deck 09 slide 15: "component functions execute only once... state is the concept needed to force React to re-execute").
- If you called `useState` inside an `if` block, React would throw "Rendered more/fewer hooks than during the previous render" — hooks must always run in the same order every render.

### How to explain it in the demo
"I store UI state like the open/closed profile menu with `useState`. When the user clicks the avatar, I call the setter with `o => !o`, which flips the boolean and tells React to re-render — that's what makes the dropdown appear and disappear."

For the custom hook: "Rather than importing `useContext` and `LibraryContext` in every file, I wrote a small custom hook `useLibrary()` that returns the context value directly — it's a convenience wrapper that keeps my imports short and consistent."

### Possible teacher questions and simple answers
- **Q: Why does the setter function sometimes take a function as its argument (`setMenuOpen(o => !o)`) instead of a value?**
  A: To safely compute the new state based on the *current* state, especially important if multiple updates could be queued — React guarantees the updater receives the latest pending value.
- **Q: What makes `useLibrary` a "hook"?**
  A: Its name starts with `use`, and it calls another hook (`useContext`) inside it — by convention and by React's rules, that makes it a custom hook, callable only from components or other hooks.
- **Q: Why must hooks be called at the top level?**
  A: React tracks hooks by call order across renders; calling them conditionally would shift that order and break the internal bookkeeping that links each hook call to its stored state.

---

## TOPIC 7 — `useEffect` and HTTP requests (`fetch`)

### Beginner-friendly explanation
`useEffect(fn, dependencies)` lets you run code *after* React renders — typically for things that reach "outside" React, like fetching data from a server. The **dependency array** controls when it re-runs:
- `[]` (empty array) → runs once, after the first render
- `[x, y]` → runs after first render AND whenever `x` or `y` changes
- omitted entirely → runs after *every* render (usually wrong — causes endless loops, deck 12 slides 6-9)

Since `fetch` returns a **Promise** (an object representing "a value that will exist later"), you use `async`/`await` inside an `async` function to "pause" until the data arrives, instead of chaining `.then()` (deck 12, slide 11).

### Example from the theory presentation
Deck 12, slide 10: `useEffect(() => { fetchCourses(); }, [])` — empty array, runs only once at first render, preventing the endless fetch loop shown on slide 6.

### Matching example from your project code
[`src/context/LibraryContext.jsx:24-62`](src/context/LibraryContext.jsx#L24-L62):
```jsx
useEffect(() => {
  async function loadData() {
    if (!user) {
      setItems([]);
      setLists([]);
      return;
    }
    setLoading(true);
    setError('');
    setItems([]);
    setLists([]);
    try {
      const userId = encodeURIComponent(user.id);
      const itemsResponse = await fetch(`${API_URL}/items?userId=${userId}`);
      if (!itemsResponse.ok) throw new Error('Could not load items');
      const loadedItems = await itemsResponse.json();
      const listsResponse = await fetch(`${API_URL}/lists?userId=${userId}`);
      if (!listsResponse.ok) throw new Error('Could not load lists');
      const loadedLists = await listsResponse.json();
      setItems(loadedItems);
      setLists(loadedLists);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }
  loadData();
}, [user]);
```

### Line-by-line explanation
- `useEffect(() => { ... }, [user])` — the effect runs once after the first render, **and again every time `user` changes** (login/logout). This is exactly the "depend on a state value" pattern from deck 12 slide 9.
- `async function loadData() { ... }` — declared *inside* the effect. Note the comment on deck 12 slide 11: "do not place `async` in front of the anonymous effect function!" — that's why an inner named `async` function is defined and then called (`loadData();`), instead of writing `useEffect(async () => {...})`.
- `if (!user) { setItems([]); setLists([]); return; }` — guard clause: if there's no logged-in user, clear the data and stop (no point fetching).
- `setLoading(true); setError(''); setItems([]); setLists([]);` — reset UI state before starting a new fetch, so old data/errors from a previous user don't linger on screen.
- `const itemsResponse = await fetch(\`${API_URL}/items?userId=${userId}\`);` — sends an HTTP GET request; `await` pauses this function until the response headers arrive (deck 12 slide 5: "answer from fetch is a promise... await waits until function execution is finished").
- `if (!itemsResponse.ok) throw new Error(...)` — checks the HTTP status (deck 12 slide 12: "checks HTTP response status, ok means 200"). `fetch` does **not** reject on 404/500 — you must check `.ok` yourself.
- `const loadedItems = await itemsResponse.json();` — converts the JSON text response body into a JS array/object (another Promise, awaited).
- `setItems(loadedItems); setLists(loadedLists);` — pushes the fetched data into state, triggering a re-render that shows the real data.
- `catch (err) { setError(err.message); }` — if any `await` above throws, this catches it and stores a user-facing error message (shown in `Library.jsx` and `Lists.jsx`).
- `setLoading(false);` — always runs at the end (success or failure), so the "Loading..." message disappears.

### Why it matters for my project
This single `useEffect` is the engine that connects your React frontend (in-memory only — deck 12 slide 2: "all data changes inside react app are lost whenever app reloads") to the persistent backend (`json-server` + `db.json`). Without it, your app would show an empty library every time you refreshed the page.

### Why it would break if changed/removed
- **Remove the `[user]` dependency array entirely**: the effect runs after *every* render → `setItems`/`setLists` trigger a re-render → effect runs again → endless loop of network requests (exactly deck 12 slides 6-7's described bug).
- **Use `[]` instead of `[user]`**: the effect would only run once, at mount, when `user` is still `null` (before login) — it would never re-fetch after `login()` sets the user, and your library would stay empty after logging in.
- **Mark the effect callback `async` directly** (`useEffect(async () => {...}, [user])`): React would log a warning because effect functions must return either nothing or a cleanup function — an `async` function always returns a Promise, which breaks that contract.

### How to explain it in the demo
"When the `user` changes — at login or logout — my `useEffect` in `LibraryContext` re-runs and fetches that user's items and lists from the `json-server` backend with `fetch`. I use `async`/`await` for readability instead of chaining `.then()`, and I check `response.ok` because `fetch` doesn't automatically treat HTTP error codes as failures."

### Possible teacher questions and simple answers
- **Q: Why is the dependency array `[user]` and not empty `[]`?**
  A: Because the data that needs loading depends on *which* user is logged in — when `user` changes (login/logout), we need to re-fetch.
- **Q: What would happen with no dependency array at all?**
  A: The effect runs after every render; since it calls `setItems`/`setLists` (which cause a re-render), you'd get an infinite fetch loop.
- **Q: Why check `response.ok`?**
  A: `fetch` resolves successfully even for HTTP error statuses like 404/500 — it only rejects on network failures. `.ok` is `true` only for 2xx statuses, so you must check it manually to detect server-side errors.
- **Q: What's the difference between `.then()` chains and `async`/`await`?**
  A: They do the same thing; `async`/`await` just lets you write asynchronous code that *reads* like synchronous code (top to bottom), which is easier to follow than nested `.then()` callbacks.

---

## TOPIC 8 — Events & event handlers

### Beginner-friendly explanation
You attach an event handler to a JSX element with a prop like `onClick={handlerFunction}` — note: **pass a reference to the function, don't call it** (`onClick={handleClick}`, not `onClick={handleClick()}`, or it would run immediately during render instead of on click). To pass arguments or run multiple statements, wrap it in an **arrow function**: `onClick={() => handleClick(value)}` (deck 09, slides 2 & 8).

The **event object** `e` (or `event`) is automatically passed to your handler. Useful members: `e.target.value` (current input value), `e.preventDefault()` (stop default browser behavior, e.g. form submit/page reload), `e.key` (which key was pressed), `e.type` (event type).

**Event propagation/bubbling**: a click on a child element also triggers handlers on its parent elements, unless stopped with `e.stopPropagation()` (deck 09, slides 11-13).

### Matching example from your project code
[`src/pages/ListDetail.jsx:115-127`](src/pages/ListDetail.jsx#L115-L127):
```jsx
{listItems.map(item => (
  <div key={item.id}>
    <Link to={`/items/${item.id}`}>
      <MediaCover item={item} />
      <h3 ...>{item.title}</h3>
      ...
    </Link>
    {/* This button is outside the Link, so its click only removes the item. */}
    <button className="btn-secondary" onClick={() => handleRemoveItem(item.id)} style={{ marginTop: 8 }}>Remove</button>
  </div>
))}
```
And [`src/components/Navbar.jsx:65`](src/components/Navbar.jsx#L65):
```jsx
<button onClick={() => setMenuOpen(o => !o)} style={{ ... }}>
```

### Line-by-line explanation
- `onClick={() => handleRemoveItem(item.id)}` — an **inline arrow function**. It's needed here because `handleRemoveItem` requires an argument (`item.id`); writing `onClick={handleRemoveItem}` would pass the *click event* as the argument instead of the item's id, and writing `onClick={handleRemoveItem(item.id)}` would call the function immediately while rendering (wrong — it would run for every item on every render, not on click).
- The **structural** choice — placing the `<button>` *outside* the `<Link>` — avoids needing `e.stopPropagation()`: since the button isn't nested inside the link, clicking it doesn't also trigger navigation. This is a clean way to sidestep the event-bubbling issue described in deck 09 slides 11-13.
- `onClick={() => setMenuOpen(o => !o)}` — runs an updater function on click; no event object needed here, just toggling a boolean.

### Why it matters for my project
Nearly every button, link, input, and form in the app relies on event handlers: deleting items/lists, opening menus, toggling genres, submitting forms, switching login tabs, etc.

### Why it would break if changed
If you wrote `<button onClick={handleRemoveItem(item.id)}>`, then **as soon as the page renders**, `handleRemoveItem(item.id)` would be called immediately (its return value — `undefined`, since it's an `async function` with no return — becomes the `onClick` value), and the actual click would do nothing. This is one of the most common beginner mistakes, exactly warned about in deck 09 slide 2 ("No function call!! No ()").

### How to explain it in the demo
"In the list detail page, each item has a `Remove` button placed *outside* the clickable card link — that way clicking 'Remove' doesn't also navigate to the item page, without me needing to manually stop event propagation."

### Possible teacher questions and simple answers
- **Q: Why `onClick={() => doSomething(x)}` instead of `onClick={doSomething(x)}`?**
  A: The second form calls the function immediately during render (its result becomes the handler); the arrow function form creates a new function that calls `doSomething(x)` only when clicked.
- **Q: What does `e.preventDefault()` do, and where do you use it?**
  A: It stops the browser's default behavior for that event — e.g., stopping a form submit from reloading the page. You use it in every `handleSubmit` in this project (`Login`, `EditItem`, `Lists`, `ListDetail`'s add/rename forms, `AddItemForm`).
- **Q: How do you stop a click from also triggering a parent's click handler?**
  A: Either call `e.stopPropagation()`, or — as done in `ListDetail.jsx` — structure your JSX so the button isn't nested inside the clickable parent at all.

---

## TOPIC 9 — Conditional rendering

### Beginner-friendly explanation
Since `{ }` only accepts expressions, you render things conditionally using:
- **Ternary operator**: `condition ? <A /> : <B />`
- **`&&` operator**: `condition && <A />` — renders `<A />` only if `condition` is truthy; renders nothing (`false`) if falsy
- A variable holding JSX, assigned conditionally before the `return`

A pitfall mentioned in deck 09 slide 24: `count && <Thing />` is dangerous if `count` can be `0`, because React would literally render the number `0` on the page (it's falsy but not `null`/`false`/`undefined`, and numbers *do* get rendered).

### Matching example from your project code
[`src/pages/Library.jsx:88-101`](src/pages/Library.jsx#L88-L101):
```jsx
{loading ? (
  <p style={{ color: 'var(--text-secondary)' }}>Loading your library...</p>
) : filtered.length === 0 ? (
  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
    <p ...>Nothing found</p>
    <p ...>Try adjusting your filters or search terms.</p>
  </div>
) : (
  <div className="card-grid">
    {filtered.map(item => <ItemCard key={item.id} item={item} />)}
  </div>
)}
```
And `&&` rendering, [`src/components/ItemCard.jsx:25-27`](src/components/ItemCard.jsx#L25-L27):
```jsx
{item.creator && (
  <p style={{ ... }}>{item.creator}</p>
)}
```

### Line-by-line explanation
- `loading ? A : filtered.length === 0 ? B : C` — a **chained ternary**: "if loading show A; otherwise if the filtered list is empty show B; otherwise show C (the grid of cards)." Three mutually exclusive UI states from one expression.
- `{item.creator && (<p>...{item.creator}</p>)}` — only renders the creator paragraph if `item.creator` is a non-empty, truthy string. If `item.creator` is `''` or `undefined`, nothing is rendered (an empty string `''` is falsy, so this is actually safe — unlike the `count && ...` pitfall with `0`, since creator is always a string here, never the number `0`).

### Why it matters for my project
This is everywhere — every page handles a "loading", "empty", and "has data" state, and many fields (`creator`, `year`, `notes`, `genres`, `vibes`, `description`) are optional and conditionally shown. Look also at `ItemDetail.jsx`'s early returns:
```jsx
if (loading) return <p ...>Loading item...</p>;
if (!item) return <p ...>Item not found for the current account.</p>;
```
— this is "conditional rendering via early `return`," a cleaner alternative to deeply nested ternaries when the alternative is a full early exit from the component.

### Why it would break if changed
If `Library.jsx` used `{filtered.length && <div className="card-grid">...}` instead of `{filtered.length === 0 ? ... : ...}`, then when `filtered.length` is `0`, React would render the literal number `0` on the screen (the exact bug warned about in deck 09 slide 24) instead of the "Nothing found" message.

### How to explain it in the demo
"The Library page has three visual states — loading, no results, and showing results — handled with a chained ternary. Optional fields like `creator` or `year` use the `&&` pattern: only render this paragraph if the value exists."

### Possible teacher questions and simple answers
- **Q: Why is `count && <Thing />` risky?**
  A: If `count` is `0`, JSX renders the number `0` (numbers are rendered, only `false`/`null`/`undefined` are not) — producing a stray "0" on the page instead of nothing.
- **Q: What's the difference between `&&` and a ternary for conditional rendering?**
  A: `&&` renders something-or-nothing (one branch); a ternary lets you provide *both* a "true" and a "false" branch.

---

## TOPIC 10 — Forms, controlled components, and validation

### Beginner-friendly explanation
A **controlled component** is an input whose value is driven entirely by React state: you set `value={stateVar}` and update the state on every keystroke via `onChange={e => setStateVar(e.target.value)}`. This keeps "the source of truth" in your component's state rather than in the DOM (deck 10, slides 2-3).

Forms trigger a `submit` event when the user presses Enter or clicks a submit button; by default, this **reloads the page** (sending data to a server and refetching the HTML — destroying all your component state). You prevent this with `e.preventDefault()` inside an `onSubmit` handler (deck 10, slides 7-8).

Validation can happen at different times: on every keystroke, on blur (losing focus), or on submit (deck 10, slides 14-21).

### Example from the theory presentation
Slide 3 of deck 10:
```
<input value={enteredValue} onChange={e => setEnteredValue(e.target.value)} />
```

### Matching example from your project code
[`src/pages/Login.jsx:116`](src/pages/Login.jsx#L116):
```jsx
<input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="you@example.com" />
```
[`src/pages/Login.jsx:20-30`](src/pages/Login.jsx#L20-L30):
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (!email.trim()) { setError('Please enter your email.'); return; }
  if (!password.trim()) { setError('Please enter a password.'); return; }
  if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
  login(email, name);
};
```

### Line-by-line explanation
- `value={email}` — the input always shows whatever is in the `email` state (this is what makes it "controlled" — React owns the value).
- `onChange={e => { setEmail(e.target.value); setError(''); }}` — on every keystroke, `e.target.value` is the input's current text; this updates `email` state (causing a re-render that displays the new text) AND clears any previous error message — a nice UX touch (errors disappear as soon as you start fixing the input).
- `e.preventDefault();` — stops the browser from reloading the page on submit (deck 10 slide 7's "all states are lost" problem).
- `if (!email.trim()) { setError(...); return; }` — **validation on submit**: trims whitespace, checks for emptiness, sets an error message, and exits early (no further checks run).
- `if (password.length < 6) { ... }` — a length-based validation rule, simple and direct (no regex needed here, unlike deck 10 slide 15's username regex example).
- `login(email, name);` — finally, calls the function from context to actually log the user in.

### Why it matters for my project
Forms are a major part of your app's functionality: login/register (`Login.jsx`), add/edit item (`EditItem.jsx` + `AddItemForm.jsx`), create list (`Lists.jsx`), add item to list / rename list (`ListDetail.jsx`). All use the controlled-component pattern consistently.

A particularly interesting one — **combining several fields into one state object**, [`src/pages/EditItem.jsx:19`](src/pages/EditItem.jsx#L19) and the helper [`:31`](src/pages/EditItem.jsx#L31):
```jsx
const [form, setForm] = useState({ title: '', creator: '', year: '', type: 'movie', cover: '', genres: [], rating: 3, notes: '', vibes: [] });
const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
```
This matches deck 10 slide 11 ("combine into 1 state... use course object as state variable... `[ ]` JS syntax to use variable as key"). `set('title', e.target.value)` spreads the previous form object `...p` (copying every field) and overwrites just one field using **computed property name** syntax `[key]: val`.

### Why it would break if changed/removed
- Remove `e.preventDefault()`: submitting any form would reload the browser page, wiping out all React state (your logged-in user, your in-progress form data — exactly the problem described in deck 10 slide 7).
- Remove `value={email}` (making it "uncontrolled"): React would no longer know the current input value — `email` state would stay `''` forever, and `handleSubmit` would always see an empty string.
- In `set`, write `setForm(p => ({ ...p, key: val }))` (no brackets around `key`) instead of `[key]: val`: it would literally create/overwrite a field named `"key"` in every call, instead of the field named by the `key` *variable* — a classic computed-property-name mistake.

### How to explain it in the demo
"All my form inputs are controlled — their value comes from state, and `onChange` updates that state on every keystroke. For the Edit Item form, instead of nine separate `useState` calls, I keep all fields in one `form` object and use a small `set(key, value)` helper that spreads the old form and overwrites just one field — this mirrors the 'combine related state' principle from the theory."

### Possible teacher questions and simple answers
- **Q: What makes an input "controlled"?**
  A: Its `value` is bound to React state, and changes flow through `onChange` back into that state — React is the single source of truth.
- **Q: Why call `e.preventDefault()` in a submit handler?**
  A: To stop the browser's default full-page reload/HTTP submission, which would discard all React state.
- **Q: What does `[key]: val` do inside an object literal?**
  A: It's a *computed property name* — `key` is evaluated as a variable, and its value becomes the property's name (e.g., if `key === 'title'`, this sets the `title` field).
- **Q: How would you validate a field as the user types vs. on submit?**
  A: On every keystroke — compute a boolean from the current state value and conditionally render an error message; on submit — run all checks inside the `onSubmit` handler before calling the save function, as done in `Login.jsx` and `Lists.jsx`.

---

## TOPIC 11 — State management: lifting state up & Context (avoiding prop drilling)

### Beginner-friendly explanation
**Prop drilling** is when you have to pass a piece of data through several layers of components that don't actually use it themselves, just to get it to a deeply nested child (deck 11, slide 19). **Context** solves this by letting you "teleport" data directly to whichever component needs it:
1. `createContext()` creates a context object
2. A **Provider** component wraps the part of the tree that needs the data and supplies a `value`
3. Any descendant can call `useContext(MyContext)` to read that value directly — no matter how deep it is

**Lifting state up** means moving state to the closest common ancestor of all the components that need it (deck 11, slides 6-13).

### Example from the theory presentation
Deck 11, slides 23-27: create a `FavouritesContext`, wrap the app in `<FavouritesContextProvider>`, and consume it elsewhere with `const { favourites, addFavourite } = useContext(FavouritesContext)`.

### Matching example from your project code
This is essentially the architectural backbone of your whole app — [`src/context/LibraryContext.jsx`](src/context/LibraryContext.jsx):
```jsx
const LibraryContext = createContext();           // 1. create context

export function LibraryProvider({ children }) {   // 2. provider component
  const [items, setItems] = useState([]);
  const [lists, setLists] = useState([]);
  ... // all the shared state and functions
  return (
    <LibraryContext.Provider value={{
      user, login, logout,
      items, lists, loading, error,
      addItem, updateItem, deleteItem,
      addList, updateList, deleteList,
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {                    // 3. consumer hook
  return useContext(LibraryContext);
}
```
Wrapped around the whole app in [`src/App.js:48`](src/App.js#L48):
```jsx
<LibraryProvider>
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
</LibraryProvider>
```
Consumed deep inside the tree, e.g. [`src/components/ListCard.jsx:7`](src/components/ListCard.jsx#L7):
```jsx
const { items, deleteList } = useLibrary();
```

### Line-by-line explanation
- `const LibraryContext = createContext();` — makes a "channel" that components can tune into.
- `export function LibraryProvider({ children })` — a component whose entire job is to **own** the shared state (`items`, `lists`, `user`, `loading`, `error`) and the functions that change it (`login`, `addItem`, `deleteList`, etc.), then make all of that available to descendants.
- `<LibraryContext.Provider value={{ ... }}>` — the special component React creates for every context; its `value` prop is the object every consumer will receive.
- `{children}` — renders whatever was nested inside `<LibraryProvider>` in `App.js` (i.e., your entire `<BrowserRouter><AppRoutes /></BrowserRouter>` tree) — this is the "special children prop" from Topic 3 in action.
- `export function useLibrary() { return useContext(LibraryContext); }` — the consumer-side helper; any component can call this to get `{ user, items, lists, addItem, ... }` directly.
- `const { items, deleteList } = useLibrary();` in `ListCard` — destructures only the two things this component needs, **without** `Lists.jsx` (its parent) ever having to pass them down as props. That's prop drilling avoided.

### Why it matters for my project
Without Context, you would have to pass `items`, `lists`, `user`, and 8 functions down through `App` → `AppRoutes` → `LibraryPage`/`ListsPage` → `ItemCard`/`ListCard` — multiple layers that don't themselves use most of that data. Context lets `ListCard`, `ItemDetail`, `Navbar`, etc. each grab exactly what they need in one line.

### Why it would break if changed/removed
- If `<LibraryProvider>` didn't wrap `<BrowserRouter>`, then any page/component calling `useLibrary()` would get `useContext(LibraryContext)` returning `undefined` (the context's default value, since `createContext()` was called with no argument) — destructuring `{ user, items }` from `undefined` would throw a runtime error immediately.
- If you forgot to include a function (e.g., `deleteList`) in the `value={{ ... }}` object, every component calling `useLibrary().deleteList` would get `undefined`, and clicking "Delete" would throw "deleteList is not a function."

### How to explain it in the demo
"Rather than passing `items`, `lists`, `user`, and all my CRUD functions through every layer of components (`prop drilling`), I created a `LibraryContext`. `LibraryProvider` owns all the shared state and API logic, wraps my whole app, and any component — no matter how deeply nested — can call `useLibrary()` to get exactly what it needs. For example, `ListCard` calls `useLibrary()` to get `deleteList` directly, even though its parent `ListsPage` never touches that function."

### Possible teacher questions and simple answers
- **Q: What problem does Context solve?**
  A: Prop drilling — passing data through many component layers that don't use it themselves, just to reach a deeply nested consumer.
- **Q: What are the three steps to use Context?**
  A: Create it with `createContext()`, provide it with a `<Context.Provider value={...}>` wrapping the relevant part of the tree, and consume it with `useContext(Context)` (or a custom hook wrapping that).
- **Q: Why wrap `useContext` in your own `useLibrary` hook instead of using `useContext(LibraryContext)` everywhere?**
  A: Convenience and consistency — shorter imports, one place to change if the context's name/shape changes, and it reads more meaningfully ("use the library").
- **Q: Where is the "single source of truth" for items and lists in this app?**
  A: Inside `LibraryProvider`'s `useState` calls — every page/component reads and modifies that same state through context, so they always see consistent data.

---

## TOPIC 12 — Updating state correctly (objects, arrays, immutability)

### Beginner-friendly explanation
You must **never mutate** state directly (e.g., `items.push(x)` or `item.title = 'New'`); React won't notice the change and won't re-render. Instead, always create a **new** object/array (often via the spread operator `...`) and pass that to the setter (deck 09, slides 33-34).

Common safe patterns:
- Add to array: `[...array, newItem]`
- Remove from array: `array.filter(x => x.id !== id)`
- Replace one element: `array.map(x => x.id === id ? newVersion : x)`
- Update one field of an object: `{ ...object, field: newValue }`

### Example from the theory presentation
Slide 33 of deck 09: "copy old object into new object, overwrite [the field] in new object" — `{ ...oldObj, color: 'blue' }`.

### Matching example from your project code
[`src/context/LibraryContext.jsx:147`](src/context/LibraryContext.jsx#L147):
```jsx
setItems(prevItems => prevItems.map(item => item.id === id ? savedItem : item));
```
[`src/context/LibraryContext.jsx:160-165`](src/context/LibraryContext.jsx#L160-L165):
```jsx
setItems(prevItems => prevItems.filter(item => item.id !== id));
setLists(prevLists => prevLists.map(list => ({
  ...list,
  itemIds: (list.itemIds || []).filter(itemId => itemId !== id),
})));
```
[`src/pages/EditItem.jsx:33-39`](src/pages/EditItem.jsx#L33-L39):
```jsx
const toggleGenre = (g) => {
  setForm(p => ({
    ...p,
    genres: p.genres?.includes(g) ? p.genres.filter(x => x !== g) : [...(p.genres || []), g]
  }));
};
```

### Line-by-line explanation
- `setItems(prevItems => prevItems.map(item => item.id === id ? savedItem : item));` — **replace one item** in the array: `.map()` walks every item; for the one whose id matches, substitute the freshly-saved version (`savedItem`, returned by the server after a PUT); for all others, keep them unchanged. The result is a brand-new array (map always returns a new array — see deck 09 slide 34's "prefer: returns a new array").
- `setItems(prevItems => prevItems.filter(item => item.id !== id));` — **remove one item**: `.filter()` keeps everything except the one matching `id`, again returning a new array.
- The spread inside the list update: `{ ...list, itemIds: (list.itemIds || []).filter(...) }` — **deep-ish update**: copy every field of `list` into a new object, then overwrite just `itemIds` with a filtered (new) array — needed because deleting an item should also remove its id from any lists that referenced it.
- `toggleGenre`: `p.genres?.includes(g) ? p.genres.filter(x => x !== g) : [...(p.genres || []), g]` — a ternary that either **removes** `g` (if already present, via `filter`) or **adds** it (if absent, via spread + append) — implementing a toggle without ever mutating the original `genres` array.

### Why it matters for my project
Your `items` and `lists` arrays, and the nested `genres`/`vibes`/`itemIds` arrays inside them, are updated constantly (add/edit/delete item, add/remove list membership, toggle genre tags). Doing this immutably is what makes React's re-rendering reliable and predictable.

### Why it would break if changed
- `prevItems.push(savedItem)` instead of `[...prevItems, savedItem]`: `push` mutates the array in place and returns its new *length* (a number), so `setItems(prevItems.push(savedItem))` would set state to a number, breaking everything that expects an array (`items.map is not a function`).
- `item.title = newTitle; setItems(items)`: mutates the existing object/array, then passes the *same reference* back to `setItems`. React compares old/new state by reference for some optimizations and **may not detect a change at all**, so the UI wouldn't update — exactly the bug class deck 09 slide 33 warns against.

### How to explain it in the demo
"Whenever I update items or lists, I never modify the existing array directly — I always build a new array with `map`, `filter`, or the spread operator. For example, deleting an item also has to clean up any lists that reference it, so I map over `lists`, spread each list into a new object, and filter its `itemIds` array — producing entirely new objects so React reliably detects and re-renders the change."

### Possible teacher questions and simple answers
- **Q: Why can't you just do `items.push(newItem)` and call `setItems(items)`?**
  A: `push` mutates the array in place; React may see the same array reference as before and skip re-rendering, and `push` itself returns a number (the new length), not the array.
- **Q: How do you update one field of an object in state without mutating it?**
  A: Spread the old object into a new one and overwrite the field: `{ ...oldObj, field: newValue }`.
- **Q: How do you remove one element from an array in state?**
  A: `array.filter(item => item.id !== idToRemove)` — returns a new array without that element.

---

## TOPIC 13 — React Router (navigation, params, programmatic navigation)

### Beginner-friendly explanation
React apps are **Single Page Applications (SPAs)** — there's really only one HTML page; "navigating" just means swapping which component is displayed, without a full browser reload (deck 13, slide 2). **React Router** (`react-router-dom`, an external package — routing isn't built into React) provides:
- `<Routes>`/`<Route path="..." element={<Component />} />` — define which component shows for which URL path
- `<Link to="...">` — navigate **without** a page reload (unlike a plain `<a href>`, which reloads everything and resets all state — deck 13, slide 9)
- `<Navigate to="...">` — declaratively redirect
- `useParams()` — read dynamic parts of the URL, e.g. `/items/:id`
- `useNavigate()` — navigate **programmatically** (in response to code, e.g. after a successful save), to be used "only if a link is not possible" (deck 13, slide 16)
- `<Route path="*">` — a catch-all "not found"/redirect route

### Example from the theory presentation
Deck 13, slide 17:
```
{ path: '/courses/:courseId', element: <CourseEdit /> }
```
then inside the component, `const params = useParams(); params.courseId`.

### Matching example from your project code
[`src/App.js:11-43`](src/App.js#L11-L43):
```jsx
function AppRoutes() {
  const { user } = useLibrary();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container" ...>
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/edit/:id" element={<EditItemPage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/lists/:id" element={<ListDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}
```
Reading a parameter, [`src/pages/ItemDetail.jsx:9-13`](src/pages/ItemDetail.jsx#L9-L13):
```jsx
const { id } = useParams();
const { items, deleteItem, loading } = useLibrary();
const navigate = useNavigate();
const item = items.find(i => i.id === Number(id));
```
Programmatic navigation after an action, [`src/pages/ItemDetail.jsx:20-26`](src/pages/ItemDetail.jsx#L20-L26):
```jsx
const handleDelete = async () => {
  if (window.confirm(`Delete "${item.title}"?`)) {
    await deleteItem(item.id);
    navigate('/');
  }
};
```

### Line-by-line explanation
- `if (!user) { return <Routes>...</Routes> }` — **conditional route sets**: if nobody is logged in, the app only knows about `/login` (everything else redirects there via `<Route path="*" element={<Navigate to="/login" />} />`). If someone *is* logged in, a completely different set of routes is available, wrapped with the `Navbar`. This is your **route guarding / protected routes** mechanism — worth highlighting, since it's not in the slides verbatim but is a real-world extension of the routing concept.
- `<Route path="/items/:id" element={<ItemDetailPage />} />` — `:id` marks a **dynamic segment**; visiting `/items/42` makes `id` available as `"42"` inside `ItemDetailPage`.
- `const { id } = useParams();` — reads that dynamic segment; note it always comes back as a **string** (`"42"`, not `42`).
- `const item = items.find(i => i.id === Number(id));` — converts the string `id` to a number with `Number(id)` before comparing — necessary because `item.id` in `db.json` is stored as a number, and `"42" === 42` would be `false` in JS (strict equality checks type too).
- `const navigate = useNavigate();` then `navigate('/')` — **programmatic navigation**: after deleting the item (an async action with no natural `<Link>` to click), code-driven redirection sends the user back to the library.
- `<Route path="*" element={<Navigate to="/" />} />` — catch-all: any unmatched URL (e.g., a typo, or a stale bookmark to a deleted item) redirects to the home/library page.

### Why it matters for my project
This is the navigational skeleton of your entire app — every page transition (clicking an item, editing, viewing a list, logging out) goes through this routing setup. The "if no user, only allow `/login`" pattern is your authentication gate — a great talking point for the demo since it shows you extended the basic routing concept into a practical access-control mechanism.

### Why it would break if changed/removed
- Use `<a href="/items/5">` instead of `<Link to="/items/5">`: clicking would trigger a **full page reload** — slower, and (per deck 13 slide 9) "the state of the application has been reset" — your `user`, `items`, `lists` would all be wiped and re-fetched from scratch.
- Remove `Number(id)` and compare `i.id === id`: `item` would always be `undefined` (string `"42"` never strictly equals number `42`), and the page would permanently show "Item not found."
- Remove the `path="*"` catch-all: visiting an undefined URL like `/foobar` would show React Router's default error page instead of gracefully redirecting.

### How to explain it in the demo
"My routing is split into two modes depending on whether `user` exists in context: logged-out visitors only ever see the login page (any other URL redirects there), while logged-in users get the full app with a Navbar and five routes, including dynamic ones like `/items/:id` where `:id` is read with `useParams()` and used to look up the right item from context. After actions like deleting an item, I use `useNavigate()` to programmatically send the user back to the library, since there's no natural link to click in that flow."

### Possible teacher questions and simple answers
- **Q: Why use `<Link>` instead of a normal `<a>` tag?**
  A: `<Link>` changes the URL and swaps components without a full page reload, preserving all React state; `<a href>` causes a full reload that resets everything.
- **Q: How do dynamic route segments work?**
  A: You write `:paramName` in the route's `path`; React Router matches that part of the URL and makes it available via `useParams()` as a string.
es
- **Q: When should you use `useNavigate` instead of `<Link>`?**
  A: Only when navigation must happen as a *result of code* — e.g., after an async action completes (delete, save, login) — not for things the user can directly click, where `<Link>` is preferred.
- **Q: What does the `path="*"` route do?**
  A: It's a catch-all/wildcard that matches any URL not matched by earlier routes — used here to redirect unknown URLs gracefully instead of showing an error page.

---

## TOPIC 14 — CSS, styling approaches, and "Bootstrap" / responsive design

### Beginner-friendly explanation
The theory deck 06 covers **responsive design**: making a site look good on any screen size, via the viewport `<meta>` tag, **CSS media queries** (`@media (min-width: 768px) { ... }`), grid systems (12-column layouts), and **Bootstrap** (a CSS framework providing ready-made responsive classes like `.container`, `.row`, `.col-*`).

Deck 07 (slides 20-27) covers React-specific styling options:
- `className="..."` (the JSX equivalent of HTML's `class`) + rules in a `.css` file
- Inline styles: `style={{ color: 'red', fontSize: 14 }}` — a JS **object** where CSS property names become camelCase (`background-color` → `backgroundColor`)
- Component-scoped CSS via separate `.css` files or **CSS Modules** (`.module.css`)

### What your project actually does
Your project does **not** use Bootstrap or React-Bootstrap (no `bootstrap` import anywhere, despite the theory covering it heavily) — and only has minimal classic media-query usage. Instead, it relies almost entirely on:
1. **CSS custom properties (variables)** defined in `:root` in `index.css`, e.g. [`src/index.css:3-27`](src/index.css#L3-L27):
   ```css
   :root {
     --bg: #f0ebe3;
     --text-primary: #2c2416;
     --accent: #4a3f2f;
     --radius-md: 10px;
     --shadow-sm: 0 1px 3px rgba(44,36,22,0.07);
     --font-serif: 'Playfair Display', Georgia, serif;
     ...
   }
   ```
2. **Utility classes** for repeated patterns: `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.tag`, `.tag-vibe`, `.stars`, `.filter-pill`, `.card-grid`, `.media-cover` (all in `index.css`).
3. **Heavy inline styling** via the `style={{ ... }}` prop directly in JSX (used in nearly every component).
4. A small amount of genuine **responsive CSS** with media queries:
   [`src/index.css:249-261`](src/index.css#L249-L261):
   ```css
   @media (max-width: 768px) { .page-container { padding: 0 16px; } }
   @media (max-width: 480px) { .card-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
   ```
   and an inline `<style>` tag with a media query inside `ItemDetail.jsx` ([`:115-119`](src/pages/ItemDetail.jsx#L115-L119)):
   ```jsx
   <style>{`
     @media (max-width: 768px) {
       .detail-grid { grid-template-columns: 1fr !important; }
     }
   `}</style>
   ```

### Line-by-line explanation
- `--bg: #f0ebe3;` declares a **CSS custom property** (variable) on the `:root` (the `<html>` element), making it globally available.
- `var(--bg)` (used throughout, e.g. `background: 'var(--bg)'` in inline styles, or `background: var(--accent)` in CSS rules) reads that variable's current value — change it once in `:root` and every usage updates, which is the entire point of design tokens/theming.
- `className="card-grid"` + the CSS rule `.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }` — a **responsive grid without Bootstrap**: `auto-fill` + `minmax` automatically fits as many 160px-minimum columns as the container width allows, reflowing as the window resizes — achieving "responsive columns" with plain CSS Grid instead of Bootstrap's class-based 12-column system from deck 06.
- `@media (max-width: 480px) { .card-grid { grid-template-columns: repeat(2, 1fr); ... } }` — explicitly forces exactly 2 columns on small phone screens — a textbook media query exactly like deck 06 slide 7's syntax (`@media mediatype and (expression) { CSS-Code; }`).
- The inline `<style>{\`...\`}</style>` block in `ItemDetail.jsx` — JSX allows embedding a raw `<style>` tag with a JS template literal as its content, letting you write actual CSS (including media queries, which inline `style={{}}` objects *cannot* express) scoped textually to that page.

### Why it matters / what's notable for the demo
This is an excellent thing to discuss: **the theory teaches Bootstrap, but you chose a different, modern approach** — CSS variables + utility classes + CSS Grid — and you can explain *why* that's a legitimate, common real-world choice (full design control, smaller bundle size, no framework dependency, easier theming via variables). Be ready to explain how your `--accent`/`--bg`/etc. variables work, since that's the backbone of your visual design and the part most clearly tied to "CSS" theory.

### Why it would break if changed/removed
- Delete `:root { --bg: ...; }`: every `var(--bg)` reference would resolve to nothing (the property wouldn't exist), and elements would fall back to their default background (transparent/white) — the whole color scheme would disappear at once. This double as a great illustration of *why* design tokens/variables are powerful: one definition, many usages.
- Remove the `@media (max-width: 480px)` rule: on narrow phone screens, `.card-grid`'s `auto-fill, minmax(160px, 1fr)` would still work, but might squeeze in only 1 or awkwardly-sized columns instead of a clean 2-column layout — a worse, but not broken, experience.

### How to explain it in the demo
"For styling, instead of Bootstrap, I built a small design system using CSS custom properties — variables like `--accent` and `--bg` defined once in `:root` — plus reusable utility classes like `.btn-primary` and `.card-grid`. For responsiveness, I use CSS Grid's `auto-fill`/`minmax` so my card grid automatically reflows, backed by a couple of explicit media queries for small phone screens — the same `@media (max-width: ...)` syntax from the responsive design theory, just applied to my own grid system rather than Bootstrap's."

### Possible teacher questions and simple answers
- **Q: Did you use Bootstrap?**
  A: No — I used CSS custom properties (variables) and my own utility classes instead, which gave me full control over the visual design and theming with a consistent, centralized palette.
- **Q: How do CSS variables work, and why use them?**
  A: You declare them on `:root` with `--name: value;` and read them anywhere with `var(--name)`. They let you change one value and have it propagate everywhere it's used — essential for consistent theming.
- **Q: How does your card grid become responsive without Bootstrap's column classes?**
  A: CSS Grid's `repeat(auto-fill, minmax(160px, 1fr))` automatically calculates how many columns fit the available width, each at least 160px — combined with a media query that forces exactly 2 columns on very small screens.
- **Q: What's the difference between `className` and inline `style` in JSX?**
  A: `className` references CSS rules defined elsewhere (reusable, supports pseudo-classes/media queries); inline `style={{ }}` is a JS object applied directly to that one element (good for one-off/dynamic values, but cannot express `:hover` or `@media` — which is why `ItemDetail.jsx` needs an actual `<style>` tag for its responsive grid).

---

## Confusing / repeated / noteworthy code — things a teacher might ask about

Be ready to discuss these honestly — acknowledging them shows maturity and understanding:

1. **Star-rating rendering is duplicated 4 times** (`ItemCard.jsx:37`, `ItemDetail.jsx:44`, `EditItem.jsx:203`, `ListDetail.jsx:122`) — the exact same `{'★'.repeat(rating)}<span className="stars-empty">{'☆'.repeat(5 - rating)}</span>` snippet. **A cleaner version would extract a `<StarRating rating={n} />` component** (exactly the "reusable building block" idea from deck 07 slide 12). If asked "why didn't you extract this?", you can honestly say it would be a good refactor and explain how you'd do it.

2. **`AddItemForm.jsx` appears to be unused** — it's a separate, simpler form component, but `EditItemPage` builds its own inline form rather than using it. Search your imports to confirm; if true, this is dead code worth removing or explaining ("an earlier iteration before I built the richer Edit Item form with genres/vibes/live preview").

3. **Inline styles everywhwere instead of CSS classes** — nearly every element has a large `style={{ ... }}` object. This works, but makes JSX harder to read and repeats styling logic (e.g., the label style object in `EditItem.jsx`'s `label()` helper is duplicated conceptually across pages). A teacher might ask "why not more CSS classes?" — a fair answer is "rapid iteration during development; given more time I'd extract repeated style objects into classes or shared style constants."

4. **`delete itemToSave.status;`** in both `addItem` and `updateItem` ([`LibraryContext.jsx:102`](src/context/LibraryContext.jsx#L102) and [`:135`](src/context/LibraryContext.jsx#L135)) — removes a `status` field that the form never sets. This looks like leftover code from an earlier data model. Worth understanding *why* it's there (to avoid sending a stale/unwanted field to the backend) even if it's now likely a no-op.

5. **`getUserId` "fake auth"** — [`LibraryContext.jsx:6-9`](src/context/LibraryContext.jsx#L6-L9) and the `login` function accept *any* email/password ≥ 6 characters; there's no real backend authentication. This is explicitly commented as a simplification (`Login.jsx:27-28`: "In a real app, you'd verify credentials against a backend"). Good to be upfront about this if asked "is this secure?" — answer: "No, this is a demo/learning project using `json-server`, which has no real authentication; in production I'd hash passwords and verify them server-side."

6. **Filter-label-to-data-value translation** in `Library.jsx:21`:
   ```jsx
   const matchFormat = format === 'All' || item.type === format.toLowerCase().replace('albums', 'music').replace('movies', 'movie').replace('books', 'book');
   ```
   This chained `.replace()` converts plural UI labels ("Albums", "Movies", "Books") into the singular values stored in the database ("music", "movie", "book"). It works but is fragile/hard to read — a cleaner approach would be a small lookup object `{ Movies: 'movie', Books: 'book', Albums: 'music' }`. Good to recognize and be able to explain both *what* it does and *how you'd improve it*.

7. **`App.css` is essentially unused** — it still contains the default Create-React-App boilerplate (`.App-logo`, `.App-header`, spin animation) but `App.js` never references the `.App` class. This is leftover scaffold code from project setup.

---

## PRIORITIZED REVISION PLAN

### Priority 1 — Must understand cold (study first, ~2-3 hours)
These are the files/topics your demo will revolve around, and the concepts most likely to anchor exam questions:

1. **`src/context/LibraryContext.jsx`** — read it top to bottom until you can explain: how `useState` + `useEffect` + `fetch` work together, what `LibraryProvider`/`useLibrary` do, and how each CRUD function (`addItem`, `updateItem`, `deleteItem`, `addList`, etc.) builds its request and updates state immutably (Topics 6, 7, 11, 12).
2. **`src/App.js`** — routing structure, the logged-in/logged-out route split, `<Routes>`/`<Route>`/`<Navigate>`, `LibraryProvider` + `BrowserRouter` nesting (Topics 1, 11, 13).
3. **`src/pages/Library.jsx`** — filtering logic (`.filter`, multiple `useState`), conditional rendering (loading/empty/grid), `.map()` + `key` (Topics 5, 6, 9).
4. Be able to **trace one full user action end-to-end**, e.g. "user clicks Delete on an item": `ItemDetail.jsx handleDelete` → `useLibrary().deleteItem` → `LibraryContext.deleteItem` (confirms ownership, sends DELETE, updates `items` and `lists` state immutably) → `navigate('/')`. Practicing this trace out loud is probably the single best demo prep you can do.

### Priority 2 — Should understand well (study second, ~2 hours)
5. **`src/pages/EditItem.jsx`** — the `form` object as combined state, the `set(key, val)` helper and computed property names, `toggleGenre`, controlled inputs, conditional rendering of the live preview (Topics 6, 10, 12).
6. **`src/components/Navbar.jsx`** and **`src/components/ItemCard.jsx`** — small, clean examples of props, destructuring, events, conditional rendering, optional chaining (Topics 1, 3, 4, 8, 9).
7. **`src/pages/Login.jsx`** — controlled form inputs, validation-on-submit, tab-switching via state (Topics 6, 10).
8. Review **Topic 13 (React Router)** again with `ItemDetail.jsx`/`EditItem.jsx`/`ListDetail.jsx` open — practice explaining `useParams`, `useNavigate`, and why `Number(id)` matters.

### Priority 3 — Good to know / fill in gaps (study third, ~1 hour)
9. **`src/pages/ListDetail.jsx`** and **`src/pages/Lists.jsx`** — more `.map()`/`key`/forms practice, plus the "button outside the Link" event-bubbling trick.
10. **`src/index.css`** — skim through the `:root` variables and utility classes (`.btn-primary`, `.card-grid`, `.media-cover`, the two `@media` rules) so you can speak to your styling approach vs. Bootstrap (Topic 14).
11. Re-read the **"Confusing/repeated code"** section above and rehearse calm, confident answers for each — teachers often probe exactly these kinds of things, and having a thoughtful answer ready ("yes, I noticed this duplication, here's how I'd refactor it") demonstrates real understanding rather than rote memorization.
12. Skim **`src/components/MediaCover.jsx`** and **`src/components/ListCard.jsx`** — smaller supporting components that reinforce props/defaults/optional chaining.

### Final pre-demo checklist
- [ ] Can you explain, without looking, what happens from the moment the app loads to the moment the Library page shows real data? (Answer: `App` renders → `LibraryProvider`'s `useEffect` checks `localStorage` for a saved user → if found, fetches items/lists → state updates → `LibraryPage` re-renders with data.)
- [ ] Can you point to one example each of: a controlled input, a list rendered with `.map()` and `key`, a custom hook, conditional rendering, and an immutable state update — and explain each in under 30 seconds?
- [ ] Can you justify (calmly, not defensively) why you used Context instead of prop drilling, and why you used custom CSS instead of Bootstrap?
- [ ] Run the app locally (`npm start` + `json-server db.json --port 3001`) and walk through: login → browse/filter library → open an item → edit it → create a list → add an item to the list → delete something. Narrate what's happening in the code at each step.
