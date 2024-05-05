# Generate preamble from preamble config

# preamble config contains:
# - new_text: dict
#   - color: list[R, G, B] or None
#   - style: underline_wave, strikeout, or None
# - old_text: dict(same as new_text) or null
#   - null: do not show the old text

def get_preamble(config):
    preamble = get_preamble_major(config)
    preamble += '\n%DIF SAFE PREAMBLE'
    preamble += PREAMBLE_SUBTYPE['SAFE']
    preamble += '%DIF FLOATSAFE PREAMBLE'
    preamble += PREAMBLE_FLOAT['FLOATSAFE']
    return preamble

PACKAGE_DEFS = {'ulem': r'\RequirePackage[normalem]{ulem}'}
def get_preamble_major(config):
    color_prefix = r'\RequirePackage{color}'
    color_defs = []
    main = []
    required_packages = set()
    def add_color(name,r,g,b):
        color_defs.append(f'\\definecolor{{{name}}}{{RGB}}{{{r},{g},{b}}}')
    def handle_one(config: dict, is_add):
        prefix = r'\providecommand{\DIFadd}[1]{' if is_add else r'\providecommand{\DIFdel}[1]{'
        suffix = '}'
        if config is None:
            main.append(prefix + suffix)
        else:
            current = '#1'
            if config.get('style', None) is not None:
                if config['style'] == 'underline_wave':
                    required_packages.add('ulem')
                    current = r'\uwave{' + current + '}'
                elif config['style'] == 'strikeout':
                    required_packages.add('ulem')
                    current = r'\sout{' + current + '}'
                else:
                    raise ValueError('unknown style!')
            if config.get('color', None) is not None:
                cname = 'myadd' if is_add else 'mydel'
                add_color(cname, *config['color'])
                current = r'{\color{' + cname + '}' + current + '}'
            main.append(prefix + r'\protect' + current + suffix)
    handle_one(config.get('new_text', None), True)
    handle_one(config.get('old_text', None), False)
    if (len(color_defs) != 0):
        color_defs = color_prefix + ''.join(color_defs)
        main.insert(0, color_defs)
    for package in required_packages:
        main.insert(0, PACKAGE_DEFS[package])
    return '\n'.join(main)

PREAMBLE_MAJOR = {
    "UNDERLINE": r'''
\RequirePackage[normalem]{ulem}
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\providecommand{\DIFadd}[1]{{\protect\color{blue}\uwave{#1}}}
\providecommand{\DIFdel}[1]{{\protect\color{red}\sout{#1}}}                     
''',
    "CTRADITIONAL": r'''
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\RequirePackage[stable]{footmisc}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\providecommand{\DIFadd}[1]{{\protect\color{blue} \sf #1}}
\providecommand{\DIFdel}[1]{{\protect\color{red} [..\footnote{removed: #1} ]}}
''',
    "TRADITIONAL": r'''
\RequirePackage[stable]{footmisc}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\providecommand{\DIFadd}[1]{{\sf #1}}
\providecommand{\DIFdel}[1]{{[..\footnote{removed: #1} ]}}
''',
    "CFONT": r'''
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\providecommand{\DIFadd}[1]{{\protect\color{blue} \sf #1}}
\providecommand{\DIFdel}[1]{{\protect\color{red} \scriptsize #1}}
''',
    "FONTSTRIKE": r'''
\RequirePackage[normalem]{ulem}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\providecommand{\DIFadd}[1]{{\sf #1}}
\providecommand{\DIFdel}[1]{{\footnotesize \sout{#1}}}
''',
    "CCHANGEBAR": r'''
\RequirePackage[pdftex]{changebar}
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\providecommand{\DIFadd}[1]{\protect\cbstart{\protect\color{blue}#1}\protect\cbend}
\providecommand{\DIFdel}[1]{\protect\cbdelete{\protect\color{red}#1}\protect\cbdelete}
''',
    "CFONTCHBAR": r'''
\RequirePackage[pdftex]{changebar}
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\providecommand{\DIFadd}[1]{\protect\cbstart{\protect\color{blue}\sf #1}\protect\cbend}
\providecommand{\DIFdel}[1]{\protect\cbdelete{\protect\color{red}\scriptsize #1}\protect\cbdelete}
''',
    "CULINECHBAR": r'''
\RequirePackage[normalem]{ulem}
\RequirePackage[pdftex]{changebar}
\RequirePackage{color}\definecolor{RED}{rgb}{1,0,0}\definecolor{BLUE}{rgb}{0,0,1}
\providecommand{\DIFadd}[1]{\protect\cbstart{\protect\color{blue}\uwave{#1}}\protect\cbend}
\providecommand{\DIFdel}[1]{\protect\cbdelete{\protect\color{red}\sout{#1}}\protect\cbdelete}
''',
    "CHANGEBAR": r'''
\RequirePackage[pdftex]{changebar}
\providecommand{\DIFadd}[1]{\protect\cbstart{#1}\protect\cbend}
\providecommand{\DIFdel}[1]{\protect\cbdelete}
''',
    "INVISIBLE": r'''
\providecommand{\DIFadd}[1]{#1}
\providecommand{\DIFdel}[1]{}
''',
    "BOLD": r'''
\DeclareOldFontCommand{\bf}{\normalfont\bfseries}{\mathbf}
\providecommand{\DIFadd}[1]{{\bf #1}}
\providecommand{\DIFdel}[1]{}
''',
    "PDFCOMMENT": r'''
\RequirePackage{pdfcomment} %DIF PREAMBLE
\providecommand{\DIFadd}[1]{\pdfmarkupcomment[author=ADD:,markup=Underline]{#1}{}}
\providecommand{\DIFdel}[1]{\pdfcomment[icon=Insert,author=DEL:,hspace=12pt]{#1}}
''',
}

PREAMBLE_SUBTYPE = {
    "SAFE": r'''
\providecommand{\DIFaddbegin}{}
\providecommand{\DIFaddend}{}
\providecommand{\DIFdelbegin}{}
\providecommand{\DIFdelend}{}
\providecommand{\DIFmodbegin}{}
\providecommand{\DIFmodend}{}
''',

    "MARGIN": r'''
\providecommand{\DIFaddbegin}{\protect\marginpar{a[}}
\providecommand{\DIFaddend}{\protect\marginpar{]}}
\providecommand{\DIFdelbegin}{\protect\marginpar{d[}}
\providecommand{\DIFdelend}{\protect\marginpar{]}}
\providecommand{\DIFmodbegin}{\protect\marginpar{m[}}
\providecommand{\DIFmodend}{\protect\marginpar{]}}
''',

    "DVIPSCOL": r'''
%Note: only works with dvips converter
\RequirePackage{color}
\RequirePackage{dvipscol}
\providecommand{\DIFaddbegin}{\protect\nogroupcolor{blue}}
\providecommand{\DIFaddend}{\protect\nogroupcolor{black}}
\providecommand{\DIFdelbegin}{\protect\nogroupcolor{red}}
\providecommand{\DIFdelend}{\protect\nogroupcolor{black}}
\providecommand{\DIFmodbegin}{}
\providecommand{\DIFmodend}{}
''',

    "COLOR": r'''
\RequirePackage{color}
\providecommand{\DIFaddbegin}{\protect\color{blue}}
\providecommand{\DIFaddend}{\protect\color{black}}
\providecommand{\DIFdelbegin}{\protect\color{red}}
\providecommand{\DIFdelend}{\protect\color{black}}
\providecommand{\DIFmodbegin}{}
\providecommand{\DIFmodend}{}
''',
}

PREAMBLE_FLOAT = {

    "FLOATSAFE": r'''
\providecommand{\DIFaddFL}[1]{\DIFadd{#1}}
\providecommand{\DIFdelFL}[1]{\DIFdel{#1}}
\providecommand{\DIFaddbeginFL}{}
\providecommand{\DIFaddendFL}{}
\providecommand{\DIFdelbeginFL}{}
\providecommand{\DIFdelendFL}{}
''',

    "IDENTICAL": r'''
\providecommand{\DIFaddFL}[1]{\DIFadd{#1}}
\providecommand{\DIFdelFL}[1]{\DIFdel{#1}}
\providecommand{\DIFaddbeginFL}{\DIFaddbegin}
\providecommand{\DIFaddendFL}{\DIFaddend}
\providecommand{\DIFdelbeginFL}{\DIFdelbegin}
\providecommand{\DIFdelendFL}{\DIFdelend}
''',

    "TRADITIONALSAFE": r'''
% procidecommand color to make this work for TRADITIONAL and CTRADITIONAL
\providecommand{\color}[1]{}
\providecommand{\DIFaddFL}[1]{\DIFadd{#1}}
\providecommand{\DIFdel}[1]{{\protect\color{red}[..{\scriptsize {removed: #1}} ]}}
\providecommand{\DIFaddbeginFL}{}
\providecommand{\DIFaddendFL}{}
\providecommand{\DIFdelbeginFL}{}
\providecommand{\DIFdelendFL}{}
''',
}

if __name__ == '__main__':
    # read json from stdin, and print the result preamble
    import json, sys
    config = json.load(sys.stdin)
    print(get_preamble(config))
    sys.stdout.flush()
