# Differences Between Theory and My Project

This report compares the theory decks `06-responsiveDesign` through `13-react-router` with the submitted `culture-nook-app`. It is intentionally honest: the project works, but several implementation choices differ from the recommended classroom patterns, especially around Bootstrap and responsive layout.

## 1. Theory Concepts Taught In Class

The theory presentations emphasize these main ideas:

- Responsive design: viewport meta tag, media queries, breakpoints, mobile-first thinking, orientation queries, and layouts that adapt to phones/tablets/desktops.
- 12-column grid systems: `.row`, `.col-*`, percentage columns, `box-sizing: border-box`, floats/clearfix in the custom-grid explanation, and breakpoint-specific columns.
- Bootstrap: CDN/download installation, `.container`, `.container-fluid`, `.row`, `.col-*`, `.col-sm-*`, `.col-md-*`, `.col-lg-*`, `.col-xl-*`, and reusable responsive components/utilities.
- React basics: JSX, components, uppercase component names, one root element/fragments, imports/exports, `className`, inline style objects, and component organization.
- Props and lists: passing data into child components, destructuring props, default prop values, `children`, `.map()`, and stable `key` values.
- Events and state: event handlers, `useState`, updating state immutably, controlled UI, conditional rendering, and avoiding direct state mutation.
- Forms: controlled inputs, `onSubmit`, `preventDefault`, validation, `onChange`, `select`, `textarea`, and form state.
- State management: lifting state up, Context, shared state ownership, state preservation, and avoiding excessive prop drilling.
- HTTP: `fetch`, `GET`, `POST`, `PUT`, `DELETE`, async/await, `useEffect`, loading/error states, JSON, and backend persistence.
- React Router: `BrowserRouter`, routes, `Link`, dynamic params, `useParams`, `useNavigate`, nested routes, `<Outlet />`, `NavLink`, `errorElement`, index routes, and loaders.

## 2. Actual Project Implementation Summary

The app is a React personal media library. It uses:

- React components in `src/components` and full pages in `src/pages`.
- React Router v6 JSX routes in `src/App.js`, with login-gated route sets.
- Context in `src/context/LibraryContext.jsx` for `user`, `items`, `lists`, loading/error state, and CRUD functions.
- `json-server` at `http://localhost:3001` for fake persistence.
- Controlled forms in `Login.jsx`, `EditItem.jsx`, `Lists.jsx`, and `ListDetail.jsx`.
- Custom CSS in `src/index.css`, many inline `style={{ ... }}` objects, CSS variables, Flexbox, CSS Grid, and a few media queries.
- No Bootstrap package, no Bootstrap CSS import, no Bootstrap `.container`, `.row`, or `.col-*` grid classes.

## 3. Responsiveness Deep Dive

### Does the project use Bootstrap?

No. `package.json` has no `bootstrap` or `react-bootstrap` dependency, and `rg` found no Bootstrap imports/classes in `src`. The project uses custom CSS instead.

### Does it use the Bootstrap grid system or 12-column layout?

No. There are no `.row`, `.col-6`, `.col-md-4`, `.container`, or `.container-fluid` Bootstrap classes. The project does not divide layout into 12 columns. It uses native CSS Grid and Flexbox.

### What does it use instead?

The main reusable responsive layout is:

```css
/* src/index.css */
.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .page-container { padding: 0 16px; }
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

@media (max-width: 480px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
}
```

This is not Bootstrap, but it is genuine responsive CSS. `repeat(auto-fill, minmax(160px, 1fr))` lets the browser decide how many cards fit in the available width.

### Does it use CSS Grid?

Yes:

- `src/index.css`: `.card-grid`.
- `src/pages/Lists.jsx`: `gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'`.
- `src/pages/ItemDetail.jsx`: `gridTemplateColumns: '280px 1fr'`, then a media query changes it to one column.
- `src/pages/EditItem.jsx`: `gridTemplateColumns: '1fr 340px'` and `gridTemplateColumns: '1fr 1fr'` for form rows.
- `src/pages/Lists.jsx`: create-list form uses `gridTemplateColumns: 'minmax(220px, 1fr) minmax(260px, 2fr)'`.

### Does it use Flexbox?

Yes, heavily:

- `Navbar.jsx`: navigation layout uses `display: 'flex'`.
- `Library.jsx`: filter rows and header use Flexbox with `flexWrap: 'wrap'`.
- `Login.jsx`: two-panel login layout uses Flexbox.
- `ListDetail.jsx`: header/buttons and rename form use Flexbox.
- `ListCard.jsx`: card layout and preview cover row use Flexbox.

### Does it use media queries?

Yes, but only a few:

- `src/index.css`: `@media (max-width: 768px)` for `.page-container`.
- `src/index.css`: `@media (max-width: 480px)` for `.card-grid`.
- `src/pages/ItemDetail.jsx`: inline `<style>` changes `.detail-grid` to one column below 768px.
- `src/App.css`: default CRA `prefers-reduced-motion` query, but it is boilerplate and not important to the app layout.

### Does it use fixed widths or responsive units?

Both:

- Responsive/relative: `max-width: 1280px`, `width: 100%`, `1fr`, `auto-fill`, `minmax(...)`, `flex: 1`, `flexWrap: 'wrap'`.
- Fixed/min widths: `minWidth: 260` in `Library.jsx`, `width: '40%'` and `minWidth: 280` in `Login.jsx`, `gridTemplateColumns: '1fr 340px'` in `EditItem.jsx`, `gridTemplateColumns: '280px 1fr'` in `ItemDetail.jsx`, `width: 44` in `ListCard.jsx`.

### Is the project genuinely responsive?

Partly yes, but not perfectly.

Strong responsive parts:

- The library item grid is genuinely responsive.
- The list card grid is responsive.
- The item detail page stacks to one column below 768px.
- Many Flexbox rows use `flexWrap: 'wrap'`, so they avoid obvious overflow.
- The viewport meta tag exists in `public/index.html`: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.

Weak responsive parts:

- The app does not use the Bootstrap grid or the taught 12-column system.
- The project is mostly desktop-first (`max-width`) rather than mobile-first (`min-width`).
- `Login.jsx` keeps a two-panel layout with `width: '40%'` and `minWidth: 280`; there is no mobile media query to stack panels.
- `EditItem.jsx` uses a two-column grid `1fr 340px` without a media query, so narrow screens may feel cramped.
- `Lists.jsx` create-list form uses a two-column grid without a mobile media query.
- `ListDetail.jsx` add-item form uses a non-wrapping flex row.
- Many styles are inline, so responsive behavior is harder to centralize.

Bottom line for demo: the app has real responsive techniques, but it is not a complete Bootstrap/mobile-first implementation.

## 4. Difference Table And Defense Notes

### Difference 1: Bootstrap Not Used

- Theory approach: Use Bootstrap through CDN/download, then apply `.container`, `.row`, `.col-*`, and breakpoint classes.
- My implementation: No Bootstrap. Custom CSS variables, utility classes, CSS Grid, Flexbox, and inline styles.
- Technical difference: Framework class system vs hand-written layout/styling.
- Advantages of theory approach: Faster, standardized, familiar, tested responsive behavior, easier to explain against the slides.
- Advantages of my approach: Full visual control, smaller dependency surface, less Bootstrap-looking UI, direct practice with CSS.
- Disadvantages of my approach: More responsibility, less standardized, easier to miss mobile edge cases.
- Does it work correctly? Yes, the app can function without Bootstrap.
- Demo risk: High, because Bootstrap was a major theory topic.
- Safe explanation: "I did not use Bootstrap. I implemented the same general goal, responsive layout, with native CSS Grid, Flexbox, media queries, and a custom `.page-container`. Bootstrap would have given me a ready-made grid, but I chose custom CSS for visual control."
- Professional justification: "This is a valid modern approach, but I understand Bootstrap's grid would have been more aligned with the course recommendation."
- What NOT to say: "Bootstrap is bad" or "I did not need to learn it."
- Likely follow-up: "Then do you understand Bootstrap?"
- Good answer: "Yes. Bootstrap would normally use `.container`, `.row`, and column classes like `.col-md-4`. My `.card-grid` achieves responsive columns with CSS Grid instead of 12-column classes."

### Difference 2: No 12-Column Grid

- Theory approach: Divide rows into 12 columns and use classes like `.col-12`, `.col-sm-6`, `.col-md-4`.
- My implementation: `grid-template-columns: repeat(auto-fill, minmax(...))`.
- Technical difference: Percentage-based 12-column framework vs content-based CSS Grid.
- Advantages of theory approach: Predictable column math; directly matches Bootstrap.
- Advantages of my approach: Fewer wrapper elements; automatic fitting; clean for card layouts.
- Disadvantages of my approach: It does not demonstrate the exact taught 12-column class pattern.
- Does it work correctly? Yes for library/list card grids.
- Demo risk: High.
- Safe explanation: "I did not implement a 12-column grid. I used CSS Grid because the main layout is a collection of repeated cards, which CSS Grid handles naturally."
- What NOT to say: "The 12-column system is old and useless."
- Follow-up: "How would this look in Bootstrap?"
- Good answer: "Each card could be inside something like `col-6 col-md-3`, inside a `.row`, inside a `.container`."

### Difference 3: Desktop-First Media Queries

- Theory approach: The slides emphasize mobile-first: base styles for small screens, then `min-width` queries for larger screens.
- My implementation: Uses `max-width` queries at 768px and 480px.
- Technical difference: Desktop-first overrides vs mobile-first progressive enhancement.
- Advantages of theory approach: Usually cleaner for phones and aligns with Bootstrap.
- Advantages of my approach: Easy to adapt a desktop design downward.
- Disadvantages of my approach: Mobile can become an afterthought; more risk of cramped layouts.
- Does it work correctly? Partly; the most important grids respond, but not every page is fully optimized.
- Demo risk: Medium.
- Safe explanation: "My CSS is mostly desktop-first. I used `max-width` breakpoints to simplify specific layouts on smaller screens."
- What NOT to say: "Mobile-first does not matter."
- Follow-up: "What is the difference?"
- Good answer: "Mobile-first starts small and uses `min-width`; desktop-first starts large and uses `max-width` to override downward."

### Difference 4: Custom `.page-container` Instead Of Bootstrap `.container`

- Theory approach: Bootstrap `.container` or `.container-fluid`.
- My implementation: `.page-container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }`.
- Technical difference: Manual container values vs Bootstrap breakpoint max-widths.
- Advantages of theory approach: Responsive max-widths already defined.
- Advantages of my approach: Exact width/padding chosen for this app.
- Disadvantages of my approach: Less standardized and fewer built-in breakpoints.
- Does it work correctly? Yes.
- Demo risk: Low to Medium.
- Safe explanation: "My `.page-container` is conceptually similar to Bootstrap's `.container`: it centers content and limits line length."
- What NOT to say: "It is basically Bootstrap."
- Follow-up: "What is `.container-fluid`?"
- Good answer: "It spans the full viewport width, while `.container` has responsive max-widths."

### Difference 5: Heavy Inline Styles

- Theory approach: Use `className` with CSS files, CSS Modules, or carefully chosen inline styles for dynamic values.
- My implementation: Many components use large inline `style={{ ... }}` objects.
- Technical difference: Per-element JS style objects vs reusable CSS classes.
- Advantages of theory approach: Cleaner JSX, reusable styles, easier media queries and pseudo-classes.
- Advantages of my approach: Fast iteration and styles close to the component.
- Disadvantages of my approach: Repetition, harder responsive maintenance, no `:hover` or `@media` inside inline style objects.
- Does it work correctly? Yes, but maintainability is weaker.
- Demo risk: Medium.
- Safe explanation: "I used inline styles a lot for speed and component-local styling. For repeated patterns I did still use classes like `.btn-primary`, `.card-grid`, `.tag`, and `.media-cover`."
- What NOT to say: "CSS files are unnecessary."
- Follow-up: "Why is inline styling limited?"
- Good answer: "Inline style objects cannot directly contain media queries or pseudo-classes, so responsive and hover styles usually belong in CSS."

### Difference 6: Some Responsive Gaps

- Theory approach: Every important layout should adapt across breakpoints.
- My implementation: Main grid adapts, but login/edit/list forms have desktop-style inline grids with limited mobile overrides.
- Technical difference: Partial responsive coverage.
- Advantages of theory approach: More reliable mobile experience.
- Advantages of my approach: Desktop demo experience is polished and clear.
- Disadvantages of my approach: Teacher may resize to a narrow phone and find cramped layouts.
- Does it work correctly? Functionally yes; visually not equally strong on all screens.
- Demo risk: High if teacher tests mobile.
- Safe explanation: "The project is responsive in the main browsing areas, especially card grids and item detail, but I would be honest that not every form layout has the same level of mobile refinement."
- What NOT to say: "It is fully responsive everywhere."
- Follow-up: "Which page is weakest?"
- Good answer: "The edit page, because it uses `gridTemplateColumns: '1fr 340px'` without the same mobile media query as `ItemDetail`."

### Difference 7: React Router API Differs From Newer Nested Router Theory

- Theory approach: Nested route objects, layout routes, `<Outlet />`, `errorElement`, index routes, loaders.
- My implementation: `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Navigate>` in JSX.
- Technical difference: JSX route declaration vs route object/data-router style.
- Advantages of theory approach: Better for nested layouts, loaders, route-level errors.
- Advantages of my approach: Simple and readable for a small app.
- Disadvantages of my approach: No route loaders or `errorElement`; shared layout is manual.
- Does it work correctly? Yes.
- Demo risk: Medium.
- Safe explanation: "I used the JSX route API from React Router v6. It still supports routing, params, links, and redirects, but it is not the same nested data-router pattern from the slides."
- What NOT to say: "Outlet and loaders are not useful."
- Follow-up: "Where would `<Outlet />` go?"
- Good answer: "Inside a root layout component, below the Navbar, where the child page should render."

### Difference 8: Manual Active Nav Instead Of `NavLink`

- Theory approach: Use `<NavLink>` and its `isActive` value for active nav styling.
- My implementation: `Navbar.jsx` uses `useLocation()` and manual path comparison.
- Technical difference: Manual URL matching vs built-in router matching.
- Advantages of theory approach: Less code and fewer edge cases.
- Advantages of my approach: It works for the two simple nav links.
- Disadvantages of my approach: More fragile if routes become nested or paths change.
- Does it work correctly? Yes for `/` and `/lists`.
- Demo risk: Medium.
- Safe explanation: "I manually reproduced the active-link behavior with `useLocation`, but `NavLink` would be the cleaner React Router tool."
- What NOT to say: "`NavLink` and `Link` are exactly the same."
- Follow-up: "What does `NavLink` add?"
- Good answer: "It knows whether its destination is currently active and exposes `isActive` for styling."

### Difference 9: Fetching In Context `useEffect`, Not Route Loaders

- Theory approach: Route loaders can fetch data before rendering a route.
- My implementation: `LibraryContext.jsx` fetches items/lists in `useEffect` when `user` changes.
- Technical difference: App-level post-render fetch vs route-level pre-render data loading.
- Advantages of theory approach: Data can be ready before the page renders; route-specific errors.
- Advantages of my approach: Centralized data ownership; simpler for shared library/list data.
- Disadvantages of my approach: Initial loading states and possible loading flash.
- Does it work correctly? Yes.
- Demo risk: Medium.
- Safe explanation: "I used context-level fetching because items and lists are shared by many pages. Loaders would be a more advanced alternative, especially for route-specific data."
- What NOT to say: "Loaders are the same as `useEffect`."
- Follow-up: "What is the user-facing difference?"
- Good answer: "`useEffect` fetches after render, so the page may show loading. A loader fetches before the route renders."

### Difference 10: Fake Authentication

- Theory approach: Not necessarily full auth, but real apps verify credentials server-side.
- My implementation: `Login.jsx` accepts any email plus password of at least 6 characters; `LibraryContext.jsx` stores a user in `localStorage`.
- Technical difference: Demo identity separation vs real authentication.
- Advantages of theory approach: Real security.
- Advantages of my approach: Simple enough for a frontend/json-server project.
- Disadvantages of my approach: Not secure; no password verification.
- Does it work correctly? Yes for demo user separation.
- Demo risk: Medium.
- Safe explanation: "This is fake auth for a frontend demo. It identifies a user so data can be filtered by `userId`, but it is not secure production authentication."
- What NOT to say: "This login is secure."
- Follow-up: "What would production need?"
- Good answer: "Server-side credential verification, hashed passwords, sessions/tokens, and authorization checks on the backend."

### Difference 11: Unused `AddItemForm.jsx` And Boilerplate `App.css`

- Theory approach: Keep codebase clean; components should be used or removed.
- My implementation: `AddItemForm.jsx` exists but is not imported; `App.css` still contains CRA boilerplate.
- Technical difference: Submitted code includes leftover scaffold/earlier-iteration files.
- Advantages of theory approach: Easier to maintain and defend.
- Advantages of my approach: No runtime effect because unused files are not part of the rendered app.
- Disadvantages of my approach: Teacher may see it as untidy.
- Does it work correctly? Yes.
- Demo risk: Low to Medium.
- Safe explanation: "`AddItemForm` was an earlier simpler form. The submitted app uses `EditItem.jsx` for the richer add/edit workflow. `App.css` is leftover CRA boilerplate."
- What NOT to say: "I do not know what that file is."
- Follow-up: "Does unused code affect the UI?"
- Good answer: "No, because it is not imported into the component tree, but it should be cleaned in a production project."

### Difference 12: Repeated Star Rating Rendering

- Theory approach: Extract repeated UI into reusable components.
- My implementation: Star rendering appears in multiple places.
- Technical difference: Repeated JSX vs a reusable `<StarRating />` component.
- Advantages of theory approach: Less duplication; one place to change behavior.
- Advantages of my approach: Simple and explicit in each file.
- Disadvantages of my approach: Repetition and possible inconsistencies later.
- Does it work correctly? Yes.
- Demo risk: Low.
- Safe explanation: "The rating display works, but this is a good example where a reusable component would better match the component theory."
- What NOT to say: "Duplication never matters."
- Follow-up: "How would you refactor it?"
- Good answer: "Create `StarRating({ rating })`, convert rating to a number once, then reuse it in cards, details, previews, and list detail."

## 5. If My Teacher Questions Why I Didn't Use Bootstrap

### Strongest truthful explanation

"I did not use Bootstrap in the submitted project. Instead, I implemented responsiveness manually with CSS Grid, Flexbox, CSS variables, and media queries. The main browsing layout uses `.card-grid` with `repeat(auto-fill, minmax(160px, 1fr))`, which automatically changes the number of columns based on available width. I understand that Bootstrap would have been more directly aligned with the theory, especially `.container`, `.row`, and `.col-*`, but I chose custom CSS to control the visual identity and practice native CSS layout."

### Weakest explanation to avoid

Avoid saying: "Bootstrap was unnecessary" or "Bootstrap is outdated." That sounds dismissive of the course material.

### Likely follow-up questions and answers

- Q: "Do you know how Bootstrap would structure this?"
  A: "Yes. The page would usually use `.container`, then `.row`, then card wrappers like `.col-6 col-md-3` so cards are 2 per row on small screens and 4 per row on medium screens."
- Q: "What is the Bootstrap 12-column grid?"
  A: "A row is divided into 12 columns. An element can span a number of columns, like 6 for half width, 4 for one third, 3 for one quarter."
- Q: "What does your project use instead?"
  A: "Native CSS Grid for repeated card layouts, Flexbox for one-dimensional alignment/wrapping, and a few media queries for breakpoint-specific changes."
- Q: "Is your project responsive?"
  A: "The main card browsing views are responsive. Some form pages are less complete on small screens, so I would not claim the whole app is perfectly responsive."
- Q: "Why is CSS Grid acceptable?"
  A: "CSS Grid is a native browser layout system designed for two-dimensional layouts. Bootstrap's grid is a framework abstraction; CSS Grid is the lower-level CSS feature."

## 6. What I Need To Understand To Defend This Project

### Critical

- Bootstrap vs my implementation: know `.container`, `.row`, `.col-*`, 12 columns, and how `.card-grid` replaces that in this app.
- Responsiveness weaknesses: be ready to admit `EditItem.jsx`, `Login.jsx`, and some forms are less responsive.
- React Router: explain `BrowserRouter`, `<Routes>`, `<Route>`, `<Navigate>`, `Link`, `useParams`, and `useNavigate`.
- Context: explain why `LibraryContext.jsx` owns `user`, `items`, `lists`, loading/error, and CRUD functions.
- Forms: explain controlled inputs, `preventDefault`, validation, and form state in `EditItem.jsx` and `Login.jsx`.
- HTTP flow: explain `fetch`, CRUD methods, `json-server`, and state updates after server responses.

### Important

- Props: `ItemCard({ item })`, `MediaCover({ item, type, title, square })`, `ListCard({ list })`.
- Lists and keys: `.map()` with `key={item.id}` or `key={list.id}`.
- State immutability: `map`, `filter`, and spread syntax in `LibraryContext.jsx`.
- Conditional rendering: loading, empty states, `menuOpen && (...)`, `tab === 'register' && (...)`.
- Inline styles vs CSS classes: benefits and drawbacks.
- Fake auth: `localStorage`, `userId`, and why it is not production security.

### Nice To Know

- `NavLink` vs manual `useLocation`.
- `<Outlet />`, index routes, `errorElement`, and route loaders.
- CSS variables in `:root`.
- Optional chaining `?.`.
- Why `Number(id)` is needed because route params are strings.
- Unused files and possible refactors: `AddItemForm.jsx`, `App.css`, repeated star rendering.

## 7. Teacher Interrogation Mode

1. Q: "Did you use Bootstrap?"
   A: "No. I used custom CSS, CSS Grid, Flexbox, CSS variables, and media queries. That differs from the Bootstrap theory."

2. Q: "Where is your Bootstrap grid?"
   A: "There is no Bootstrap grid. The closest equivalent is `.card-grid` in `src/index.css`, using `display: grid` and `repeat(auto-fill, minmax(160px, 1fr))`."

3. Q: "Does your project use the 12-column layout?"
   A: "No. It uses native CSS Grid instead of 12-column classes."

4. Q: "What is the risk of not using Bootstrap?"
   A: "I had to handle responsiveness myself, so some pages are less complete on mobile than a Bootstrap grid might be."

5. Q: "Which page is least responsive?"
   A: "`EditItem.jsx` is a likely weak point because it uses `gridTemplateColumns: '1fr 340px'` without a matching mobile media query."

6. Q: "Which page has a good responsive example?"
   A: "`ItemDetail.jsx` uses a two-column `.detail-grid`, then an inline media query changes it to `1fr` below 768px."

7. Q: "What does `.card-grid` do?"
   A: "It creates a responsive card layout where each column is at least 160px and expands with `1fr`; the browser fits as many columns as possible."

8. Q: "Why is the viewport meta tag important?"
   A: "It makes mobile browsers use the real device width. Without it, media queries would not behave correctly on phones."

9. Q: "Where is shared state stored?"
   A: "In `LibraryContext.jsx`: `items`, `lists`, `loading`, `error`, and `user` are stored with `useState` and shared through Context."

10. Q: "Why use Context?"
    A: "Many unrelated pages need the same data and CRUD functions. Context avoids passing props through every intermediate component."

11. Q: "What does `useLibrary()` do?"
    A: "It is a custom hook that returns `useContext(LibraryContext)`, so components can access the shared library state."

12. Q: "When does the app fetch data?"
    A: "`LibraryContext.jsx` has a `useEffect` that runs when `user` changes. It fetches that user's items and lists."

13. Q: "What backend do you use?"
    A: "`json-server` on port 3001, using `db.json` as a fake REST API."

14. Q: "How do you create an item?"
    A: "`addItem` sends a `POST` request to `/items`, then appends the saved item to state with `setItems(prev => [...prev, savedItem])`."

15. Q: "How do you update an item?"
    A: "`updateItem` sends a `PUT` request to `/items/:id`, then replaces the matching item in state using `.map()`."

16. Q: "How do you delete an item?"
    A: "`deleteItem` sends `DELETE`, filters the item out of `items`, and removes that id from every list's `itemIds`."

17. Q: "Is the login secure?"
    A: "No. It is fake auth for a frontend demo. It stores a simple user object in `localStorage` and filters data by `userId`."

18. Q: "Where do routes live?"
    A: "In `src/App.js`, inside `<BrowserRouter>` and `<Routes>`."

19. Q: "How do you protect routes?"
    A: "`AppRoutes` checks `user`. If there is no user, only `/login` is available and everything else redirects to `/login`."

20. Q: "How does `/items/:id` work?"
    A: "`:id` is a dynamic route segment. `ItemDetail.jsx` reads it with `useParams()` and finds the matching item."

21. Q: "Why do you write `Number(id)`?"
    A: "React Router params are strings, but item ids from `json-server` are numbers. Strict equality requires matching types."

22. Q: "When do you use `useNavigate()`?"
    A: "After code-driven actions, like deleting an item or creating a list, when the app should move pages programmatically."

23. Q: "Why use `Link` instead of `<a>`?"
    A: "`Link` changes routes without a full page reload, preserving React state."

24. Q: "Why did you not use `NavLink`?"
    A: "I used `useLocation` manually to style active links. It works here, but `NavLink` would be cleaner and closer to the theory."

25. Q: "What is a controlled input?"
    A: "An input whose value comes from React state and updates through `onChange`, like the email/password inputs in `Login.jsx`."

26. Q: "Why call `preventDefault()` in forms?"
    A: "It stops the browser's normal page refresh so React can validate and submit the data."

27. Q: "Where do you use props?"
    A: "`Library.jsx` passes `item` to `ItemCard`; `ListCard` receives `list`; `MediaCover` receives `item`, `type`, `title`, and `square`."

28. Q: "Why do lists need `key`?"
    A: "React uses keys to track items between renders. I use stable ids like `item.id` and `list.id`."

29. Q: "What is one code quality issue in your project?"
    A: "Star rating rendering is repeated in several files. A reusable `StarRating` component would better match React component principles."

30. Q: "What is the most honest summary of your project vs theory?"
    A: "The React concepts are mostly aligned: components, props, state, forms, context, fetch, and routing are present. The biggest mismatch is layout theory: the course emphasizes Bootstrap and 12-column grids, while my project uses custom CSS Grid/Flexbox with partial responsiveness."

## Final Demo Position

The safest defense is not "my project perfectly follows the theory." The safest defense is:

"The project works and demonstrates the main React concepts: components, props, state, controlled forms, Context, HTTP CRUD, and routing. The main difference is styling and responsiveness. The course taught Bootstrap and 12-column grids; I used custom CSS with CSS Grid/Flexbox instead. That is a valid modern approach, but I understand it puts more responsibility on me, and some pages are less mobile-refined than a full Bootstrap implementation would be."
