# latexdiff

## Predefined styles in preamble

In [**latexdiff manual**](http://texdoc.net/texmf-dist/doc/support/latexdiff/doc/latexdiff-man.pdf), there are three options:

- Major types(`-t`):
- Subtypes(`-s`)
- Float Types(`-f`)

Insert file at end of preamble instead of generating preamble. The preamble must define the following commands \DIFaddbegin, \DIFaddend,
\DIFadd{..}, \DIFdelbegin,\DIFdelend,\DIFdel{..}, and varieties for use within floats \DIFaddbeginFL, \DIFaddendFL, \DIFaddFL{..}, \DIFdelbeginFL, \DIFdelendFL, \DIFdelFL{..} (If this option is set -t, -s, and -f options are ignored.)

%%% TYPES (Commands for highlighting changed blocks)

%DIF UNDERLINE PREAMBLE
\RequirePackage[normalem]{ulem}
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\providecommand{\DIFadd}[1]{{\protect\color{blue}\uwave{#1}}}
\providecommand{\DIFdel}[1]{{\protect\color{red}\sout{#1}}}                     
%DIF END UNDERLINE PREAMBLE

%DIF CTRADITIONAL PREAMBLE
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\RequirePackage[stable]{footmisc}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\providecommand{\DIFadd}[1]{{\protect\color{blue} \sf #1}}
\providecommand{\DIFdel}[1]{{\protect\color{red} [..\footnote{removed: #1} ]}}
%DIF END CTRADITIONAL PREAMBLE

%DIF TRADITIONAL PREAMBLE
\RequirePackage[stable]{footmisc}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\providecommand{\DIFadd}[1]{{\sf #1}}
\providecommand{\DIFdel}[1]{{[..\footnote{removed: #1} ]}}
%DIF END TRADITIONAL PREAMBLE

%DIF CFONT PREAMBLE
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\providecommand{\DIFadd}[1]{{\protect\color{blue} \sf #1}}
\providecommand{\DIFdel}[1]{{\protect\color{red} \scriptsize #1}}
%DIF END CFONT PREAMBLE

%DIF FONTSTRIKE PREAMBLE
\RequirePackage[normalem]{ulem}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\providecommand{\DIFadd}[1]{{\sf #1}}
\providecommand{\DIFdel}[1]{{\footnotesize \sout{#1}}}
%DIF END FONTSTRIKE PREAMBLE

%DIF CCHANGEBAR PREAMBLE
\RequirePackage[pdftex]{changebar}
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\providecommand{\DIFadd}[1]{\protect\cbstart{\protect\color{blue}#1}\protect\cbend}
\providecommand{\DIFdel}[1]{\protect\cbdelete{\protect\color{red}#1}\protect\cbdelete}
%DIF END CCHANGEBAR PREAMBLE

%DIF CFONTCHBAR PREAMBLE
\RequirePackage[pdftex]{changebar}
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\providecommand{\DIFadd}[1]{\protect\cbstart{\protect\color{blue}\sf #1}\protect\cbend}
\providecommand{\DIFdel}[1]{\protect\cbdelete{\protect\color{red}\scriptsize #1}\protect\cbdelete}
%DIF END CFONTCHBAR PREAMBLE

%DIF CULINECHBAR PREAMBLE
\RequirePackage[normalem]{ulem}
\RequirePackage[pdftex]{changebar}
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\providecommand{\DIFadd}[1]{\protect\cbstart{\protect\color{blue}\uwave{#1}}\protect\cbend}
\providecommand{\DIFdel}[1]{\protect\cbdelete{\protect\color{red}\sout{#1}}\protect\cbdelete}
%DIF END CULINECHBAR PREAMBLE

%DIF CHANGEBAR PREAMBLE
\RequirePackage[pdftex]{changebar}
\providecommand{\DIFadd}[1]{\protect\cbstart{#1}\protect\cbend}
\providecommand{\DIFdel}[1]{\protect\cbdelete}
%DIF END CHANGEBAR PREAMBLE

%DIF INVISIBLE PREAMBLE
\providecommand{\DIFadd}[1]{#1}
\providecommand{\DIFdel}[1]{}
%DIF END INVISIBLE PREAMBLE

%DIF BOLD PREAMBLE
\DeclareOldFontCommand{\bf}{\normalfont\bfseries}{\mathbf}
\providecommand{\DIFadd}[1]{{\bf #1}}
\providecommand{\DIFdel}[1]{}
%DIF END BOLD PREAMBLE

%DIF PDFCOMMENT PREAMBLE
\RequirePackage{pdfcomment} %DIF PREAMBLE
\providecommand{\DIFadd}[1]{\pdfmarkupcomment[author=ADD:,markup=Underline]{#1}{}}
\providecommand{\DIFdel}[1]{\pdfcomment[icon=Insert,author=DEL:,hspace=12pt]{#1}}
%DIF END PDFCOMMENT PREAMBLE

%% SUBTYPES (Markers for beginning and end of changed blocks)

%DIF SAFE PREAMBLE
\providecommand{\DIFaddbegin}{}
\providecommand{\DIFaddend}{}
\providecommand{\DIFdelbegin}{}
\providecommand{\DIFdelend}{}
\providecommand{\DIFmodbegin}{}
\providecommand{\DIFmodend}{}
%DIF END SAFE PREAMBLE

%DIF MARGIN PREAMBLE
\providecommand{\DIFaddbegin}{\protect\marginpar{a[}}
\providecommand{\DIFaddend}{\protect\marginpar{]}}
\providecommand{\DIFdelbegin}{\protect\marginpar{d[}}
\providecommand{\DIFdelend}{\protect\marginpar{]}}
\providecommand{\DIFmodbegin}{\protect\marginpar{m[}}
\providecommand{\DIFmodend}{\protect\marginpar{]}}
%DIF END MARGIN PREAMBLE

%DIF DVIPSCOL PREAMBLE
%Note: only works with dvips converter
\RequirePackage{color}
\RequirePackage{dvipscol}
\providecommand{\DIFaddbegin}{\protect\nogroupcolor{blue}}
\providecommand{\DIFaddend}{\protect\nogroupcolor{black}}
\providecommand{\DIFdelbegin}{\protect\nogroupcolor{red}}
\providecommand{\DIFdelend}{\protect\nogroupcolor{black}}
\providecommand{\DIFmodbegin}{}
\providecommand{\DIFmodend}{}
%DIF END DVIPSCOL PREAMBLE

%DIF COLOR PREAMBLE
\RequirePackage{color}
\providecommand{\DIFaddbegin}{\protect\color{blue}}
\providecommand{\DIFaddend}{\protect\color{black}}
\providecommand{\DIFdelbegin}{\protect\color{red}}
\providecommand{\DIFdelend}{\protect\color{black}}
\providecommand{\DIFmodbegin}{}
\providecommand{\DIFmodend}{}
%DIF END COLOR PREAMBLE

%DIF LABEL PREAMBLE
% To show only pages with changes (pdf) (external program pdftk needs to be installed)
% (only works for simple documents with non-repeated page numbers, otherwise use ZLABEL)
% pdflatex diff.tex
% pdflatex diff.tex
%pdftk diff.pdf cat \
%`perl -lne '\
% if (m/\\newlabel{DIFchg[b](\d*)}{{.*}{(.*)}}/) { $start{$1}=$2; print $2}\
% if (m/\\newlabel{DIFchg[e](\d*)}{{.*}{(.*)}}/) { \
%      if (defined($start{$1})) { \
%         for ($j=$start{$1}; $j<=$2; $j++) {print "$j";}\
%      } else { \
%         print "$2"\
%      }\
% }' diff.aux \
% | uniq \
% | tr  \\n ' '` \
% output diff-changedpages.pdf
% To show only pages with changes (dvips/dvipdf)
% dvips -pp `\
% [ put here the perl script from above]
% | uniq | tr -s \\n ','`
\typeout{Check comments in preamble of output for instructions how to show only pages where changes have been made}
\newcount\DIFcounterb
\global\DIFcounterb 0\relax
\newcount\DIFcountere
\global\DIFcountere 0\relax
\providecommand{\DIFaddbegin}{\global\advance\DIFcounterb 1\relax\label{DIFchgb\the\DIFcounterb}}
\providecommand{\DIFaddend}{\global\advance\DIFcountere 1\relax\label{DIFchge\the\DIFcountere}}
\providecommand{\DIFdelbegin}{\global\advance\DIFcounterb 1\relax\label{DIFchgb\the\DIFcounterb}}
\providecommand{\DIFdelend}{\global\advance\DIFcountere 1\relax\label{DIFchge\the\DIFcountere}}
\providecommand{\DIFmodbegin}{\global\advance\DIFcounterb 1\relax\label{DIFchgb\the\DIFcounterb}}
\providecommand{\DIFmodend}{\global\advance\DIFcountere 1\relax\label{DIFchge\the\DIFcountere}}
%DIF END LABEL PREAMBLE

%DIF ZLABEL PREAMBLE
% To show only pages with changes (pdf) (external program pdftk needs to be installed)
% (uses zref for reference to absolute page numbers)
% pdflatex diff.tex
% pdflatex diff.tex
%pdftk diff.pdf cat \
%`perl -lne 'if (m/\\zref\@newlabel{DIFchgb(\d*)}{.*\\abspage{(\d*)}}/ ) { $start{$1}=$2; print $2 } \
%  if (m/\\zref\@newlabel{DIFchge(\d*)}{.*\\abspage{(\d*)}}/) { \
%      if (defined($start{$1})) { \
%         for ($j=$start{$1}; $j<=$2; $j++) {print "$j";}\
%      } else { \
%         print "$2"\
%      }\
% }' diff.aux \
% | uniq \
% | tr  \\n ' '` \
% output diff-changedpages.pdf
% To show only pages with changes (dvips/dvipdf)
% latex diff.tex
% latex diff.tex
% dvips -pp `perl -lne 'if (m/\\newlabel{DIFchg[be]\d*}{{.*}{(.*)}}/) { print $1 }' diff.aux | uniq | tr -s \\n ','` diff.dvi 
\typeout{Check comments in preamble of output for instructions how to show only pages where changes have been made}
\usepackage[user,abspage]{zref}
\newcount\DIFcounterb
\global\DIFcounterb 0\relax
\newcount\DIFcountere
\global\DIFcountere 0\relax
\providecommand{\DIFaddbegin}{\global\advance\DIFcounterb 1\relax\zlabel{DIFchgb\the\DIFcounterb}}
\providecommand{\DIFaddend}{\global\advance\DIFcountere 1\relax\zlabel{DIFchge\the\DIFcountere}}
\providecommand{\DIFdelbegin}{\global\advance\DIFcounterb 1\relax\zlabel{DIFchgb\the\DIFcounterb}}
\providecommand{\DIFdelend}{\global\advance\DIFcountere 1\relax\zlabel{DIFchge\the\DIFcountere}}
\providecommand{\DIFmodbegin}{\global\advance\DIFcounterb 1\relax\zlabel{DIFchgb\the\DIFcounterb}}
\providecommand{\DIFmodend}{\global\advance\DIFcountere 1\relax\zlabel{DIFchge\the\DIFcountere}}
%DIF END ZLABEL PREAMBLE

%DIF ONLYCHANGEDPAGE PREAMBLE
\RequirePackage{atbegshi}
\RequirePackage{etoolbox}
\RequirePackage{zref}
% redefine label command to write immediately to aux file - page references will be lost
\makeatletter \let\oldlabel\label% Store \label 
\renewcommand{\label}[1]{% Update \label to write to the .aux immediately 
\zref@wrapper@immediate{\oldlabel{#1}}} 
\makeatother 
\newbool{DIFkeeppage}
\newbool{DIFchange}
\boolfalse{DIFkeeppage}
\boolfalse{DIFchange}
\AtBeginShipout{%
  \ifbool{DIFkeeppage}
        {\global\boolfalse{DIFkeeppage}}  % True DIFkeeppage
         {\ifbool{DIFchange}{\global\boolfalse{DIFkeeppage}}{\global\boolfalse{DIFkeeppage}\AtBeginShipoutDiscard}} % False DIFkeeppage
}
\providecommand{\DIFaddbegin}{\global\booltrue{DIFkeeppage}\global\booltrue{DIFchange}}
\providecommand{\DIFaddend}{\global\booltrue{DIFkeeppage}\global\boolfalse{DIFchange}}
\providecommand{\DIFdelbegin}{\global\booltrue{DIFkeeppage}\global\booltrue{DIFchange}}
\providecommand{\DIFdelend}{\global\booltrue{DIFkeeppage}\global\boolfalse{DIFchange}}
\providecommand{\DIFmodbegin}{\global\booltrue{DIFkeeppage}\global\booltrue{DIFchange}}
\providecommand{\DIFmodend}{\global\booltrue{DIFkeeppage}\global\boolfalse{DIFchange}}
%DIF END ONLYCHANGEDPAGE PREAMBLE

%% FLOAT TYPES 

%DIF FLOATSAFE PREAMBLE
\providecommand{\DIFaddFL}[1]{\DIFadd{#1}}
\providecommand{\DIFdelFL}[1]{\DIFdel{#1}}
\providecommand{\DIFaddbeginFL}{}
\providecommand{\DIFaddendFL}{}
\providecommand{\DIFdelbeginFL}{}
\providecommand{\DIFdelendFL}{}
%DIF END FLOATSAFE PREAMBLE

%DIF IDENTICAL PREAMBLE
\providecommand{\DIFaddFL}[1]{\DIFadd{#1}}
\providecommand{\DIFdelFL}[1]{\DIFdel{#1}}
\providecommand{\DIFaddbeginFL}{\DIFaddbegin}
\providecommand{\DIFaddendFL}{\DIFaddend}
\providecommand{\DIFdelbeginFL}{\DIFdelbegin}
\providecommand{\DIFdelendFL}{\DIFdelend}
%DIF END IDENTICAL PREAMBLE

%DIF TRADITIONALSAFE PREAMBLE
% procidecommand color to make this work for TRADITIONAL and CTRADITIONAL
\providecommand{\color}[1]{}
\providecommand{\DIFaddFL}[1]{\DIFadd{#1}}
\providecommand{\DIFdel}[1]{{\protect\color{red}[..{\scriptsize {removed: #1}} ]}}
\providecommand{\DIFaddbeginFL}{}
\providecommand{\DIFaddendFL}{}
\providecommand{\DIFdelbeginFL}{}
\providecommand{\DIFdelendFL}{}
%DIF END TRADITIONALSAFE PREAMBLE

% see:
%  http://tex.stackexchange.com/questions/47351/can-i-redefine-a-command-to-contain-itself 

%DIF HIGHLIGHTGRAPHICS PREAMBLE
\RequirePackage{settobox}
\RequirePackage{letltxmacro}
\newsavebox{\DIFdelgraphicsbox}
\newlength{\DIFdelgraphicswidth}
\newlength{\DIFdelgraphicsheight}
% store original definition of \includegraphics
\LetLtxMacro{\DIFOincludegraphics}{\includegraphics}
\newcommand{\DIFaddincludegraphics}[2][]{{\color{blue}\fbox{\DIFOincludegraphics[#1]{#2}}}}
\newcommand{\DIFdelincludegraphics}[2][]{%
\sbox{\DIFdelgraphicsbox}{\DIFOincludegraphics[#1]{#2}}%
\settoboxwidth{\DIFdelgraphicswidth}{\DIFdelgraphicsbox}
\settoboxtotalheight{\DIFdelgraphicsheight}{\DIFdelgraphicsbox}
\scalebox{\DIFscaledelfig}{%
\parbox[b]{\DIFdelgraphicswidth}{\usebox{\DIFdelgraphicsbox}\\[-\baselineskip] \rule{\DIFdelgraphicswidth}{0em}}\llap{\resizebox{\DIFdelgraphicswidth}{\DIFdelgraphicsheight}{%
\setlength{\unitlength}{\DIFdelgraphicswidth}%
\begin{picture}(1,1)%
\thicklines\linethickness{2pt}
{\color[rgb]{1,0,0}\put(0,0){\framebox(1,1){}}}%
{\color[rgb]{1,0,0}\put(0,0){\line( 1,1){1}}}%
{\color[rgb]{1,0,0}\put(0,1){\line(1,-1){1}}}%
\end{picture}%
}\hspace*{3pt}}}
}
\LetLtxMacro{\DIFOaddbegin}{\DIFaddbegin}
\LetLtxMacro{\DIFOaddend}{\DIFaddend}
\LetLtxMacro{\DIFOdelbegin}{\DIFdelbegin}
\LetLtxMacro{\DIFOdelend}{\DIFdelend}
\DeclareRobustCommand{\DIFaddbegin}{\DIFOaddbegin \let\includegraphics\DIFaddincludegraphics}
\DeclareRobustCommand{\DIFaddend}{\DIFOaddend \let\includegraphics\DIFOincludegraphics}
\DeclareRobustCommand{\DIFdelbegin}{\DIFOdelbegin \let\includegraphics\DIFdelincludegraphics}
\DeclareRobustCommand{\DIFdelend}{\DIFOaddend \let\includegraphics\DIFOincludegraphics}
\LetLtxMacro{\DIFOaddbeginFL}{\DIFaddbeginFL}
\LetLtxMacro{\DIFOaddendFL}{\DIFaddendFL}
\LetLtxMacro{\DIFOdelbeginFL}{\DIFdelbeginFL}
\LetLtxMacro{\DIFOdelendFL}{\DIFdelendFL}
\DeclareRobustCommand{\DIFaddbeginFL}{\DIFOaddbeginFL \let\includegraphics\DIFaddincludegraphics}
\DeclareRobustCommand{\DIFaddendFL}{\DIFOaddendFL \let\includegraphics\DIFOincludegraphics}
\DeclareRobustCommand{\DIFdelbeginFL}{\DIFOdelbeginFL \let\includegraphics\DIFdelincludegraphics}
\DeclareRobustCommand{\DIFdelendFL}{\DIFOaddendFL \let\includegraphics\DIFOincludegraphics}
%DIF END HIGHLIGHTGRAPHICS PREAMBLE

%% SPECIAL PACKAGE PREAMBLE COMMANDS

% Standard \DIFadd and \DIFdel are redefined as \DIFaddtex and \DIFdeltex
% when hyperref package is included.
%DIF HYPERREF PREAMBLE
\providecommand{\DIFadd}[1]{\texorpdfstring{\DIFaddtex{#1}}{#1}}
\providecommand{\DIFdel}[1]{\texorpdfstring{\DIFdeltex{#1}}{}}
%DIF END HYPERREF PREAMBLE


