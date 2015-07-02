# eslint-plugin-flowtype
A plugin for ESLint that strips FlowType type annonations before linting the  files.

If your code uses flow type annotations ( http://flowtype.org/ ) and you would like to lint it using ESLint currently the only option is using babel-eslint as ESLint parser instead of the default Espree.

However, Babel-Eslint currently monkey patches ESLint and I had lots of issues with upgrading to newer versions of ESlint and Babel-Eslint. 

This plugins strips the type annotations before handing off the file for linting as such you are able to use the latest and greates ESLint parser: Espree on FlowType'd code.

Internally the plugin makes use of Recast for performing AST transforms and stripping the annotations together with esprima-fb parser( which is now deprecated but i couldn't get flow-parser to play nice with recast as such had to use esprima ).

The plugin also preserves the line numbers by using Recast source maps.

# Configuration
Enable the plugin in eslint.rc file by adding it to the plugins section:

plugins: ["flowtype"]

# Know issues
Issues with max-len ESlint rule reporting the line/column number as "0:0"

# TO DO:
Investigate the use of flow-parser for parsing the source code and stripping out any annotations. Currently the problem is that we cannot get Recast to play nice with "flow-parser".
I would appreciate any help on this matter.

# Thanks
Many thanks to fkling ( https://github.com/fkling/flow-typestrip ) for writing up the type annotation striping logic. 
