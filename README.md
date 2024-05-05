# Git-latexdiff web

Keywords: latexdiff latex diff web online pdfdiff

An web interface for [git-latexdiff](https://gitlab.com/git-latexdiff/git-latexdiff) (which is eventually based on [latexdiff](https://github.com/ftilmann/latexdiff)). 

- Easy to Use: The input is two overleaf project zip file.
- Ready for paper submission: TODO

## Use it online!

- All uploaded files will be deleted and not preserved.

## Use as a command line tool

Create a folder with the following three files:

- `new.zip`: zipped latex project (new version).
- `old.zip`: zipped latex project (old version).
- `config.json`: config for the diff. See [docs/config.md](docs/config.md) for details.

Then run the docker:

```bash
docker run --rm -v <path-to-folder>:/work am009/latexdiff-web-worker
```

## Workflow

**Worker**

- Initialize a git repo and commit everything
- Extract the new project, overwrite everything, commit again
- Invoke the [git-latexdiff](https://gitlab.com/git-latexdiff/git-latexdiff) project
  - [git-latexdiff](https://gitlab.com/git-latexdiff/git-latexdiff) first runs latex-expand over two versions of projects
  - Then, it runs latexdiff to get the diffed tex file.
  - Compile the tex file and get the result pdf file.

**Website**

The web app is a simple web interface for the docker. 

- For security reasons, everything happens in a docker container with no network. 
- To save storage space and keep user's privacy, everything (files and the docker container) is deleted.
- If any error occurs, the output, and the command line to reproduce the run is returned to the user.

## Debug worker

You can specify `-e DEBUG=1` to the docker run command, and the pdf diff will be generated to a git latexdiff temp folder (e.g., `git-latexdiff.2026`).

### Options

Because unknown options for `git latexdiff` will be passed to `latexdiff`, so both tools' options can be specified in `other options`.

[**latexdiff manual**](http://texdoc.net/texmf-dist/doc/support/latexdiff/doc/latexdiff-man.pdf)

**options for latexdiff**

```
Usage: /usr/bin/latexdiff [options] old.tex new.tex > diff.tex

Compares two latex files and writes tex code to stdout, which has the same format as new.tex but 
has all changes relative to old.tex marked up or commented. Note that old.tex and new.tex need to
be real files (not pipes or similar) as they are opened twice. 

--type=markupstyle
-t markupstyle         Add code to preamble for selected markup style
                       Available styles: UNDERLINE CTRADITIONAL TRADITIONAL CFONT FONTSTRIKE INVISIBLE 
                                         CHANGEBAR CCHANGEBAR CULINECHBAR CFONTCHBAR BOLD PDFCOMMENT
                       [ Default: UNDERLINE ]

--subtype=markstyle
-s markstyle           Add code to preamble for selected style for bracketing
                       commands (e.g. to mark changes in  margin)
                       Available styles: SAFE MARGIN DVIPSCOL COLOR ZLABEL ONLYCHANGEDPAGE (LABEL)*
                       [ Default: SAFE ]
                       * LABEL subtype is deprecated

--floattype=markstyle
-f markstyle           Add code to preamble for selected style which 
                       replace standard marking and markup commands within floats
                       (e.g., marginal remarks cause an error within floats
                       so marginal marking can be disabled thus)
                       Available styles: FLOATSAFE IDENTICAL
                       [ Default: FLOATSAFE ]

--encoding=enc
-e enc                 Specify encoding of old.tex and new.tex. Typical encodings are
                       ascii, utf8, latin1, latin9.  A list of available encodings can be 
                       obtained by executing 
                       perl -MEncode -e 'print join ("\n",Encode->encodings( ":all" )) ;'
                       [Default encoding is utf8 unless the first few lines of the preamble contain
                       an invocation "\usepackage[..]{inputenc} in which case the 
                       encoding chosen by this command is asssumed. Note that ASCII (standard
                       latex) is a subset of utf8]

--preamble=file
-p file                Insert file at end of preamble instead of auto-generating
                       preamble.  The preamble must define the following commands
                       \DIFaddbegin,\DIFaddend,\DIFadd{..},
                       \DIFdelbegin,\DIFdelend,\DIFdel{..},
                       and varieties for use within floats
                       \DIFaddbeginFL,\DIFaddendFL,\DIFaddFL{..},
                       \DIFdelbeginFL,\DIFdelendFL,\DIFdelFL{..}
                       (If this option is set -t, -s, and -f options
                       are ignored.)

--exclude-safecmd=exclude-file
--exclude-safecmd="cmd1,cmd2,..."
-A exclude-file 
--replace-safecmd=replace-file
--append-safecmd=append-file
--append-safecmd="cmd1,cmd2,..."
-a append-file         Exclude from, replace or append to the list of regex
                       matching commands which are safe to use within the 
                       scope of a \DIFadd or \DIFdel command.  The file must contain
                       one Perl-RegEx per line (Comment lines beginning with # or % are
                       ignored). A literal comma within the comma-separated list must be
                       escaped thus "\,",   Note that the RegEx needs to match the whole of 
                       the token, i.e., /^regex$/ is implied and that the initial
                       "\" of the command is not included. The --exclude-safecmd
                       and --append-safecmd options can be combined with the --replace-safecmd 
                       option and can be used repeatedly to add cumulatively to the lists.

--exclude-textcmd=exclude-file 
--exclude-textcmd="cmd1,cmd2,..."
-X exclude-file
--replace-textcmd=replace-file
--append-textcmd=append-file
--append-textcmd="cmd1,cmd2,..."
-x append-file         Exclude from, replace or append to the list of regex
                       matching commands whose last argument is text.  See
                       entry for --exclude-safecmd directly above for further details.

--replace-context1cmd=replace-file
--append-context1cmd=append-file
--append-context1cmd="cmd1,cmd2,..."
                       Replace or append to the list of regex matching commands
                       whose last argument is text but which require a particular
                       context to work, e.g. \caption will only work within a figure
                       or table.  These commands behave like text commands, except when 
                       they occur in a deleted section, when they are disabled, but their
                       argument is shown as deleted text.

--replace-context2cmd=replace-file
--append-context2cmd=append-file
--append-context2cmd="cmd1,cmd2,..."
                       As corresponding commands for context1.  The only difference is that
                       context2 commands are completely disabled in deleted sections, including
                       their arguments.
                       context2 commands are also the only commands in the preamble, whose argument will 
                       be processed in word-by-word mode (which only works, if they occur no more than
                       once in the preamble).

--exclude-mboxsafecmd=exclude-file
--exclude-mboxsafecmd="cmd1,cmd2,..."
--append-mboxsafecmd=append-file
--append-mboxsafecmd="cmd1,cmd2,..."
                       Define safe commands, which additionally need to be protected by encapsulating
                       in an \mbox{..}. This is sometimes needed to get around incompatibilities 
                       between external packages and the ulem package, which is  used for highlighting
                       in the default style UNDERLINE as well as CULINECHBAR CFONTSTRIKE
                       


--config var1=val1,var2=val2,...
-c var1=val1,..        Set configuration variables.
-c configfile           Available variables: 
                          ARRENV (RegEx)
                          COUNTERCMD (RegEx)
                          FLOATENV (RegEx)
                          ITEMCMD (RegEx)
                          LISTENV (RegEx)
                          MATHARRENV (RegEx)
                          MATHARRREPL (String)
                          MATHENV (RegEx)
                          MATHREPL (String)
                          MINWORDSBLOCK (Integer)
                          PICTUREENV (RegEx)
                          SCALEDELGRAPHICS (Float)
                          VERBATIMENV (RegEx)
                          VERBATIMLINEENV (RegEx)
                          CUSTOMDIFCMD (RegEx)
                       This option can be repeated.

--add-to-config  varenv1=pattern1,varenv2=pattern2
                       For configuration variables containing a regular expression (essentially those ending
                       in ENV, and COUNTERCMD) this provides an alternative way to modify the configuration 
                       variables. Instead of setting the complete pattern, with this option it is possible to add an
                       alternative pattern. varenv must be one of the variables listed above that take a regular
                       expression as argument, and pattern is any regular expression (which might need to be 
                       protected from the shell by quotation). Several patterns can be added at once by using semi-colons
                       to separate them, e.g. --add-to-config "LISTENV=myitemize;myenumerate,COUNTERCMD=endnote"

--packages=pkg1,pkg2,..
                       Tell latexdiff that .tex file is processed with the packages in list 
                       loaded.  This is normally not necessary if the .tex file includes the
                       preamble, as the preamble is automatically scanned for \usepackage commands.
                       Use of the --packages option disables automatic scanning, so if for any
                       reason package specific parsing needs to be switched off, use --packages=none.
                       The following packages trigger special behaviour:
                       endfloat hyperref amsmath apacite siunitx cleveref glossaries mhchem chemformula/chemmacros
                       biblatex
                       [ Default: scan the preamble for \usepackage commands to determine
                         loaded packages.]

--show-preamble        Print generated or included preamble commands to stdout.

--show-safecmd         Print list of regex matching and excluding safe commands.

--show-textcmd         Print list of regex matching and excluding commands with text argument.

--show-config          Show values of configuration variables

--show-all             Show all of the above

   NB For all --show commands, no old.tex or new.tex file needs to be given, and no 
      differencing takes place.

Other configuration options:

--allow-spaces         Allow spaces between bracketed or braced arguments to commands
                       [Default requires arguments to directly follow each other without 
                                intervening spaces]

--math-markup=level    Determine granularity of markup in displayed math environments:
                      Possible values for level are (both numerical and text labels are acceptable):
                      off or 0: suppress markup for math environments.  Deleted equations will not 
                               appear in diff file. This mode can be used if all the other modes 
                               cause invalid latex code.
                      whole or 1: Differencing on the level of whole equations. Even trivial changes
                               to equations cause the whole equation to be marked changed.  This 
                               mode can be used if processing in coarse or fine mode results in 
                               invalid latex code.
                      coarse or 2: Detect changes within equations marked up with a coarse
                               granularity; changes in equation type (e.g.displaymath to equation) 
                               appear as a change to the complete equation. This mode is recommended
                               for situations where the content and order of some equations are still
                               being changed. [Default]
                      fine or 3: Detect small change in equations and mark up and fine granularity.
                               This mode is most suitable, if only minor changes to equations are
                               expected, e.g. correction of typos. 

--graphics-markup=level   Change highlight style for graphics embedded with \includegraphics commands
                      Possible values for level:
                      none,off or 0: no highlighting for figures
                      new-only or 1: surround newly added or changed figures with a blue frame [Default]
                      both or 2:     highlight new figures with a blue frame and show deleted figures 
                                at reduced scale, and crossed out with a red diagonal cross. Use configuration
                                variable SCALEDELGRAPHICS to set size of deleted figures.
                      Note that changes to the optional parameters will make the figure appear as changed 
                      to latexdiff, and this figure will thus be highlighted.

--disable-citation-markup 
--disable-auto-mbox    Suppress citation markup and markup of other vulnerable commands in styles 
                       using ulem (UNDERLINE,FONTSTRIKE, CULINECHBAR)
                       (the two options are identical and are simply aliases)

--enable-citation-markup
--enforce-auto-mbox    Protect citation commands and other vulnerable commands in changed sections 
                       with \mbox command, i.e. use default behaviour for ulem package for other packages
                       (the two options are identical and are simply aliases)

Miscelleneous options

--label=label
-L label               Sets the labels used to describe the old and new files.  The first use
                       of this option sets the label describing the old file and the second
                       use of the option sets the label for the new file.
                       [Default: use the filename and modification dates for the label]

--no-label             Suppress inclusion of old and new file names as comment in output file

--visible-label         Include old and new filenames (or labels set with --label option) as 
                       visible output

--flatten              Replace \input and \include commands within body by the content
                       of the files in their argument.  If \includeonly is present in the
                       preamble, only those files are expanded into the document. However, 
                       no recursion is done, i.e. \input and \include commands within 
                       included sections are not expanded.  The included files are assumed to 
                       be located in the same directories as the old and new master files,
                       respectively, making it possible to organise files into old and new directories.
                       --flatten is applied recursively, so inputted files can contain further
                       \input statements.  Also handles files included by the import package
                       (\import and \subimport), and \subfile command.

--filter-script=filterscript    Run files through this filterscript (full path preferred) before processing.
                       The filterscript must take STDIN input and output to STDOUT.
                       When coupled with --flatten, each file will be run through the filter as it is brought in.

--ignore-filter-stderr When running with --filter-script, STDERR from the script may cause readability issues.
                       Turn this flag on to ignore STDERR from the filter script.



--help
-h                     Show this help text.

--ignore-warnings      Suppress warnings about inconsistencies in length between input
                       and parsed strings and missing characters. 

--verbose
-V                     Output various status information to stderr during processing.
                       Default is to work silently.

--version              Show version number.

Internal options:
These options are mostly for automated use by latexdiff-vc. They can be used directly, but
the API should be considered less stable than for the other options.

--no-links             Suppress generation of hyperreferences, used for minimal diffs 
                       (option --only-changes of latexdiff-vc).
```

**options for git latexdiff**

```
Usage: git latexdiff [options] OLD [NEW]
       git latexdiff [options] OLD --
       git latexdiff [options] -- OLD
Call latexdiff on two Git revisions of a file.

OLD and NEW are Git revision identifiers. NEW defaults to HEAD.
If "--" is used for NEW, then diff against the working directory.

Options:
    --help                this help message
    --help-examples       show examples of usage
    --main <file>         name of the main LaTeX, R Sweave,
                            or Emacs Org mode file.
                            The search for the only file containing 'documentclass'
                            will be attempted, if not specified.
                            For non-LaTeX files, a reasonable `prepare` command
                            will be used unless explicitly provided
    --no-view             don't display the resulting PDF file
    --latex               run latex instead of pdflatex
    --xelatex             run xelatex instead of pdflatex
    --lualatex            run lualatex instead of pdflatex
    --tectonic            run tectonic instead of pdflatex
    --bibtex, --bbl       display changes in the bibliography
                             (runs bibtex to generate *.bbl files and
                             include them in the source file using
                             latexpand --expand-bbl before computing
                             the diff)
    --biber               like --bibtex, but runs biber instead.
    --run-bibtex, -b      run bibtex as well as latex to generate the PDF file
                             (pdflatex,bibtex,pdflatex,pdflatex)
                          NOTE: --bibtex usually works better
    --run-biber           run BibLaTex-Biber as well as latex to generate the PDF file
                             (pdflatex,biber,pdflatex,pdflatex)
                          NOTE: --biber usually works better
    --view                view the resulting PDF file
                            (default if -o is not used)
    --pdf-viewer <cmd>    use <cmd> to view the PDF file (default: $PDFVIEWER)
    --no-cleanup          don't cleanup temp dir after running
    --no-flatten          don't call latexpand to flatten the document
    --cleanup MODE        Cleanup temporary files according to MODE:

                           - keeppdf (default): keep only the
                                  generated PDF file

                           - none: keep all temporary files
                                  (may eat your diskspace)

                           - all: erase all generated files.
                                  Problematic with --view when the
                                  viewer is e.g. evince, and doesn't
                                  like when the file being viewed is
                                  deleted.

    --latexmk             use latexmk
    --build-dir           use pdfs from specific build directory
    --latexopt            pass additional options to latex (e.g. -shell-escape)
    -o <file>, --output <file>
                          copy resulting PDF into <file> (usually ending with .pdf)
                          Implies "--cleanup all"
    --tmpdirprefix        where temporary directory will be created (default: /tmp).
                            Relative path will use repository root as a base
    --verbose, -v         give more verbose output
    --quiet               redirect output from subprocesses to log files
    --prepare <cmd>       run <cmd> before latexdiff (e.g. run make to generate
                             included files)
    --filter <cmd>        run <cmd> after latexdiff and before compilation
                             (e.g. to fix up latexdiff output)
    --ln-untracked        symlink uncommited files from the working directory
    --version             show git-latexdiff version.
    --subtree             checkout the tree at and below the main file
                             (enabled by default, disable with --whole-tree)
    --whole-tree          checkout the whole tree (contrast with --subtree)
    --ignore-latex-errors keep on going even if latex gives errors, so long as
                          a PDF file is produced
    --ignore-makefile     ignore the Makefile, build as though it doesn't exist
    -*                    other options are passed directly to latexdiff
    --latexpand OPT       pass option OPT to latexpand. Use multiple times like
                          --latexpand OPT1 --latexpand OPT2 to pass multiple options.
    --latexdiff-flatten   use --flatten from latexdiff instead of latexpand

Unrecognized options are passed unmodified to latexdiff.
```
