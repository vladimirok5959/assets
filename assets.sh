#!/bin/bash

CURRENT_DIR="$(dirname "$0")"

SOURCE_FILE=${1}
TARGET_FILE=${2}

# Check if source file is set
if [[ "${SOURCE_FILE}" = "" ]]; then
	echo "Source file is not set"
	exit 1
fi

# Check if target file is set
if [[ "${TARGET_FILE}" = "" ]]; then
	# Try to generate from source file name
	TARGET_FILE=$(echo "${SOURCE_FILE}" | sed 's/\.dev\.\(css\|js\)$/.\1/')
	if [[ "${TARGET_FILE}" = "" ]]; then
		echo "Target file is not set"
		exit 1
	fi
fi

# Check if source file exists
if [[ ! -f "${SOURCE_FILE}" ]]; then
	echo "Source file does not exists: ${SOURCE_FILE}"
	exit 1
fi

# Re-create empty target file
if [[ -f "${TARGET_FILE}" ]]; then
	rm ${TARGET_FILE}
fi
touch ${TARGET_FILE}

# Create cache dir if not exists
if [[ ! -d "${CURRENT_DIR}/.cache" ]]; then
	mkdir "${CURRENT_DIR}/.cache"
fi

IFS=""
while read -r line; do
	if [[ ${line} == "/*"* ]]; then
		if [[ ${line} == *"*/" ]]; then
			if [[ ${line} == *"import("* ]]; then
				FILE_TO_IMPORT=$(echo "${line}" | grep -oP "/*\s?import\(\K[^)]+")
				CACHE_NAME=$(echo "${FILE_TO_IMPORT}" | md5sum | cut -f1 -d" ")
				CACHE_NAME=$(echo "${CACHE_NAME}-$(basename ${FILE_TO_IMPORT})")
				CACHE_FILE="${CURRENT_DIR}/.cache/${CACHE_NAME}"

				DATA_TO_IMPORT=""

				# Local import
				if [[ ${FILE_TO_IMPORT} == "./"* ]]; then
					FILE_TO_IMPORT="$(dirname "${SOURCE_FILE}")$(echo "${FILE_TO_IMPORT}" | sed 's/^\.//')"
					if [[ -f "${FILE_TO_IMPORT}" ]]; then
						DATA_TO_IMPORT=$(cat "${FILE_TO_IMPORT}")
					fi
				fi

				# Remote import
				if [[ ${FILE_TO_IMPORT} == "http"* ]]; then
					if [[ ! -f "${CACHE_FILE}" ]]; then
						DATA_TO_IMPORT=$(curl -s "${FILE_TO_IMPORT}")
						echo "${DATA_TO_IMPORT}" > ${CACHE_FILE}
					else
						DATA_TO_IMPORT=$(cat ${CACHE_FILE})
					fi
				fi

				echo "${DATA_TO_IMPORT}" >> ${TARGET_FILE}
			else
				echo "${line}" >> ${TARGET_FILE}
			fi
		else
			echo "${line}" >> ${TARGET_FILE}
		fi
	else
		echo "${line}" >> ${TARGET_FILE}
	fi
done < ${SOURCE_FILE}

# Minify target file (CSS, JS)
# Install yui-compressor by command:
# sudo apt-get install yui-compressor
CHECK_YUI_COMPRESSOR=$(command -v yui-compressor 2> /dev/null)
if [[ "${CHECK_YUI_COMPRESSOR}" != "" ]]; then
	yui-compressor ${TARGET_FILE} -o ${TARGET_FILE}
fi
