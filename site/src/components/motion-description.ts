const descriptions: Record<string, string> = {
  'button-saving': 'A monochrome box loader beside the Saving label keeps the pending action identifiable.',
  'inline-row': 'The same box loader at 16, 20 and 24 pixels demonstrates inline loading sizes.',
  'loader': 'The four-flap box opens, holds, folds shut and repeats while work is loading.',
  'logo-hover': 'The open logo folds shut and opens once on hover or keyboard focus.',
  'collapse': 'An expandable section reveals its content beneath the summary and closes back into the same space.',
  'card-tilt': 'A card tilts slightly in response to the pointer, adding optional decorative feedback.',
  'logo-flaps': 'The logo flaps move as a decorative brand accent without changing the logo artwork.',
  'confetti': 'Confetti briefly celebrates a completed action within the example frame.',
  'stamp': 'A success stamp settles into place to confirm a completed action.',
  'hover-press': 'Hover and press feedback shows which action is available and when it is being activated.',
  'kiosk-vs-normal': 'The same transition is compared at ordinary interface and larger kiosk viewing distances.',
  'slide-fade': 'Kiosk content slides and fades into position over a longer viewing distance.',
  'dialog': 'A centred confirmation dialog enters above a dimmed scrim while its action remains inside the panel.',
  'sheet': 'A bottom sheet rises from the lower edge, with a padded scrollable body and action area.',
  'drawer': 'A detail drawer slides in from the right edge above a dimmed scrim.',
  'drawer-left': 'A navigation drawer slides in from the left edge above a dimmed scrim.',
  'menu': 'An actions menu opens beside its trigger, showing Edit, Duplicate and Archive.',
  'showcase': 'A group of three introduction cards enters in a short ordered sequence.',
  'stagger': 'Eight numbered cards enter in reading order so the parent layout remains easy to follow.',
  'page-swap': 'Inventory replaces Requests inside a persistent sidebar shell during forward navigation.',
  'pinned-hero': 'An introductory hero remains in view while the surrounding scroll-driven presentation advances.',
  'reveal': 'Content appears as it reaches the viewport during scrolling.',
  'search-field': 'The search affordance expands into an editable query field and returns to its compact state.',
  'indicator': 'The active navigation indicator moves from Requests to Settings while labels stay in place.',
  'skeleton': 'Placeholder shapes show the structure of content that is still loading.',
  'theme-reveal': 'The next theme grows in a circle from the theme toggle, then the light theme grows back.',
  'toast': 'A saved-record notification enters near the corner with a Dismiss action.',
};
export function motionDescription(path: string) {
  const name = path.split('/').pop()!.replace(/\.(webp|gif)$/, '').replace(/-(light|dark)$/, '');
  return descriptions[name] || `Motion example: ${name.replaceAll('-', ' ')}. Read the adjacent motion guidance for its trigger and reduced-motion end state.`;
}
