# Cross-Browser Issues

## Meter Element Styling (Firefox)

### Issue

The HTML `<meter>` element has very limited styling support in Firefox. Standard CSS approaches for styling the meter bar do not work reliably:

- `accent-color` property: Does not affect `<meter>` elements in Firefox
- `::-moz-meter-bar` pseudo-element: Severely restricted and ineffective
- Webkit pseudo-elements (`::-webkit-meter-bar`, `::-webkit-meter-optimum-value`, etc.): Chrome/Safari/Edge only

### Current Implementation

**File:** `src/webComponents/gameplay/game-gauge.html`

The `<meter>` element is styled with:

```css
meter {
  accent-color: var(--color-primary);
}

meter::-webkit-meter-bar {
  @apply bg-slate-800 rounded-sm;
}

meter::-webkit-meter-optimum-value {
  @apply bg-primary rounded-sm;
}

meter::-webkit-meter-suboptimum-value {
  @apply bg-primary rounded-sm;
}

meter::-webkit-meter-even-less-good-value {
  @apply bg-danger rounded-sm;
}
```

### Current Behavior

- **Chrome, Safari, Edge:** Pink (`--color-primary: #db2777`) ✓
- **Firefox:** Default green (cannot be styled) ✗

### Decision

For now, this limitation is accepted as-is. Firefox will display the default green color while other browsers show the custom pink color.

### Future Options

If full cross-browser support becomes necessary, consider:

1. **Replace with custom `<div>` meter** - Full CSS control across all browsers
2. **Switch to `<progress>` element** - Better styling support, already proven to work in [static-assets-loading-overlay.html](src/htmlFragments/static-assets-loading-overlay.html)
3. **Use a third-party component library** - May provide cross-browser meter styling
