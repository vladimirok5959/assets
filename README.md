# assets

Collection of web assets for reuse in other projects. The main goal of all of this, it's making to possible import and reuse CSS and JS code for usual CSS and JS files, without any of something like Sass for CSS or NodeJs for JS, just simple CSS/JS and unix utilites. Additionaly `yui-compressor` utility is used for files minification. It's used by default and don't works without `yui-compressor` but you can modify makefile `assets.makefile` and remove `--check-yui-compressor` target everywhere

## How to use

Install yui-compressor tool:

```sh
sudo apt-get install yui-compressor
```

Include to your main makefile:

```makefile
.assets.makefile:
    curl -fsSL -o $@ https://raw.githubusercontent.com/vladimirok5959/assets/main/assets.makefile

include .assets.makefile
```

Add to gitignore file:

```txt
/.cache/
.*.makefile
assets.sh
```

Keep your CSS and JS files with `*.dev.css` and `*.dev.js` suffix. Run `make assets` command to process all finded files starting recursively from your makefile (root project) directory

You can include CSS or JS files from internet into local file by `import()` command inside CSS or JS file. Check `/test/` directory and `/test/test.dev.css` file. For example:

```css
/* import(https://path/to/file/reset.css) */
/* import(https://path/to/file/controls/checkbox/ios.css) */

.example {
    background-color: red;
}
```

In the result you will get combined and minified CSS file without `.dev.` suffix. And the same works for JS files. Note: for reducing http requests `/.cache/` directory is used. Run `make assets-clear-cache` for clearing cached files
