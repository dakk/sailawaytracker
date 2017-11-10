module.exports = {
  build_dir: 'build',
  temp_dir: 'tmp',
  debug_dir: 'debug',
  
  app_dir: 'src',
  app_files: {
    js: ['*.js','**/*.js'],
    sass: ['*.scss','**/*.scss'],
    jade: ['*.jade','**/*.jade','!_*.jade','!**/_*.js'],
    css_file: 'app',
    js_file: 'app',
    jade_dir: 'tpl'
  },
  
  test_files: {
    js: []
  }
};