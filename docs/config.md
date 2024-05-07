# Config Specification

To use the latexdiff docker runner image, or to reproduce the result of using the website, follow the instructions here.

## folder layout

- new.zip
- old.zip
- config.json

## JSON config

- `other_cmdlines` (string): 
- `style` (string or object): specify the style of the new or deleted texts.
  - (if the type is object): Custom preamble configs. (implies default `--subtype` and `--floattype`)
    - `new_text`: dict or null
      - (if the type is null): do not show the old text
      - `color`: list[R, G, B] (from 0 to 255) or None
      - `style` (string or null): underline_wave, strikeout, or null
    - `old_text`: same as above
  - (if the type is string): predefined styles of latexdiff. Passed to the `--type` flag of latexdiff.
    - Should be one of UNDERLINE CTRADITIONAL TRADITIONAL CFONT FONTSTRIKE INVISIBLE CHANGEBAR CCHANGEBAR CULINECHBAR CFONTCHBAR BOLD PDFCOMMENT
    - See the [manual](http://texdoc.net/texmf-dist/doc/support/latexdiff/doc/latexdiff-man.pdf) for more detail.
- `main_tex` (string): The main tex filename. Must be the same for the old and new project.
- `bib` (string or null): Generate bibliography, use bibtex or biber.
  - Should be one of "bibtex" or "biber" or null
