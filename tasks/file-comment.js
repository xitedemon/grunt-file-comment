module.exports = function (grunt) {
	'use strict';
	var Path = require('path');
	grunt.registerMultiTask('file-comment', 'add comments to file', function () {
		var options = this.options({
			comments: ['autogenerated'],
			carriageReturn: "\n",
			prepend: true,
			syntaxes: {
				'*': '//',
			}
		});
		if(!options.syntaxes['*'])
			options.syntaxes['*'] = '//';

		var count = 0;

		var comment = '', content, extension, commentSyntax;
		this.files.forEach(function(el) {

			el.src.filter(function(filePath) {
				var witness = grunt.file.exists(filePath);
				if(!witness)
					grunt.log.warn('Source file "' + filePath + '" not found.');

				return witness;
			}).map(function(filePath) {
				content = grunt.file.read(filePath);

				extension = Path.extname(filePath);
				commentSyntax = ( extension in options.syntaxes ? options.syntaxes[extension] : options.syntaxes['*'] );


				comment = '';
				for(var i = 0; i<options.comments.length; i++) {
					if(typeof commentSyntax === 'string')
						comment += commentSyntax + ' ' + options.comments[i] + options.carriageReturn;
					else
						comment += commentSyntax[0] + ' ' + options.comments[i] + (commentSyntax.length > 1 ? ' ' + commentSyntax[1] : '') + options.carriageReturn;
				}

				content = options.prepend ? comment + grunt.file.read(el.src[0]) : grunt.file.read(el.src[0]) + options.carriageReturn + comment;

				grunt.file.write(el.dest, content);
				grunt.log.debug('File "' + el.dest + '" edited.');
				count++;
			});

		});
		grunt.log.ok(count + ' files edited');
	});
};