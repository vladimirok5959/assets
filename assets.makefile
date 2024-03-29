# .assets.makefile:
#	curl -fsSL -o $@ https://raw.githubusercontent.com/vladimirok5959/assets/main/assets.makefile
# include .assets.makefile

.PHONY: assets

CHECK_YUI_COMPRESSOR := $(shell command -v yui-compressor 2> /dev/null)
CURRENT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
FILES_CSS := $(shell find ${CURRENT_DIR} -type f -name '*.dev.css')
FILES_JS := $(shell find ${CURRENT_DIR} -type f -name '*.dev.js')

--check-yui-compressor:
	@if [ "${CHECK_YUI_COMPRESSOR}" = "" ]; then \
		echo "Error: yui-compressor is not installed"; \
		exit 1; \
	fi

--check-assets-sh-file:
	@test -f assets.sh || (curl -fsSL -o assets.sh https://raw.githubusercontent.com/vladimirok5959/assets/main/assets.sh && chmod +x assets.sh)

--assets-css: --check-yui-compressor --check-assets-sh-file
	@for file in ${FILES_CSS}; do \
		${CURRENT_DIR}/assets.sh $${file}; \
	done

--assets-js: --check-yui-compressor --check-assets-sh-file
	@for file in ${FILES_JS}; do \
		${CURRENT_DIR}/assets.sh $${file}; \
	done

assets: --assets-css --assets-js

assets-clear-cache:
	@find ${CURRENT_DIR}/.cache/ -type f -not -name '.keep' -delete
	@rm ${CURRENT_DIR}/assets.sh
