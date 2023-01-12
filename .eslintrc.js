//palun 2022-12-20: not using eslint... using lsp-typescript... so unsure if this file does anything...

module.exports =  {
	parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
	extends:  [
		'plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
	],
	parserOptions:  {
		ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
		sourceType:  'module',  // Allows for the use of imports
		ecmaFeatures:  {
			jsx:  true,  // Allows for the parsing of JSX
		},
	},
	rules:  {
		"indent": ["warn","tab"],
		//palun: see below in 'overrides' about rules not being respected
	},
	ignorePatterns:['**/.*'],
	overrides:[
		{
			files: ['*.ts', '*.tsx'],
			parserOptions:{
				project:'./tsconfig.json',
			},
			//palun: I think rules from rules outside the 'overrides' block will not be implemented if the 
			//       one of the 'extends' has rules for the same, so we put all rules here
			rules:{
				"@typescript-eslint/no-explicit-any": "off",
				"prefer-rest-params":"off",
				"no-unused-vars":"off", //use vv instead. see bug: github.com/typescript-eslint/typescript-eslint/issues/2486
				"@typescript-eslint/no-unused-vars":"warn",
				"@typescript-eslint/no-inferrable-types":"warn",
				"@typescript-eslint/no-empty-interface":"off",
				"no-var":"warn"
			},
			extends:  [
				'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
			]
		}
	],
	settings:  {
		react:  {
			version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
};