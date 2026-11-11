# Font files

Current brand typography (decision 299, 11 November 2026): only the FREE Gilroy weights ship, Light (300) and ExtraBold (800). Display headings use Gilroy ExtraBold, light display text uses Gilroy Light, and everything else uses Outfit (400-700, variable). Unbounded (500-600) stays for one short accent phrase.

- `Gilroy-Light.woff2`, `Gilroy-ExtraBold.woff2`: the free release, covered by `LICENSES/Gilroy-Free-Font-EULA.txt`.
- `Outfit-Variable.woff2`: SIL OFL, `LICENSES/OFL-Outfit.txt`.
- `Unbounded-Variable.woff2`: SIL OFL, `LICENSES/OFL-Unbounded.txt`.

The paid Gilroy weights (Regular, Medium, SemiBold, Bold) were removed and are not to be re-added; the project does not hold a licence for them. `tokens/tokens.css` wires each file to its weight.
